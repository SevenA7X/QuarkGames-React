import { Link } from 'react-router';

// Se muestra cuando la URL no coincide con ninguna ruta (path="*" en App.jsx).
export default function NoEncontrada() {
  return (
    <section>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe o fue movida.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
