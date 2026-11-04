import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP, estadoStock } from '../utils/formatos.js';
import ProductoModal from '../components/ProductoModal.jsx';
import ConfirmarModal from '../components/ConfirmarModal.jsx';

export default function Admin() {
  const { estado, dispatch } = useTienda();
  const { productos } = estado;

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

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

  async function guardar(producto) {
    const esEdicion = !!productoEditando;
    const url = esEdicion
      ? `http://localhost:8080/api/v1/juegos/${producto.id}`
      : 'http://localhost:8080/api/v1/juegos';
    const metodo = esEdicion ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });

      if (respuesta.ok) {
        const dataGuardada = await respuesta.json();
        dispatch({ type: 'GUARDAR_PRODUCTO', payload: dataGuardada });
        setMostrarFormulario(false);
      } else {
        console.error("Error del backend al guardar el producto");
      }
    } catch (error) {
      console.error("Error de red al intentar guardar:", error);
    }
  }

  async function confirmarEliminar() {
    try {
      const respuesta = await fetch(`http://localhost:8080/api/v1/juegos/${productoAEliminar.id}`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        dispatch({ type: 'ELIMINAR_PRODUCTO', payload: productoAEliminar.id });
        setProductoAEliminar(null);
      } else {
        console.error("Error del backend al intentar eliminar el producto");
      }
    } catch (error) {
      console.error("Error de red al intentar eliminar:", error);
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