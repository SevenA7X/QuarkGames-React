import { Outlet } from 'react-router';
import { Alert } from 'react-bootstrap';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useTienda } from '../context/TiendaContext.jsx';

// Estructura común de todas las páginas: cabecera, contenido y pie.
// Se usa como ruta padre en App.jsx, así Header y Footer existen una sola vez
// y no se repiten en cada página.
export default function Layout() {
  // El aviso de feedback (por ejemplo "Producto agregado.") vive en el contexto global.
  const { estado, dispatch } = useTienda();

  // El reducer indica si el aviso es de éxito o de advertencia. Si no lo indica, se asume éxito.
  const variante = estado.tipoMensaje ?? 'success';
  const icono = variante === 'success' ? '✅' : '⚠️';

  return (
    // d-flex flex-column min-vh-100: la página ocupa al menos toda la pantalla y el
    // contenido (main) crece para empujar el footer siempre hacia abajo.
    <div className="d-flex flex-column min-vh-100">
      {/* Alerta flotante: aparece sobre la página sin empujar el contenido y se cierra sola
          a los 3 segundos (lo gestiona TiendaContext) o con el botón de la derecha. */}
      {estado.mensaje && (
        <div className="alerta-flotante">
          <Alert
            variant={variante}
            dismissible
            closeLabel="Cerrar"
            onClose={() => dispatch({ type: 'LIMPIAR_MENSAJE' })}
            className="shadow mb-0"
          >
            <span aria-hidden="true">{icono}</span> {estado.mensaje}
          </Alert>
        </div>
      )}

      <Header />
      <main>
        {/* <Outlet /> es el lugar donde React Router dibuja la página hija que corresponde a la URL.
            Cada página define su propio ancho: unas usan Container y la portada ocupa todo el ancho. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
