import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import { productosIniciales } from './data/productosIniciales.js';

export default function App() {
  const [productos, setProductos] = useState(productosIniciales);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [sesionActiva, setSesionActiva] = useState(false);

  function agregar(id) {
    const producto = productos.find(p => p.id === id);
    const cantidad = carrito.find(i => i.id === id)?.cantidad ?? 0;
    if (!producto || cantidad >= producto.stock) {
      setMensaje('Stock insuficiente.');
      return;
    }
    setCarrito(actual => {
      const existe = actual.some(i => i.id === id);
      if (existe) {
        return actual.map(i => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...actual, { id, cantidad: 1 }];
    });
    setMensaje('Producto agregado.');
  }

  function quitar(id) {
    setCarrito(actual => actual.filter(i => i.id !== id));
  }

  function vaciar() {
    setCarrito([]);
  }

  function guardarProducto(prod) {
    setProductos(actual => {
      const existe = actual.some(p => p.id === prod.id);
      if (existe) {
        return actual.map(p => (p.id === prod.id ? prod : p));
      }
      return [...actual, prod];
    });
  }

  function eliminarProducto(id) {
    setProductos(actual => actual.filter(p => p.id !== id));
    quitar(id);
  }

  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <>
      <Header
        unidades={unidades}
        sesionActiva={sesionActiva}
        alCerrarSesion={() => setSesionActiva(false)}
      />
      <main>
        <p role="status">{mensaje}</p>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route
            path="/productos"
            element={<Productos productos={productos} alAgregar={agregar} />}
          />
          <Route
            path="/carrito"
            element={
              <Carrito
                productos={productos}
                carrito={carrito}
                quitar={quitar}
                vaciar={vaciar}
              />
            }
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/login"
            element={<Login alIniciarSesion={() => setSesionActiva(true)} />}
          />
          <Route
            path="/admin"
            element={
              sesionActiva ? (
                <Admin
                  productos={productos}
                  alGuardar={guardarProducto}
                  alEliminar={eliminarProducto}
                />
              ) : (
                <Login alIniciarSesion={() => setSesionActiva(true)} />
              )
            }
          />
          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}