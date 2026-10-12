import { Route, Routes } from 'react-router';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import RutaAdmin from './components/RutaAdmin.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import { useTienda } from './context/TiendaContext.jsx';

// VERSIÓN TRANSITORIA: App ya no guarda estado propio. El carrito y el catálogo
// vienen de TiendaContext y la sesión de AuthContext (a través de RutaAdmin).
// Cuando crees Layout.jsx (Fase 3), esta versión se reemplaza por la final,
// con Layout como ruta padre.
export default function App() {
  const { estado } = useTienda();

  return (
    <>
      <Header />
      <main>
        <p role="status">{estado.mensaje}</p>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />

          {/* RutaAdmin no tiene path: protege a todas sus rutas hijas */}
          <Route element={<RutaAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
