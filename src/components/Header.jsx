// Utiliza NavLink de React Router (rutas sin #) y lee los datos desde los contextos globales.
import { NavLink } from 'react-router';
import { useTienda } from '../context/TiendaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  // Ya no recibimos props: el carrito vive en TiendaContext y la sesión en AuthContext.
  const { estado } = useTienda();
  const { sesionActiva, logout } = useAuth();

  // Estado derivado: las unidades se calculan en cada render, no se guardan en ningún lado.
  const unidades = estado.carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <header className="cabecera">
      <nav aria-label="Navegación principal">
        <NavLink to="/" end>🎮 Quark Games</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/carrito">Carrito ({unidades})</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        {sesionActiva && (
          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
}
