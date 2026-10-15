import { Link } from 'react-router';
import { Container } from 'react-bootstrap';

// Se muestra cuando la URL no coincide con ninguna ruta (path="*" en App.jsx).
export default function NoEncontrada() {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Página no encontrada</h1>
      <p>La dirección que buscas no existe o fue movida.</p>
      <Link to="/">Volver al inicio</Link>
    </Container>
  );
}
