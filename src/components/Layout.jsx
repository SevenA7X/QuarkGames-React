import { Outlet } from 'react-router';
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
    <>
      <Header />
      <main>
        {/* role="status" hace que los lectores de pantalla anuncien el mensaje cuando cambia */}
        <p role="status">{estado.mensaje}</p>
        {/* <Outlet /> es el lugar donde React Router dibuja la página hija que corresponde a la URL */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
