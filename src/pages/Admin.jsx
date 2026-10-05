import { useState } from 'react';
import { precioCLP } from '../utils/formatos.js';

export default function Admin({ productos, alGuardar, alEliminar }) {
  const [idEditando, setIdEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('PS5');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');

  function editar(p) {
    setIdEditando(p.id);
    setNombre(p.nombre);
    setCategoria(p.categoria);
    setPrecio(String(p.precio));
    setStock(String(p.stock));
    setImagen(p.imagen);
  }

  function limpiar() {
    setIdEditando(null);
    setNombre('');
    setCategoria('PS5');
    setPrecio('');
    setStock('');
    setImagen('');
  }

  function enviar(e) {
    e.preventDefault();
    if (!nombre.trim() || Number(precio) <= 0 || Number(stock) < 0) return;
    alGuardar({
      id: idEditando ?? Date.now(),
      nombre: nombre.trim(),
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      imagen: imagen.trim() || 'https://placehold.co/600x400?text=Juego'
    });
    limpiar();
  }

  return (
    <section>
      <h1>Administración de productos</h1>
      <form onSubmit={enviar} style={{ marginBottom: '2rem' }}>
        <p>
          <label htmlFor="prod-nombre">Nombre: </label>
          <input id="prod-nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </p>
        <p>
          <label htmlFor="prod-categoria">Categoría: </label>
          <input id="prod-categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required />
        </p>
        <p>
          <label htmlFor="prod-precio">Precio: </label>
          <input id="prod-precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} required />
        </p>
        <p>
          <label htmlFor="prod-stock">Stock: </label>
          <input id="prod-stock" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
        </p>
        <p>
          <label htmlFor="prod-imagen">URL Imagen: </label>
          <input id="prod-imagen" value={imagen} onChange={e => setImagen(e.target.value)} />
        </p>
        <button type="submit">{idEditando ? 'Actualizar' : 'Crear'}</button>
        {idEditando && <button type="button" onClick={limpiar}>Cancelar</button>}
      </form>

      <div className="grilla">
        {productos.map(p => (
          <article key={p.id} className="tarjeta">
            <h2>{p.nombre}</h2>
            <p>{p.categoria} · {precioCLP(p.precio)}</p>
            <p>Stock: {p.stock}</p>
            <button type="button" onClick={() => editar(p)}>Editar</button>{' '}
            <button type="button" onClick={() => alEliminar(p.id)}>Eliminar</button>
          </article>
        ))}
      </div>
    </section>
  );
}