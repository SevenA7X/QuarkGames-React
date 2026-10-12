import { createContext, useContext, useReducer, useEffect } from 'react';
import { tiendaReducer } from '../store/tiendaReducer.js';
import { leerJSON, guardarJSON } from '../services/storage.js';
import { productosIniciales } from '../data/productosIniciales.js';

// 1. Crear el contexto (la "burbuja" de datos vacía)
const TiendaContext = createContext();

// 2. Definir con qué datos arranca la aplicación.
// En lugar de arrancar vacío, intenta leer localStorage usando el servicio que creamos.
const ESTADO_INICIAL = {
  productos: leerJSON('quark_productos', productosIniciales),
  carrito: leerJSON('quark_carrito', []),
  mensaje: '', // El mensaje de feedback arranca vacío
};

// 3. Crear el Provider (el componente que envolverá a la aplicación)
export function TiendaProvider({ children }) {
  // Conectamos el Reducer con el Estado Inicial
  // 'estado' tiene los datos actuales. 'dispatch' es la función para enviar acciones.
  const [estado, dispatch] = useReducer(tiendaReducer, ESTADO_INICIAL);

  // useEffect se dispara automáticamente cada vez que cambian productos o carrito.
  // Su trabajo es tomar el nuevo estado y persistirlo en el navegador (localStorage).
  useEffect(() => {
    guardarJSON('quark_productos', estado.productos);
    guardarJSON('quark_carrito', estado.carrito);
  }, [estado.productos, estado.carrito]);

  // Este useEffect maneja el mensaje temporal. Si hay un mensaje, espera 3 segundos
  // y luego despacha una acción para limpiarlo automáticamente.
  useEffect(() => {
    if (estado.mensaje) {
      const timer = setTimeout(() => {
        dispatch({ type: 'LIMPIAR_MENSAJE' });
      }, 3000);
      // Función de limpieza (cleanup): Si el mensaje cambia rápido antes de los 3s,
      // cancela el temporizador anterior para evitar que se borre a destiempo.
      return () => clearTimeout(timer);
    }
  }, [estado.mensaje]);

  // Proveemos el estado y el despachador a todos los componentes hijos
  return (
    <TiendaContext.Provider value={{ estado, dispatch }}>
      {children}
    </TiendaContext.Provider>
  );
}

// 4. Hook personalizado para facilitar el uso del contexto
export function useTienda() {
  const context = useContext(TiendaContext);
  // Validación de seguridad para que el programador no intente usar el hook fuera del Provider
  if (!context) {
    throw new Error('useTienda debe usarse dentro de TiendaProvider');
  }
  return context;
}