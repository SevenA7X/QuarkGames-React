import { Link } from 'react-router';

export default function Inicio() {
  return (
    <section>
      <h1>Bienvenido a Quark Games</h1>
      <p>Tu tienda de videojuegos digitales.</p>
      <p>Horario de atención: Lunes a Viernes de 09:00 a 18:00 hrs.</p>
      <Link to="/productos">Explorar productos</Link>
    </section>
  );
}