
import { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router'; // Recordar que react-router 7 no usa react-router-dom
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP } from '../utils/formatos.js';
import ConfirmarModal from '../components/ConfirmarModal.jsx';

export default function Carrito() {
  // 1. Extraemos el estado global y el despachador
  const { estado, dispatch } = useTienda();
  const { productos, carrito } = estado;
  
  // 2. Estado local para controlar si el modal de confirmación se muestra o no
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado para el modal de compra
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);

  // 3. Procesamos los datos: cruzamos el carrito con el catálogo para obtener los precios
  const detalle = carrito.map((item) => {
    const prod = productos.find((p) => p.id === item.id);
    return { ...prod, cantidad: item.cantidad };
  });

  // 4. Calculamos el total matemático (acumulador)
  const total = detalle.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

  // Funciones que se comunican con nuestro Reducer
  function quitar(id) {
    dispatch({ type: 'QUITAR_DEL_CARRITO', payload: id });
  }

  function vaciar() {
    dispatch({ type: 'VACIAR_CARRITO' });
    setMostrarModal(false); // Cierra el modal tras vaciar
  }

  function comprar() {
    alert("¡Compra realizada con éxito!");
    dispatch({ type: 'VACIAR_CARRITO' });
  }

  // Función que se ejecuta al confirmar la compra en el modal
  function confirmarCompra() {
    dispatch({ type: 'VACIAR_CARRITO' });
    setMostrarModalCompra(false); // Cierra el modal de compra
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
          {/* Columna Izquierda: Lista de productos en el carrito */}
          <Col xs={12} lg={8}>
            <ListGroup>
              {detalle.map((p) => (
                <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={p.imagen} 
                      alt={p.nombre} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      className="rounded" 
                    />
                    <div>
                      <h5 className="mb-0">{p.nombre}</h5>
                      <span className="text-muted">{precioCLP(p.precio)} x {p.cantidad}</span>
                    </div>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => quitar(p.id)}>
                    Eliminar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          
          {/* Columna Derecha: Panel de resumen (Total y botones de acción) */}
          <Col xs={12} lg={4}>
            <Card className="bg-light">
              <Card.Body>
                <Card.Title>Resumen de compra</Card.Title>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total sin envío:</strong>
                  <span className="fs-5">{precioCLP(total)}</span>
                </div>
                
                <div className="d-grid gap-2">
                  {/* Este botón ahora abre el modal de compra */}
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

      {/* Componente Modal que creamos antes. Se muestra solo si mostrarModal es true */}
      <ConfirmarModal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        titulo="Vaciar Carrito"
        mensaje="¿Estás seguro de que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer."
        onConfirmar={vaciar}
      />

      {/*Modal para CONFIRMAR LA COMPRA */}
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