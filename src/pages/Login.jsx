import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login({ alIniciarSesion }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function enviar(e) {
    e.preventDefault();
    if (usuario.trim() === 'admin' && contrasena === '1234') {
      setError('');
      alIniciarSesion();
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos (use admin / 1234).');
    }
  }

  return (
    <section>
      <h1>Inicio de sesión administrador</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={enviar}>
        <p>
          <label htmlFor="usuario">Usuario: </label>
          <input id="usuario" value={usuario} onChange={e => setUsuario(e.target.value)} required />
        </p>
        <p>
          <label htmlFor="contrasena">Contraseña: </label>
          <input id="contrasena" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} required />
        </p>
        <button type="submit">Ingresar</button>
      </form>
    </section>
  );
}