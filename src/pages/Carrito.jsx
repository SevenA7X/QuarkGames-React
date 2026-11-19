import { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router'; 
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP } from '../utils/formatos.js';
import ConfirmarModal from '../components/ConfirmarModal.jsx';

export default function Carrito() {
  const { estado, agregarAlCarrito, restarDelCarrito, quitarDelCarrito, vaciarCarrito, comprar } = useTienda();
  const { productos, carrito } = estado;
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);

  // Cada ítem ya trae del MS Carrito su título, imagen, precio y subtotal.
  // Del catálogo solo tomamos el stock vigente, para desactivar el botón "+" al llegar al límite.
  const detalle = carrito.map((item) => ({
    ...item,
    stock: productos.find((p) => p.id === item.juegoId)?.stock,
  }));

  const total = detalle.reduce((suma, item) => suma + item.subtotal, 0);

  // Cada acción llama al MS Carrito; el aviso de éxito o error lo muestra TiendaContext
  function vaciar() {
    setMostrarModal(false);
    vaciarCarrito();
  }

  function confirmarCompra() {
    setMostrarModalCompra(false);
    comprar();
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Mi Carrito</h1>
      
      {detalle.length === 0 ? (
        <Card className="text-center p-5 bg-light">
          <Card.Body>
            <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
            <Button as={Link} to="/productos" variant="primary">
              Explorar productos
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          <Col xs={12} lg={8}>
            <ListGroup>
              {detalle.map((p) => (
                <ListGroup.Item key={p.juegoId} className="d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={p.imagen} 
                      alt={p.titulo} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      className="rounded" 
                    />
                    <div>
                      <h5 className="mb-1">{p.titulo}</h5>
                      <span className="text-muted d-block mb-2">{precioCLP(p.precioUnitario)} c/u</span>
                      
                      {/* Controles de cantidad integrados */}
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          aria-label={`Restar una unidad de ${p.titulo}`}
                          onClick={() => restarDelCarrito(p.juegoId)}
                        >
                          -
                        </Button>
                        <span className="fw-bold" style={{ minWidth: '20px', textAlign: 'center' }}>
                          {p.cantidad}
                        </span>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          aria-label={`Sumar una unidad de ${p.titulo}`}
                          onClick={() => agregarAlCarrito(p.juegoId)}
                          disabled={p.stock !== undefined && p.cantidad >= p.stock}
                        >
                          +
                        </Button>
                      </div>

                    </div>
                  </div>
                  
                  <div className="text-end">
                    <div className="fw-bold fs-5 mb-2">{precioCLP(p.subtotal)}</div>
                    <Button variant="outline-danger" size="sm" onClick={() => quitarDelCarrito(p.juegoId)}>
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          
          <Col xs={12} lg={4}>
            <Card className="bg-light">
              <Card.Body>
                <Card.Title>Resumen de compra</Card.Title>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total sin envío:</strong>
                  <span className="fs-5 fw-bold text-primary">{precioCLP(total)}</span>
                </div>
                
                <div className="d-grid gap-2">
                  <Button variant="success" size="lg" onClick={() => setMostrarModalCompra(true)}>
                    Proceder al pago
                  </Button>
                  <Button variant="outline-danger" onClick={() => setMostrarModal(true)}>
                    Vaciar carrito
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <ConfirmarModal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        titulo="Vaciar Carrito"
        mensaje="¿Estás seguro de que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer."
        onConfirmar={vaciar}
      />

      <ConfirmarModal
        show={mostrarModalCompra}
        onHide={() => setMostrarModalCompra(false)}
        titulo="Confirmar Compra"
        mensaje="¿Estás seguro de que deseas finalizar tu compra? Se procesarán los productos de tu carrito."
        onConfirmar={confirmarCompra}
      />
    </Container>
  );
}