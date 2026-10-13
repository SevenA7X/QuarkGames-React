import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import RutaAdmin from './components/RutaAdmin.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';

// App solo define las rutas: no guarda estado propio.
// El carrito y el catálogo viven en TiendaContext y la sesión en AuthContext.
export default function App() {
  return (
    <Routes>
      {/* Layout es una ruta padre sin path: dibuja Header y Footer y deja las páginas en su <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />

        {/* RutaAdmin también es una ruta padre sin path: protege a sus rutas hijas */}
        <Route element={<RutaAdmin />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
