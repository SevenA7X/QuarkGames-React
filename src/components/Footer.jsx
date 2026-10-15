import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Quark Games</h5>
            <p>Videojuegos para todos los gamers.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <h5>Contacto</h5>
            <p className="mb-0">contactoQuark@mystore.cl</p>
            <p>Viña del Mar, Chile</p>
          </Col>
        </Row>
        <hr />
        <p className="text-center mb-0">
          &copy; {new Date().getFullYear()} QuarkGames. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
