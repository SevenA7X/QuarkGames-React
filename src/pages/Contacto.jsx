import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { validarContacto } from '../utils/validaciones.js';

const DATOS_VACIOS = { email: '', asunto: '', mensaje: '' };

export default function Contacto() {
  // Estado local: solo esta pantalla necesita saber qué escribe el usuario.
  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Un solo manejador para los tres campos: usa el atributo 'name' del input.
  function cambiar(e) {
    const { name, value } = e.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
    setEnviado(false); // al volver a escribir, se oculta el aviso de éxito anterior
  }

  function enviar(e) {
    e.preventDefault();
    // validarContacto devuelve un objeto con un error por campo (vacío si todo está bien).
    const erroresEncontrados = validarContacto(datos);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      setEnviado(false);
      return;
    }

    // Es una simulación: no se envía a ningún servidor, solo se valida y se limpia el formulario.
    setEnviado(true);
    setDatos(DATOS_VACIOS);
  }

  return (
    <Container className="py-4" style={{ maxWidth: '640px' }}>
      <h1 className="mb-4">Contacto</h1>

      {enviado && (
        <Alert variant="success" role="status">
          Mensaje validado correctamente.
        </Alert>
      )}

      {/* noValidate desactiva los avisos del navegador: mostramos los errores propios */}
      <Form noValidate onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="contacto-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={datos.email}
            onChange={cambiar}
            isInvalid={Boolean(errores.email)}
          />
          <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contacto-asunto">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            name="asunto"
            type="text"
            value={datos.asunto}
            onChange={cambiar}
            isInvalid={Boolean(errores.asunto)}
          />
          <Form.Control.Feedback type="invalid">{errores.asunto}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contacto-mensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            name="mensaje"
            as="textarea"
            rows={4}
            value={datos.mensaje}
            onChange={cambiar}
            isInvalid={Boolean(errores.mensaje)}
          />
          <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">
          Validar mensaje
        </Button>
      </Form>
    </Container>
  );
}
