import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { validarProducto, convertirProducto } from '../utils/validaciones.js';

// 1. Definimos las opciones para los menús desplegables
const OPCIONES_CATEGORIA = [
  { valor: '', texto: 'Selecciona una categoría...' },
  { valor: 1, texto: '1 - Acción' },
  { valor: 2, texto: '2 - Aventura / Supervivencia' },
  { valor: 3, texto: '3 - Shooter' },
  { valor: 4, texto: '4 - Lucha / Peleas' },
  { valor: 5, texto: '5 - RPG' },
  { valor: 6, texto: '6 - Deportes / Carreras' },
  { valor: 7, texto: '7 - Estrategia / Otros' }
];

const OPCIONES_PLATAFORMA = [
  { valor: '', texto: 'Selecciona una plataforma...' },
  { valor: 'PC', texto: 'PC' },
  { valor: 'PlayStation 5', texto: 'PlayStation 5' },
  { valor: 'PlayStation 4', texto: 'PlayStation 4' },
  { valor: 'Xbox Series X/S', texto: 'Xbox Series X/S' },
  { valor: 'Xbox One', texto: 'Xbox One' },
  { valor: 'Nintendo Switch', texto: 'Nintendo Switch' },
  { valor: 'Multiplataforma', texto: 'Multiplataforma' }
];

// 2. Cambiamos el tipo de "categoriaId" y "plataforma" a 'select' y les pasamos sus opciones
const CAMPOS = [
  { nombre: 'titulo', etiqueta: 'Título', tipo: 'text' },
  { nombre: 'categoriaId', etiqueta: 'Categoría', tipo: 'select', opciones: OPCIONES_CATEGORIA },
  { nombre: 'plataforma', etiqueta: 'Plataforma', tipo: 'select', opciones: OPCIONES_PLATAFORMA },
  { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text', placeholder: 'Ej: Juego de aventura en el mundo mágico.' },
  { nombre: 'precio', etiqueta: 'Precio (CLP)', tipo: 'number' },
  { nombre: 'stock', etiqueta: 'Stock', tipo: 'number' },
  { nombre: 'imagen', etiqueta: 'URL de la imagen', tipo: 'text', placeholder: 'https://...' },
];

export default function ProductoModal({ producto = null, productos, alGuardar, alCerrar }) {
  const [datos, setDatos] = useState({
    titulo: producto?.titulo ?? '',
    categoriaId: producto?.categoriaId ?? producto?.categoria?.id ?? '', 
    plataforma: producto?.plataforma ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto ? String(producto.precio) : '',
    stock: producto ? String(producto.stock) : '',
    imagen: producto?.imagen ?? '',
  });
  
  const [errores, setErrores] = useState({});

  function cambiar(e) {
    const { name, value } = e.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(e) {
    e.preventDefault();
    
    const erroresEncontrados = validarProducto(datos, productos, producto?.id ?? null);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    alGuardar({
      id: producto?.id ?? Date.now(), 
      ...convertirProducto(datos),
    });
  }

  return (
    <Modal show onHide={alCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{producto ? 'Editar producto' : 'Nuevo producto'}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={enviar}>
        <Modal.Body>
          {CAMPOS.map((campo) => (
            <Form.Group key={campo.nombre} className="mb-3" controlId={`producto-${campo.nombre}`}>
              <Form.Label>{campo.etiqueta}</Form.Label>
              
              {/* 3. Renderizado condicional: si es select usa Form.Select, si no Form.Control */}
              {campo.tipo === 'select' ? (
                <Form.Select
                  name={campo.nombre}
                  value={datos[campo.nombre]}
                  onChange={cambiar}
                  isInvalid={Boolean(errores[campo.nombre])}
                >
                  {campo.opciones.map((opt) => (
                    <option key={opt.valor} value={opt.valor}>
                      {opt.texto}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  name={campo.nombre}
                  type={campo.tipo}
                  placeholder={campo.placeholder}
                  value={datos[campo.nombre]}
                  onChange={cambiar}
                  isInvalid={Boolean(errores[campo.nombre])}
                />
              )}
              
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