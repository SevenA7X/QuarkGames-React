// Utiliza NavLink de React Router (rutas sin #) y muestra las unidades del carrito
import { NavLink } from 'react-router';

export default function Header({ unidades = 0, sesionActiva, alCerrarSesion }) {
  return (
    <header className="cabecera">
      <nav aria-label="Navegación principal">
        <NavLink to="/" end>🎮 Quark Games</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/carrito">Carrito ({unidades})</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        {sesionActiva && (
          <button type="button" onClick={alCerrarSesion}>
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
}