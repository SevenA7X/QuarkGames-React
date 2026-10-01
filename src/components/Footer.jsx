import Container from 'react-bootstrap/Container';

export default function Footer() {
  return (
    // Pie de página oscuro ubicado directamente debajo del contenido principal
    <footer className="bg-dark text-light py-3 mt-4 border-top border-secondary">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span className="fw-semibold text-info">🎮 Quark Games</span>
        <small className="text-secondary">
          Tienda de videojuegos digitales de consola — Todos los derechos reservados
        </small>
      </Container>
    </footer>
  );
}