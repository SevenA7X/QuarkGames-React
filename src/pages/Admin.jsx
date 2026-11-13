import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { api } from '../services/api.js';
import { precioCLP, estadoStock } from '../utils/formatos.js';
import ProductoModal from '../components/ProductoModal.jsx';
import ConfirmarModal from '../components/ConfirmarModal.jsx';

export default function Admin() {
  const { estado, dispatch } = useTienda();
  const { productos } = estado;

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [error, setError] = useState('');

  const totalProductos = productos.length;
  const unidadesEnStock = productos.reduce((suma, p) => suma + p.stock, 0);
  const valorInventario = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  const sinStock = productos.filter((p) => p.stock <= 0).length;

  function abrirNuevo() {
    setError('');
    setProductoEditando(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(producto) {
    setError('');
    setProductoEditando(producto);
    setMostrarFormulario(true);
  }

  // Crear y editar usan api(), que agrega el token JWT del administrador (Authorization: Bearer).
  // Sin token válido el catálogo responde 401 y api() cierra la sesión.
  async function guardar(producto) {
    const esEdicion = !!productoEditando;
    // El id lo genera la base de datos: al crear no se envía (ProductoModal pone uno temporal)
    // eslint-disable-next-line no-unused-vars
    const { id, ...datos } = producto;

    try {
      const guardado = await api(esEdicion ? `/juegos/${productoEditando.id}` : '/juegos', {
        method: esEdicion ? 'PUT' : 'POST',
        body: datos,
      });
      dispatch({ type: 'GUARDAR_PRODUCTO', payload: guardado });
      dispatch({
        type: 'MOSTRAR_MENSAJE',
        payload: { mensaje: esEdicion ? 'Producto actualizado.' : 'Producto creado.' },
      });
      setMostrarFormulario(false);
      setError('');
    } catch (err) {
      const campos = Object.values(err.errores ?? {});
      setError(campos.length ? `${err.message} ${campos.join(' · ')}` : err.message);
    }
  }

  async function confirmarEliminar() {
    try {
      await api(`/juegos/${productoAEliminar.id}`, { method: 'DELETE' });
      dispatch({ type: 'ELIMINAR_PRODUCTO', payload: productoAEliminar.id });
      dispatch({ type: 'MOSTRAR_MENSAJE', payload: { mensaje: 'Producto eliminado.' } });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setProductoAEliminar(null);
    }
  }

  const metricas = [
    { titulo: 'Productos', valor: totalProductos },
    { titulo: 'Unidades en stock', valor: unidadesEnStock },
    { titulo: 'Valor del inventario', valor: precioCLP(valorInventario) },
    { titulo: 'Sin stock', valor: sinStock },
  ];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Administración de productos</h1>
        <Button variant="primary" onClick={abrirNuevo}>
          Nuevo producto
        </Button>
      </div>

      {error && !mostrarFormulario && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row xs={1} sm={2} lg={4} className="g-3 mb-4">
        {metricas.map((m) => (
          <Col key={m.titulo}>
            <Card className="h-100 text-center">
              <Card.Body>
                <Card.Text className="text-muted mb-1">{m.titulo}</Card.Text>
                <Card.Title as="p" className="fs-3 mb-0">
                  {m.valor}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {productos.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay productos. Crea el primero con el botón "Nuevo producto".
        </div>
      ) : (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Plataforma</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const info = estadoStock(p.stock);

              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="fw-bold">{p.titulo}</td>
                  <td>{p.categoria?.nombre ?? p.categoriaId ?? 'N/A'}</td>
                  <td>{p.plataforma}</td>
                  <td>{precioCLP(p.precio)}</td>
                  <td>
                    {p.stock} <Badge bg={info.variante}>{info.texto}</Badge>
                  </td>
                  <td className="text-nowrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => abrirEditar(p)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setProductoAEliminar(p)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {mostrarFormulario && (
        <ProductoModal
          producto={productoEditando}
          productos={productos}
          alGuardar={guardar}
          alCerrar={() => setMostrarFormulario(false)}
          errorServidor={error}
        />
      )}

      <ConfirmarModal
        show={productoAEliminar !== null}
        onHide={() => setProductoAEliminar(null)}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${productoAEliminar?.titulo}" de la base de datos?`}
        onConfirmar={confirmarEliminar}
      />
    </Container>
  );
}