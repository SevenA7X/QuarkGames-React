import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import { productosIniciales } from './data/productosIniciales.js';
import { leerJSON } from './utils/formatos.js';

export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || '#/');

  const [productos, setProductos] = useState(() =>
    leerJSON('gametech-react-productos', productosIniciales)
  );

  const [carrito, setCarrito] = useState(() =>
    leerJSON('gametech-react-carrito', [])
  );

  const [sesionActiva, setSesionActiva] = useState(() =>
    leerJSON('gametech-react-sesion', false)
  );

  useEffect(() => {
    function actualizarRuta() {
      setRuta(window.location.hash || '#/');
    }
    window.addEventListener('hashchange', actualizarRuta);
    return () => window.removeEventListener('hashchange', actualizarRuta);
  }, []);

  useEffect(() => {
    localStorage.setItem('gametech-react-productos', JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem('gametech-react-carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem('gametech-react-sesion', JSON.stringify(sesionActiva));
  }, [sesionActiva]);

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto || producto.stock <= 0) return;

    setCarrito(actual => {
      const itemExistente = actual.find(item => item.id === id);
      if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) return actual;
        return actual.map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...actual, { id, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id, nuevaCantidad) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    if (nuevaCantidad > producto.stock) return;

    setCarrito(actual =>
      actual.map(item => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito(actual => actual.filter(item => item.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  // Descuenta del catálogo las unidades compradas y limpia el carrito
  function finalizarCompra() {
    setProductos(actual =>
      actual.map(producto => {
        const itemComprado = carrito.find(item => item.id === producto.id);
        if (!itemComprado) return producto;
        return {
          ...producto,
          stock: Math.max(0, producto.stock - itemComprado.cantidad)
        };
      })
    );
    setCarrito([]);
  }

  // Restablece los productos iniciales (con las nuevas portadas) y limpia el carrito
  function restaurarCatalogo() {
    setProductos(productosIniciales);
    setCarrito([]);
  }

  function guardarProducto(productoGuardado) {
    setProductos(actual => {
      const existe = actual.some(p => p.id === productoGuardado.id);
      if (existe) {
        return actual.map(p => (p.id === productoGuardado.id ? productoGuardado : p));
      }
      return [...actual, productoGuardado];
    });
  }

  function eliminarProducto(id) {
    setProductos(actual => actual.filter(p => p.id !== id));
    eliminarDelCarrito(id);
  }

  function cerrarSesion() {
    setSesionActiva(false);
    window.location.hash = '#/';
  }

  const totalUnidades = carrito.reduce((total, item) => total + item.cantidad, 0);

  let vistaActual = <Inicio />;
  if (ruta === '#/productos') {
    vistaActual = <Productos productos={productos} alAgregar={agregarAlCarrito} />;
  } else if (ruta === '#/carrito') {
    vistaActual = (
      <Carrito
        carrito={carrito}
        productos={productos}
        alCambiarCantidad={cambiarCantidad}
        alEliminar={eliminarDelCarrito}
        alVaciar={vaciarCarrito}
        alFinalizarCompra={finalizarCompra}
      />
    );
  } else if (ruta === '#/contacto') {
    vistaActual = <Contacto />;
  } else if (ruta === '#/admin') {
    if (sesionActiva) {
      vistaActual = (
        <Admin
          productos={productos}
          alGuardar={guardarProducto}
          alEliminar={eliminarProducto}
          alRestaurar={restaurarCatalogo}
        />
      );
    } else {
      vistaActual = <Login alIniciarSesion={() => setSesionActiva(true)} />;
    }
  }

  return (
    <>
      <Header
        cantidadCarrito={totalUnidades}
        sesionActiva={sesionActiva}
        alCerrarSesion={cerrarSesion}
      />
      <main>{vistaActual}</main>
      <Footer />
    </>
  );
}