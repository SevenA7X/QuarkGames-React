import { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router'; 
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP } from '../utils/formatos.js';
import ConfirmarModal from '../components/ConfirmarModal.jsx';

export default function Carrito() {
  const { estado, dispatch } = useTienda();
  const { productos, carrito } = estado;
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);

  const detalle = carrito.map((item) => {
    const prod = productos.find((p) => p.id === item.id);
    return { ...prod, cantidad: item.cantidad };
  });

  const total = detalle.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

  // Nuevas funciones de control
  function sumar(id) {
    dispatch({ type: 'AGREGAR_AL_CARRITO', payload: id });
  }

  function restar(id) {
    dispatch({ type: 'RESTAR_DEL_CARRITO', payload: id });
  }

  function quitar(id) {
    dispatch({ type: 'QUITAR_DEL_CARRITO', payload: id });
  }

  function vaciar() {
    dispatch({ type: 'VACIAR_CARRITO' });
    setMostrarModal(false); 
  }

  function confirmarCompra() {
    dispatch({ type: 'COMPRAR' });
    setMostrarModalCompra(false); 
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
                <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={p.imagen} 
                      alt={p.nombre} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      className="rounded" 
                    />
                    <div>
                      <h5 className="mb-1">{p.nombre}</h5>
                      <span className="text-muted d-block mb-2">{precioCLP(p.precio)} c/u</span>
                      
                      {/* Controles de cantidad integrados */}
                      <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => restar(p.id)}>
                          -
                        </Button>
                        <span className="fw-bold" style={{ minWidth: '20px', textAlign: 'center' }}>
                          {p.cantidad}
                        </span>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => sumar(p.id)}
                          disabled={p.cantidad >= p.stock}
                        >
                          +
                        </Button>
                      </div>

                    </div>
                  </div>
                  
                  <div className="text-end">
                    <div className="fw-bold fs-5 mb-2">{precioCLP(p.precio * p.cantidad)}</div>
                    <Button variant="outline-danger" size="sm" onClick={() => quitar(p.id)}>
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