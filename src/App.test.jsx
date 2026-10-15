import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from './App.jsx';
import { TiendaProvider } from './context/TiendaContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

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

    // 3 Comprobar: el Header y el mensaje leen el mismo estado global
    expect(screen.getByRole('link', { name: 'Carrito 1' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Producto agregado.');
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
    expect(screen.getAllByRole('link', { name: /^Ver / })).toHaveLength(3);
  });

  it('descuenta el stock visible al confirmar la compra', async () => {
    // 1 Preparar: Elden Ring, el primer juego del catálogo, parte con 5 unidades
    const user = userEvent.setup();
    renderizarApp('/productos');
    expect(await screen.findByText('Stock: 5')).toBeInTheDocument();

    // 2 Actuar: agregamos 2 unidades, vamos al carrito y confirmamos el pago
    const botones = await screen.findAllByRole('button', { name: 'Agregar al carrito' });
    await user.click(botones[0]);
    await user.click(botones[0]);
    await user.click(screen.getByRole('link', { name: 'Carrito 2' }));
    await user.click(screen.getByRole('button', { name: 'Proceder al pago' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));

    // 3 Comprobar: el carrito queda vacío y, al volver al catálogo, el stock bajó de 5 a 3
    expect(
      await screen.findByRole('heading', { name: 'Tu carrito está vacío' }),
    ).toBeInTheDocument();
    await user.click(await screen.findByRole('link', { name: 'Juegos' }));
    expect(await screen.findByText('Stock: 3')).toBeInTheDocument();
  });
});
