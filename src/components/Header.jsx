// Importa los componentes de navegación desde React Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

export default function Header({ cantidadCarrito = 0, sesionActiva, alCerrarSesion }) {
  return (
    // Barra superior oscura y expandible en pantallas medianas/grandes
    <Navbar bg="dark" data-bs-theme="dark" expand="md" className="shadow-sm py-3">
      <Container>
        {/* Logo o título principal de la tienda */}
        <Navbar.Brand href="#/" className="fw-bold text-info fs-4">
          🎮 Quark Games
        </Navbar.Brand>

        {/* Botón hamburguesa automático para pantallas móviles */}
        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          {/* Enlaces de navegación alineados a la izquierda */}
          <Nav className="me-auto">
            <Nav.Link href="#/">Inicio</Nav.Link>
            <Nav.Link href="#/productos">Catálogo</Nav.Link>
            <Nav.Link href="#/carrito">
              Carrito{' '}
              {/* Burbuja contadora de productos */}
              <Badge bg="info" text="dark" pill>
                {cantidadCarrito}
              </Badge>
            </Nav.Link>
            <Nav.Link href="#/contacto">Contacto</Nav.Link>
            <Nav.Link href="#/admin">Admin</Nav.Link>
          </Nav>

          {/* Botón para cerrar sesión visible solo cuando el administrador ingresó */}
          {sesionActiva && (
            <Button variant="outline-danger" size="sm" onClick={alCerrarSesion}>
              Cerrar sesión
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}