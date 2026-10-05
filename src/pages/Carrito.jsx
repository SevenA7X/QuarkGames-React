import { Link } from 'react-router';
import { precioCLP } from '../utils/formatos.js';

export default function Carrito({ productos, carrito, quitar, vaciar }) {
  const detalle = carrito.map(item => ({
    ...productos.find(p => p.id === item.id),
    cantidad: item.cantidad
  }));
  const total = detalle.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

  return (
    <section>
      <h1>Mi carrito</h1>
      {!detalle.length && <p>Tu carrito está vacío.</p>}
      {detalle.map(p => (
        <p key={p.id}>
          {p.nombre}: {p.cantidad} unidades{' '}
          <button type="button" onClick={() => quitar(p.id)}>
            Eliminar {p.nombre}
          </button>
        </p>
      ))}
      <p>Total sin envío: {precioCLP(total)}</p>
      {detalle.length > 0 && (
        <p>
          <button type="button" onClick={vaciar}>
            Vaciar carrito
          </button>
        </p>
      )}
      <Link to="/productos">Continuar comprando</Link>
    </section>
  );
}