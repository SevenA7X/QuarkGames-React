import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import { validarLogin } from '../utils/validaciones.js';

export default function Login() {
  // La sesión vive en AuthContext: esta pantalla solo pide los datos y pregunta si son válidos.
  const { sesionActiva, login } = useAuth();
  const navigate = useNavigate();

  // Estados locales del formulario: solo esta pantalla necesita saber qué escribe el usuario.
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({}); // errores por campo (campos vacíos)
  const [error, setError] = useState(''); // error general (credenciales incorrectas)

  // Si ya hay una sesión abierta no tiene sentido mostrar el login: vamos directo al panel.
  if (sesionActiva) {
    return <Navigate to="/admin" replace />;
  }

  function enviar(e) {
    e.preventDefault();

    // 1. Validar que los campos no estén vacíos. validarLogin devuelve un objeto con un error por campo.
    const erroresEncontrados = validarLogin({ usuario, contrasena });
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      setError('');
      return;
    }

    // 2. Comprobar las credenciales. login() abre la sesión y devuelve true o false.
    if (login(usuario, contrasena)) {
      setError('');
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  }

  return (
    // Misma estructura que Contacto: Container con py-4, título h1 con mb-4 y formulario de Bootstrap.
    <Container className="py-4" style={{ maxWidth: '640px' }}>
      <h1 className="mb-4">Inicio de sesión administrador</h1>

      {/* Alert de React Bootstrap ya trae role="alert" para que los lectores de pantalla lo anuncien */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* noValidate desactiva los avisos del navegador ("Please fill out this field."):
          mostramos los errores propios, uno por campo y en español */}
      <Form noValidate onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="login-usuario">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            isInvalid={Boolean(errores.usuario)}
          />
          <Form.Control.Feedback type="invalid">{errores.usuario}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="login-contrasena">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            autoComplete="current-password"
            isInvalid={Boolean(errores.contrasena)}
          />
          <Form.Control.Feedback type="invalid">{errores.contrasena}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">
          Ingresar
        </Button>
      </Form>

      <p className="text-muted small mt-3 mb-0">Usuario: admin | Contraseña: 1234</p>
    </Container>
  );
}
