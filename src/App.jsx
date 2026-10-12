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
// Admin todavía recibe props; cuando lo reescribas con useTienda() y crees
// Layout.jsx, esta versión se reemplaza por la final (Layout como ruta padre).
export default function App() {
  const { estado, dispatch } = useTienda();

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
            <Route
              path="/admin"
              element={
                <Admin
                  productos={estado.productos}
                  alGuardar={(producto) =>
                    dispatch({ type: 'GUARDAR_PRODUCTO', payload: producto })
                  }
                  alEliminar={(id) =>
                    dispatch({ type: 'ELIMINAR_PRODUCTO', payload: id })
                  }
                />
              }
            />
          </Route>

          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
