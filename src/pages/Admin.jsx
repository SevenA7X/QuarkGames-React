import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';

const STOCK_CRITICO = 5;

export default function Admin({ productos, alGuardar, alEliminar, alRestaurar }) {
  const [idEditando, setIdEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('PS5');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');

  function cargarParaEditar(producto) {
    setIdEditando(producto.id);
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setPrecio(String(producto.precio));
    setStock(String(producto.stock));
    setImagen(producto.imagen);
    setError('');
  }

  function limpiarFormulario() {
    setIdEditando(null);
    setNombre('');
    setCategoria('PS5');
    setPrecio('');
    setStock('');
    setImagen('');
    setError('');
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nombreLimpio = nombre.trim();
    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (!nombreLimpio) {
      setError('El nombre del videojuego es obligatorio.');
      return;
    }
    if (precio === '' || precioNumero <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }
    if (stock === '' || stockNumero < 0) {
      setError('El stock no puede ser negativo.');
      return;
    }

    const existeDuplicado = productos.some(
      p => p.nombre.toLowerCase() === nombreLimpio.toLowerCase() && p.id !== idEditando
    );
    if (existeDuplicado) {
      setError('Ya existe un videojuego registrado con ese nombre.');
      return;
    }

    const nuevoId = idEditando ?? Date.now();
    const urlImagen =
      imagen.trim() || `https://placehold.co/600x400?text=${encodeURIComponent(nombreLimpio)}`;

    alGuardar({
      id: nuevoId,
      nombre: nombreLimpio,
      categoria,
      precio: precioNumero,
      stock: stockNumero,
      imagen: urlImagen
    });

    limpiarFormulario();
  }

  const juegosCriticos = productos.filter(p => p.stock <= STOCK_CRITICO);

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h1 className="h2 fw-bold mb-2 mb-md-0">Panel de Administración (CRUD)</h1>
        {/* Botón para recargar los datos semilla con las carátulas nuevas */}
        <Button variant="outline-secondary" size="sm" onClick={alRestaurar}>
          Restaurar catálogo inicial
        </Button>
      </div>

      {juegosCriticos.length > 0 && (
        <Alert variant="warning" className="shadow-sm">
          <strong>⚠ Alerta de Stock Crítico:</strong> Hay {juegosCriticos.length} producto(s) con{' '}
          {STOCK_CRITICO} unidades o menos en inventario.
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h2 className="h5 fw-bold mb-3">
                {idEditando ? 'Editar videojuego' : 'Nuevo videojuego'}
              </h2>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <Form onSubmit={manejarEnvio} noValidate>
                <Form.Group className="mb-3" controlId="admin-nombre">
                  <Form.Label className="fw-semibold">Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin-categoria">
                  <Form.Label className="fw-semibold">Consola</Form.Label>
                  <Form.Select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                  >
                    <option value="PS5">PS5</option>
                    <option value="Xbox Series X">Xbox Series X</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin-precio">
                  <Form.Label className="fw-semibold">Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin-stock">
                  <Form.Label className="fw-semibold">Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin-imagen">
                  <Form.Label className="fw-semibold">URL Imagen (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={imagen}
                    onChange={e => setImagen(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary" className="fw-semibold">
                    {idEditando ? 'Guardar cambios' : 'Crear videojuego'}
                  </Button>
                  {idEditando && (
                    <Button type="button" variant="outline-secondary" onClick={limpiarFormulario}>
                      Cancelar edición
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h2 className="h5 fw-bold mb-3">Inventario Actual</h2>
              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Consola</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.id}>
                      <td className="fw-semibold">{producto.nombre}</td>
                      <td>
                        <Badge bg="secondary">{producto.categoria}</Badge>
                      </td>
                      <td>${producto.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <Badge
                          bg={producto.stock <= STOCK_CRITICO ? 'warning' : 'success'}
                          text={producto.stock <= STOCK_CRITICO ? 'dark' : 'light'}
                        >
                          {producto.stock} {producto.stock <= STOCK_CRITICO ? 'Crítico' : 'OK'}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => cargarParaEditar(producto)}
                          className="me-2"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => alEliminar(producto.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}