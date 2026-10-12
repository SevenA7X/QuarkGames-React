import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  // Ya no recibimos 'alIniciarSesion' por props: la sesión vive en AuthContext.
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados locales del formulario: solo esta pantalla necesita saber qué escribe el usuario.
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  function enviar(e) {
    e.preventDefault();
    // login() valida las credenciales, abre la sesión y devuelve true o false.
    if (login(usuario, contrasena)) {
      setError('');
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos (use admin / 1234).');
    }
  }

  return (
    <section>
      <h1>Inicio de sesión administrador</h1>
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      <form onSubmit={enviar}>
        <p>
          <label htmlFor="usuario">Usuario: </label>
          <input
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </p>
        <p>
          <label htmlFor="contrasena">Contraseña: </label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </p>
        <button type="submit">Ingresar</button>
      </form>
    </section>
  );
}
