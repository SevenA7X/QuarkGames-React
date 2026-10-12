import { createContext, useContext, useEffect, useState } from 'react';
import { leerJSON, guardarJSON } from '../services/storage.js';

// 1. Crear el contexto de autenticación (la "burbuja" de datos de sesión).
const AuthContext = createContext();

// Credenciales del proyecto académico. En una aplicación real las validaría un servidor.
const USUARIO_ADMIN = 'admin';
const CLAVE_ADMIN = '1234';
const CLAVE_STORAGE = 'quark_sesion';

// 2. Crear el Provider: el componente que guarda la sesión y la comparte con toda la app.
export function AuthProvider({ children }) {
  // Pasamos una función a useState para que localStorage se lea solo una vez, al montar.
  // Así, si el administrador recarga la página con F5, la sesión sigue activa.
  const [sesionActiva, setSesionActiva] = useState(
    () => leerJSON(CLAVE_STORAGE, false) === true,
  );

  // Cada vez que la sesión cambia, la sincronizamos con localStorage.
  useEffect(() => {
    guardarJSON(CLAVE_STORAGE, sesionActiva);
  }, [sesionActiva]);

  // Valida las credenciales y abre la sesión. Devuelve true o false para que
  // quien la llame (Login.jsx) decida si navega o muestra un error.
  function login(usuario, contrasena) {
    const credencialesValidas =
      usuario.trim() === USUARIO_ADMIN && contrasena === CLAVE_ADMIN;
    if (credencialesValidas) {
      setSesionActiva(true);
    }
    return credencialesValidas;
  }

  function logout() {
    setSesionActiva(false);
  }

  return (
    <AuthContext.Provider value={{ sesionActiva, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado para consumir el contexto con una sola línea.
export function useAuth() {
  const context = useContext(AuthContext);
  // Validación de seguridad: avisa si alguien usa el hook fuera del Provider.
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
