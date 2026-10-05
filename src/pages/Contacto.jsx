import { useState } from 'react';

export default function Contacto() {
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  function enviar(e) {
    e.preventDefault();
    if (!email.includes('@') || asunto.trim().length < 5 || mensaje.trim().length < 10) {
      setError('Completa un correo válido, asunto (mín. 5 caracteres) y mensaje (mín. 10 caracteres).');
      setEnviado(false);
      return;
    }
    setError('');
    setEnviado(true);
    setEmail('');
    setAsunto('');
    setMensaje('');
  }

  return (
    <section>
      <h1>Contacto</h1>
      {enviado && <p>Mensaje validado correctamente.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={enviar} noValidate>
        <p>
          <label htmlFor="email">Correo electrónico: </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </p>
        <p>
          <label htmlFor="asunto">Asunto: </label>
          <input id="asunto" type="text" value={asunto} onChange={e => setAsunto(e.target.value)} />
        </p>
        <p>
          <label htmlFor="mensaje">Mensaje: </label>
          <textarea id="mensaje" rows="4" value={mensaje} onChange={e => setMensaje(e.target.value)} />
        </p>
        <button type="submit">Validar mensaje</button>
      </form>
    </section>
  );
}