import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  // El carrito vive en TiendaContext y la sesión en AuthContext: el Header no recibe props.
  const { estado } = useTienda();
  const { sesionActiva, logout } = useAuth();

  // En pantallas pequeñas el menú se despliega con el botón de las tres rayas.
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  // Estado derivado: las unidades se calculan en cada render, no se guardan en ningún lado.
  const unidades = estado.carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <header>
      <Navbar
        expand="lg"
        expanded={menuAbierto}
        onToggle={setMenuAbierto}
        className="navbar-custom-color"
        data-bs-theme="dark"
        aria-label="Navegación principal"
      >
        <Container>
          <Link className="navbar-brand fw-bold" to="/" onClick={cerrarMenu}>
            Quark Games
          </Link>
          <Navbar.Toggle aria-controls="menu-principal" aria-label="Alternar navegación" />

          <Navbar.Collapse id="menu-principal">
            <Nav className="ms-auto align-items-lg-center">
              {/* NavLink agrega solo la clase "active" y aria-current="page" al enlace de la ruta actual */}
              <NavLink className="nav-link" to="/" end onClick={cerrarMenu}>
                Inicio
              </NavLink>
              <NavLink className="nav-link" to="/productos" onClick={cerrarMenu}>
                Juegos
              </NavLink>
              <NavLink className="nav-link" to="/contacto" onClick={cerrarMenu}>
                Contacto
              </NavLink>
              <NavLink className="nav-link" to="/carrito" onClick={cerrarMenu}>
                <span aria-hidden="true">🛒</span> Carrito{' '}
                {/* La insignia roja solo aparece cuando hay unidades en el carrito */}
                {unidades > 0 && (
                  <Badge bg="danger" pill className="contador-carrito">
                    {unidades}
                  </Badge>
                )}
              </NavLink>
              <NavLink className="nav-link" to="/admin" onClick={cerrarMenu}>
                <span aria-hidden="true">🔒</span> Admin
              </NavLink>
              {sesionActiva && (
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-lg-3"
                  onClick={() => {
                    logout();
                    cerrarMenu();
                  }}
                >
                  Cerrar sesión
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
