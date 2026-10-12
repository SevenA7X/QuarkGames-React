import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// Ruta protegida: se usa como ruta padre en App.jsx, sin path propio.
// - Con sesión activa, <Outlet /> muestra la ruta hija (por ejemplo, Admin).
// - Sin sesión, <Navigate> redirige a /login. 'replace' sustituye la entrada del
//   historial para que el botón Atrás no devuelva a una página bloqueada.
export default function RutaAdmin() {
  const { sesionActiva } = useAuth();

  return sesionActiva ? <Outlet /> : <Navigate to="/login" replace />;
}