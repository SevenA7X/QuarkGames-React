import { createContext, useContext, useEffect, useState } from 'react';
import { api, guardarToken, limpiarToken, obtenerToken } from '../services/api.js';

// 1. Crear el contexto de autenticación (la "burbuja" de datos de sesión).
const AuthContext = createContext();

// 2. Crear el Provider: valida las credenciales contra el MS de autenticación (a través del Gateway)
//    y comparte la sesión con toda la app.
export function AuthProvider({ children }) {
  // sesion = { usuario, rol } cuando hay un token válido, o null si no hay sesión
  const [sesion, setSesion] = useState(null);
  // Mientras se comprueba el token guardado, RutaAdmin no debe redirigir al login
  const [cargando, setCargando] = useState(() => obtenerToken() !== null);

  useEffect(() => {
    // Persistencia de sesión: si al recargar (F5) hay un token guardado, se pregunta al backend
    // si sigue vigente. Si venció o fue alterado, se descarta.
    let vigente = true;
    if (obtenerToken()) {
      api('/auth/validar')
        .then((datos) => vigente && setSesion(datos))
        .catch(() => {
          limpiarToken();
          if (vigente) setSesion(null);
        })
        .finally(() => vigente && setCargando(false));
    }

    // api.js avisa con este evento cuando el backend rechaza el token (401)
    const alExpirar = () => setSesion(null);
    window.addEventListener('quark:sesion-expirada', alExpirar);
    return () => {
      vigente = false;
      window.removeEventListener('quark:sesion-expirada', alExpirar);
    };
  }, []);

  // Inicia sesión en el MS de autenticación. Si las credenciales son incorrectas,
  // api() lanza un ApiError con el mensaje del backend ("Usuario o contraseña incorrectos.")
  // y Login.jsx lo muestra.
  async function login(usuario, contrasena) {
    const respuesta = await api('/auth/login', {
      method: 'POST',
      body: { usuario: usuario.trim(), clave: contrasena },
    });
    guardarToken(respuesta.token);
    setSesion({ usuario: respuesta.usuario, rol: respuesta.rol });
    return true;
  }

  function logout() {
    limpiarToken();
    setSesion(null);
  }

  const sesionActiva = sesion !== null;

  return (
    <AuthContext.Provider value={{ sesion, sesionActiva, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado para consumir el contexto con una sola línea.
// El hook vive junto a su Provider a propósito (patrón habitual de Context).
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  // Validación de seguridad: avisa si alguien usa el hook fuera del Provider.
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
