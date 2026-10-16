import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP, estadoStock } from '../utils/formatos.js';
import ProductoModal from '../components/ProductoModal.jsx';
import ConfirmarModal from '../components/ConfirmarModal.jsx';

export default function Admin() {
  // Ya no recibimos props: leemos el catálogo y enviamos acciones al reducer.
  const { estado, dispatch } = useTienda();
  const { productos } = estado;

  // Estados locales de la interfaz (qué modal está abierto):
  // - mostrarFormulario: si el modal de crear/editar está visible
  // - productoEditando: el producto que se edita, o null cuando se crea uno nuevo
  // - productoAEliminar: el producto pendiente de confirmación, o null si no hay ninguno
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estado derivado: las métricas se calculan en cada render, no se guardan en ningún lado.
  const totalProductos = productos.length;
  const unidadesEnStock = productos.reduce((suma, p) => suma + p.stock, 0);
  const valorInventario = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  const sinStock = productos.filter((p) => p.stock <= 0).length;

  function abrirNuevo() {
    setProductoEditando(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(producto) {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  }

  function guardar(producto) {
    // El reducer decide si es crear o editar según si el id ya existe.
    dispatch({ type: 'GUARDAR_PRODUCTO', payload: producto });
    setMostrarFormulario(false);
  }

  function confirmarEliminar() {
    // El reducer también quita el producto del carrito para mantener la consistencia.
    dispatch({ type: 'ELIMINAR_PRODUCTO', payload: productoAEliminar.id });
    setProductoAEliminar(null);
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

      {/* Tarjetas de resumen */}
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

      {/* Tabla del CRUD. 'responsive' agrega scroll horizontal en pantallas pequeñas */}
      {productos.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay productos. Crea el primero con el botón "Nuevo producto".
        </div>
      ) : (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Plataforma</th> {/* <-- NUEVA COLUMNA */}
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
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{p.plataforma}</td> {/* <-- NUEVA CELDA */}
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

      {/* El modal solo existe mientras está abierto: así el formulario siempre parte limpio */}
      {mostrarFormulario && (
        <ProductoModal
          producto={productoEditando}
          productos={productos}
          alGuardar={guardar}
          alCerrar={() => setMostrarFormulario(false)}
        />
      )}

      <ConfirmarModal
        show={productoAEliminar !== null}
        onHide={() => setProductoAEliminar(null)}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${productoAEliminar?.nombre}"? También se quitará del carrito.`}
        onConfirmar={confirmarEliminar}
      />
    </Container>
  );
}