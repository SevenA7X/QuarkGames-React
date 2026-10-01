import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Inicio() {
  return (
    <section>
      {/* Banner principal oscuro con texto destacado */}
      <Card className="bg-dark text-white border-0 shadow mb-4 p-4 p-md-5 text-center">
        <Card.Body>
          <h1 className="display-5 fw-bold text-info mb-3">
            Bienvenido a Quark Games
          </h1>
          <p className="lead mb-4">
            Tu tienda especializada en videojuegos digitales para PS5, Xbox Series X y Nintendo Switch.
          </p>
          <Button href="#/productos" variant="info" size="lg" className="fw-bold px-4">
            Explorar catálogo
          </Button>
          <p className="text-secondary mt-4 mb-0 small">
            Horario de atención soporte: Lunes a Viernes de 09:00 a 18:00 hrs.
          </p>
        </Card.Body>
      </Card>

      {/* Tarjetas informativas inferiores */}
      <Row className="g-4 text-center">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <h3 className="h5 fw-bold">⚡ Entrega Inmediata</h3>
              <p className="text-muted mb-0">Código digital disponible al instante tras tu compra.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <h3 className="h5 fw-bold">🔒 Compra Segura</h3>
              <p className="text-muted mb-0">Catálogo verificado y control de stock en tiempo real.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <h3 className="h5 fw-bold">🎧 Soporte Dedicado</h3>
              <p className="text-muted mb-0">Asistencia directa a través de nuestro formulario de contacto.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}