import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from './App.jsx';
import { TiendaProvider } from './context/TiendaContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { simularBackend } from './test/backendFalso.js';
import { guardarToken } from './services/api.js';

// App necesita un router y los dos contextos, porque Header, Layout y las páginas
// usan useTienda() y useAuth(). BrowserRouter vive en main.jsx, que no se monta en las pruebas,
// así que usamos MemoryRouter e indicamos en qué ruta parte la prueba.
function renderizarApp(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <TiendaProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TiendaProvider>
    </MemoryRouter>,
  );
}

// Catálogo, carrito y login vienen del backend. En las pruebas, simularBackend() reemplaza
// fetch por un backend en memoria que responde como los microservicios reales.
let backend;
beforeEach(() => {
  backend = simularBackend();
});

describe('App: integración de rutas, sesión y carrito', () => {
  it('navega a Productos y marca el enlace activo', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    renderizarApp('/');

    // 2 Actuar
    await user.click(screen.getByRole('link', { name: 'Juegos' }));

    // 3 Comprobar
    expect(
      await screen.findByRole('heading', { name: 'Catálogo de Productos' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Juegos' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('redirige a /login cuando se entra a /admin sin sesión', async () => {
    // 1 Preparar y 2 Actuar: la prueba parte directamente en /admin
    renderizarApp('/admin');

    // 3 Comprobar: RutaAdmin debe haber mostrado el login en lugar del panel
    expect(
      await screen.findByRole('heading', { name: 'Inicio de sesión administrador' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Administración de productos' }),
    ).not.toBeInTheDocument();
  });

  it('inicia sesión con admin / 1234 y muestra el panel', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    renderizarApp('/login');

    // 2 Actuar
    await user.type(screen.getByLabelText(/usuario/i), 'admin');
    await user.type(screen.getByLabelText(/contraseña/i), '1234');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    // 3 Comprobar
    expect(
      await screen.findByRole('heading', { name: 'Administración de productos' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });

  it('actualiza el contador del Header al agregar un producto', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    renderizarApp('/productos');
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();

    // 2 Actuar: agregamos el primer producto disponible
    const botones = await screen.findAllByRole('button', { name: 'Agregar al carrito' });
    await user.click(botones[0]);

    // 3 Comprobar: el Header y el mensaje leen la respuesta del MS Carrito
    expect(await screen.findByRole('link', { name: 'Carrito 1' })).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent('Producto agregado.');
  });

  it('muestra la página no encontrada para una ruta desconocida', async () => {
    // 1 Preparar y 2 Actuar
    renderizarApp('/ruta-que-no-existe');

    // 3 Comprobar: la página 404 conserva el Header porque es hija de Layout
    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Juegos' })).toBeInTheDocument();
  });

  it('muestra un error por campo al enviar Contacto vacío', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    renderizarApp('/contacto');

    // 2 Actuar
    await user.click(screen.getByRole('button', { name: 'Validar mensaje' }));

    // 3 Comprobar
    expect(
      await screen.findByText('Ingresa un correo electrónico válido.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('El asunto debe tener entre 5 y 100 caracteres válidos.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('El mensaje debe tener entre 10 y 500 caracteres válidos.'),
    ).toBeInTheDocument();
  });

  it('muestra la portada con tres juegos destacados', async () => {
    // 1 Preparar y 2 Actuar: la prueba parte en la portada
    renderizarApp('/');

    // 3 Comprobar: banner, bienvenida y las tres tarjetas del catálogo inicial
    expect(
      await screen.findByRole('heading', { name: 'TU PORTAL DE VIDEOJUEGOS DIGITALES' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lo mejor de lo mejor' })).toBeInTheDocument();
    expect(await screen.findAllByRole('button', { name: /Agregar al carrito/i })).toHaveLength(4);
  });

  it('descuenta el stock visible al confirmar la compra', async () => {
    // 1 Preparar: Elden Ring, el primer juego del catálogo, parte con 5 unidades
    const user = userEvent.setup();
    renderizarApp('/productos');
    expect(await screen.findByText('Stock: 5')).toBeInTheDocument();

    // 2 Actuar: agregamos 2 unidades, vamos al carrito y confirmamos el pago
    const botones = await screen.findAllByRole('button', { name: 'Agregar al carrito' });
    await user.click(botones[0]);
    await screen.findByRole('link', { name: 'Carrito 1' });
    await user.click(botones[0]);
    await user.click(await screen.findByRole('link', { name: 'Carrito 2' }));
    await user.click(screen.getByRole('button', { name: 'Proceder al pago' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));

    // 3 Comprobar: el carrito queda vacío y, al volver al catálogo, el stock bajó de 5 a 3
    expect(
      await screen.findByRole('heading', { name: 'Tu carrito está vacío' }),
    ).toBeInTheDocument();
    await user.click(await screen.findByRole('link', { name: 'Juegos' }));
    expect(await screen.findByText('Stock: 3')).toBeInTheDocument();
    expect(backend.db.juegos[0].stock).toBe(3);
  });

  it('permite cerrar la alerta con el botón', async () => {
    // 1 Preparar: agregamos un juego para que aparezca la alerta de confirmación
    const user = userEvent.setup();
    renderizarApp('/productos');
    const botones = await screen.findAllByRole('button', { name: 'Agregar al carrito' });
    await user.click(botones[0]);
    expect(await screen.findByRole('alert')).toHaveTextContent('Producto agregado.');

    // 2 Actuar
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));

    // 3 Comprobar
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('muestra un error por campo al enviar el login vacío', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    renderizarApp('/login');

    // 2 Actuar: enviamos el formulario sin escribir nada
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    // 3 Comprobar: cada campo muestra su propio error y no se entra al panel
    expect(await screen.findByText('Ingresa tu usuario.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Administración de productos' }),
    ).not.toBeInTheDocument();
  });

  it('rechaza las credenciales incorrectas con una alerta', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    renderizarApp('/login');

    // 2 Actuar: usuario correcto, contraseña incorrecta
    await user.type(screen.getByLabelText(/usuario/i), 'admin');
    await user.type(screen.getByLabelText(/contraseña/i), '0000');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    // 3 Comprobar
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Usuario o contraseña incorrectos.',
    );
    expect(
      screen.queryByRole('heading', { name: 'Administración de productos' }),
    ).not.toBeInTheDocument();
  });
  it('mantiene la sesión al recargar si el token sigue vigente', async () => {
    // 1 Preparar: simulamos un F5 con un token ya guardado en localStorage
    guardarToken(backend.TOKEN);

    // 2 Actuar: se entra directo al panel
    renderizarApp('/admin');

    // 3 Comprobar: AuthContext validó el token con /auth/validar y RutaAdmin dejó pasar
    expect(
      await screen.findByRole('heading', { name: 'Administración de productos' }),
    ).toBeInTheDocument();
  });

  it('elimina un producto desde el panel enviando el token', async () => {
    // 1 Preparar
    const user = userEvent.setup();
    guardarToken(backend.TOKEN);
    renderizarApp('/admin');
    await screen.findByText('Elden Ring');

    // 2 Actuar: eliminar el primer producto y confirmar
    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));

    // 3 Comprobar: se envió DELETE con el token y el producto desapareció de la tabla
    expect(await screen.findByRole('alert')).toHaveTextContent('Producto eliminado.');
    expect(screen.queryByText('Elden Ring')).not.toBeInTheDocument();
    const llamada = backend.fetchSpy.mock.calls.find(([, op]) => op?.method === 'DELETE');
    expect(llamada[0]).toMatch(/\/juegos\/7$/);
    expect(llamada[1].headers.Authorization).toBe(`Bearer ${backend.TOKEN}`);
  });

  it('avisa cuando se intenta superar el stock', async () => {
    // 1 Preparar: Mario Kart tiene stock 18; dejamos el stock de Elden Ring en 1
    backend.db.juegos[0].stock = 1;
    const user = userEvent.setup();
    renderizarApp('/productos');
    const botones = await screen.findAllByRole('button', { name: 'Agregar al carrito' });

    // 2 Actuar: la segunda unidad ya no alcanza
    await user.click(botones[0]);
    await screen.findByRole('link', { name: 'Carrito 1' });
    await user.click(botones[0]);

    // 3 Comprobar: el MS Carrito respondió 409 y el contador no cambió
    expect(await screen.findByText(/Stock insuficiente\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrito 1' })).toBeInTheDocument();
  });
});
