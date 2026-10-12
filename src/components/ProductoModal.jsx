import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { validarProducto, convertirProducto } from '../utils/validaciones.js';

// Campos del formulario. Definirlos en un arreglo evita repetir el mismo bloque cinco veces.
const CAMPOS = [
  { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text' },
  { nombre: 'categoria', etiqueta: 'Categoría', tipo: 'text', placeholder: 'Ej: PS5' },
  { nombre: 'precio', etiqueta: 'Precio (CLP)', tipo: 'number' },
  { nombre: 'stock', etiqueta: 'Stock', tipo: 'number' },
  { nombre: 'imagen', etiqueta: 'URL de la imagen', tipo: 'text', placeholder: 'https://...' },
];

// Modal para crear o editar un producto. Admin lo monta solo cuando se necesita,
// así que el formulario arranca limpio (o con los datos del producto) cada vez que se abre.
// Props:
// - producto: el producto a editar, o null para crear uno nuevo
// - productos: el catálogo actual, para detectar nombres duplicados
// - alGuardar: función que recibe el producto ya validado y convertido
// - alCerrar: función que cierra el modal sin guardar
export default function ProductoModal({ producto = null, productos, alGuardar, alCerrar }) {
  // Los campos se guardan como texto, porque eso es lo que entrega un <input>.
  // convertirProducto() los transforma a número recién al guardar.
  const [datos, setDatos] = useState({
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? '',
    precio: producto ? String(producto.precio) : '',
    stock: producto ? String(producto.stock) : '',
    imagen: producto?.imagen ?? '',
  });
  const [errores, setErrores] = useState({});

  // Un solo manejador para todos los inputs: usa el atributo 'name' para saber qué campo cambió.
  function cambiar(e) {
    const { name, value } = e.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(e) {
    e.preventDefault();
    // validarProducto devuelve un objeto con un error por campo (vacío si todo está bien).
    // Pasamos el id del producto para que, al editar, su propio nombre no cuente como duplicado.
    const erroresEncontrados = validarProducto(datos, productos, producto?.id ?? null);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    alGuardar({
      // Al editar se conserva el id; al crear se genera uno nuevo.
      id: producto?.id ?? Date.now(),
      ...convertirProducto(datos),
    });
  }

  return (
    <Modal show onHide={alCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{producto ? 'Editar producto' : 'Nuevo producto'}</Modal.Title>
      </Modal.Header>

      {/* noValidate desactiva los mensajes del navegador: mostramos los nuestros */}
      <Form noValidate onSubmit={enviar}>
        <Modal.Body>
          {CAMPOS.map((campo) => (
            <Form.Group key={campo.nombre} className="mb-3" controlId={`producto-${campo.nombre}`}>
              <Form.Label>{campo.etiqueta}</Form.Label>
              <Form.Control
                name={campo.nombre}
                type={campo.tipo}
                placeholder={campo.placeholder}
                value={datos[campo.nombre]}
                onChange={cambiar}
                isInvalid={Boolean(errores[campo.nombre])}
              />
              <Form.Control.Feedback type="invalid">
                {errores[campo.nombre]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {producto ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
