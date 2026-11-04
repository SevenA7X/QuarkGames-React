import { createContext, useContext, useReducer, useEffect } from 'react';
import { tiendaReducer } from '../store/tiendaReducer.js';
import { leerJSON, guardarJSON } from '../services/storage.js';


// 1. Crear el contexto
const TiendaContext = createContext();

// 2. Definir el estado inicial. 
// Los productos inician vacíos, esperando la respuesta del backend.
const ESTADO_INICIAL = {
  productos: [], 
  carrito: leerJSON('quark_carrito', []),
  mensaje: '', 
};

// 3. Crear el Provider
export function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(tiendaReducer, ESTADO_INICIAL);

  // NUEVO: Petición HTTP al API Gateway (Puerto 8080)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:8080/api/v1/juegos');
        if (respuesta.ok) {
          const data = await respuesta.json();
          // Enviamos los datos obtenidos al Reducer
          dispatch({ type: 'CARGAR_PRODUCTOS_DESDE_DB', payload: data });
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      }
    };
    
    fetchProductos();
  }, []); // Se ejecuta solo una vez al cargar la aplicación

  // ACTUALIZADO: Solo guardamos el carrito en localStorage, no los productos.
  useEffect(() => {
    guardarJSON('quark_carrito', estado.carrito);
  }, [estado.carrito]);

  // Manejo del mensaje temporal
  useEffect(() => {
    if (estado.mensaje) {
      const timer = setTimeout(() => {
        dispatch({ type: 'LIMPIAR_MENSAJE' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [estado.mensaje]);

  return (
    <TiendaContext.Provider value={{ estado, dispatch }}>
      {children}
    </TiendaContext.Provider>
  );
}

// 4. Hook personalizado
export function useTienda() {
  const context = useContext(TiendaContext);
  if (!context) {
    throw new Error('useTienda debe usarse dentro de TiendaProvider');
  }
  return context;
}