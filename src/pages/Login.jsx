import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Login({ alIniciarSesion }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function manejarLogin(evento) {
    evento.preventDefault();

    if (correo.trim() === 'ejemplo@correo.cl' && password === '123456') {
      setError('');
      alIniciarSesion();
      window.location.hash = '#/admin';
    } else {
      setError('Credenciales incorrectas. Use ejemplo@correo.cl y 123456.');
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="border-0 shadow-sm p-3">
          <Card.Body>
            <h1 className="h3 fw-bold mb-2 text-center">Acceso Administrativo</h1>
            <p className="text-muted text-center small mb-4">
              Demo: <strong>ejemplo@correo.cl</strong> / <strong>123456</strong>
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={manejarLogin} noValidate>
              <Form.Group className="mb-3" controlId="login-correo">
                <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="login-password">
                <Form.Label className="fw-semibold">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100 fw-semibold">
                Ingresar al panel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}