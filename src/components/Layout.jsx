import { Outlet } from 'react-router';
import { Container } from 'react-bootstrap';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useTienda } from '../context/TiendaContext.jsx';

// Estructura común de todas las páginas: cabecera, contenido y pie.
// Se usa como ruta padre en App.jsx, así Header y Footer existen una sola vez
// y no se repiten en cada página.
export default function Layout() {
  // El mensaje de feedback (por ejemplo "Producto agregado.") vive en el contexto global.
  const { estado } = useTienda();

  return (
    // d-flex flex-column min-vh-100: la página ocupa al menos toda la pantalla y el
    // contenido (main) crece para empujar el footer siempre hacia abajo.
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main>
        {/* role="status" hace que los lectores de pantalla anuncien el mensaje cuando cambia */}
        <Container>
          <p role="status" className="mb-0">
            {estado.mensaje}
          </p>
        </Container>
        {/* <Outlet /> es el lugar donde React Router dibuja la página hija que corresponde a la URL.
            Cada página define su propio ancho: unas usan Container y la portada ocupa todo el ancho. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
