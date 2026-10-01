import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function validarFormulario() {
    const nuevosErrores = {};
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }
    if (!correo.trim() || !correo.includes('@')) {
      nuevosErrores.correo = 'Ingrese un correo electrónico válido.';
    }
    if (mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe contener al menos 10 caracteres.';
    }
    return nuevosErrores;
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const erroresDetectados = validarFormulario();

    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      setEnviado(false);
      return;
    }

    setErrores({});
    setEnviado(true);
    setNombre('');
    setCorreo('');
    setMensaje('');
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="border-0 shadow-sm p-3">
          <Card.Body>
            <h1 className="h3 fw-bold mb-2">Formulario de Contacto</h1>
            <p className="text-muted mb-4">
              Envíanos tus dudas o consultas sobre tus videojuegos.
            </p>

            {enviado && (
              <Alert variant="success">
                ¡Mensaje enviado con éxito! Te responderemos pronto.
              </Alert>
            )}

            <Form onSubmit={manejarEnvio} noValidate>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label className="fw-semibold">Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={Boolean(errores.nombre)}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.nombre}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="correo">
                <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  isInvalid={Boolean(errores.correo)}
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="mensaje">
                <Form.Label className="fw-semibold">Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  isInvalid={Boolean(errores.mensaje)}
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.mensaje}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 fw-semibold">
                Enviar mensaje
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}