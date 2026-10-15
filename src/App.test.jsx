import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from './App.jsx';
import { TiendaProvider } from './context/TiendaContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

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
    await user.click(screen.getByRole('link', { name: 'Productos' }));

    // 3 Comprobar
    expect(
      await screen.findByRole('heading', { name: 'Catálogo de Productos' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute(
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
    expect(screen.getByRole('link', { name: 'Carrito (0)' })).toBeInTheDocument();

    // 2 Actuar: agregamos el primer producto disponible
    const botones = await screen.findAllByRole('button', { name: 'Agregar al carrito' });
    await user.click(botones[0]);

    // 3 Comprobar: el Header y el mensaje leen el mismo estado global
    expect(screen.getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Producto agregado.');
  });

  it('muestra la página no encontrada para una ruta desconocida', async () => {
    // 1 Preparar y 2 Actuar
    renderizarApp('/ruta-que-no-existe');

    // 3 Comprobar: la página 404 conserva el Header porque es hija de Layout
    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Productos' })).toBeInTheDocument();
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
});
