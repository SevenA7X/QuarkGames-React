import { Navigate, Outlet } from 'react-router';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';

// Ruta protegida: se usa como ruta padre en App.jsx, sin path propio.
// - Mientras se valida el token guardado (por ejemplo, tras un F5), muestra un indicador de carga.
//   Sin esto, redirigiría al login antes de saber si la sesión sigue vigente.
// - Con sesión activa, <Outlet /> muestra la ruta hija (por ejemplo, Admin).
// - Sin sesión, <Navigate> redirige a /login. 'replace' sustituye la entrada del
//   historial para que el botón Atrás no devuelva a una página bloqueada.
export default function RutaAdmin() {
  const { sesionActiva, cargando } = useAuth();

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </Spinner>
      </Container>
    );
  }

  return sesionActiva ? <Outlet /> : <Navigate to="/login" replace />;
}
