import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { tiendaReducer } from '../store/tiendaReducer.js';
import { leerJSON, guardarJSON } from '../services/storage.js';
import { api } from '../services/api.js';

// 1. Crear el contexto
const TiendaContext = createContext();

// 2. Estado inicial: catálogo y carrito llegan desde el backend al montar la app.
const ESTADO_INICIAL = {
  productos: [],
  carrito: [],
  mensaje: '',
  tipoMensaje: 'success',
};

// El carrito es anónimo: cada navegador tiene un UUID propio que se envía en la cabecera
// X-Carrito-Id. Se guarda en localStorage para recuperar el mismo carrito tras un F5.
const CLAVE_CARRITO_ID = 'quark_carrito_id';
function obtenerCarritoId() {
  let id = leerJSON(CLAVE_CARRITO_ID, null);
  if (!id) {
    id = crypto.randomUUID();
    guardarJSON(CLAVE_CARRITO_ID, id);
  }
  return id;
}

// 3. Crear el Provider
export function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(tiendaReducer, ESTADO_INICIAL);
  const [carritoId] = useState(obtenerCarritoId);

  const avisar = useCallback((mensaje, tipo = 'success') => {
    dispatch({ type: 'MOSTRAR_MENSAJE', payload: { mensaje, tipo } });
  }, []);

  // Muestra el error del backend; si trae detalles de stock, los agrega al mensaje
  const avisarError = useCallback((error) => {
    const detalle = error.detalles?.length ? ` ${error.detalles.join(' · ')}` : '';
    avisar(`${error.message}${detalle}`, 'warning');
  }, [avisar]);

  // GET /juegos (MS Catálogo). Responde 204 sin cuerpo si no hay juegos: api() devuelve null.
  const cargarProductos = useCallback(async () => {
    try {
      const juegos = await api('/juegos');
      dispatch({ type: 'CARGAR_PRODUCTOS_DESDE_DB', payload: juegos ?? [] });
    } catch (error) {
      avisarError(error);
    }
  }, [avisarError]);

  // Todas las operaciones del carrito envían X-Carrito-Id y guardan la respuesta del MS Carrito
  const operarCarrito = useCallback(async (ruta, opciones = {}) => {
    try {
      const respuesta = await api(ruta, { ...opciones, headers: { 'X-Carrito-Id': carritoId } });
      dispatch({ type: 'CARGAR_CARRITO', payload: respuesta });
      if (respuesta?.mensaje) avisar(respuesta.mensaje);
      return true;
    } catch (error) {
      avisarError(error);
      return false;
    }
  }, [carritoId, avisar, avisarError]);

  // Al montar la app: catálogo y carrito guardado en el servidor
  useEffect(() => {
    cargarProductos();
    api('/carrito', { headers: { 'X-Carrito-Id': carritoId } })
      .then((carrito) => dispatch({ type: 'CARGAR_CARRITO', payload: carrito }))
      .catch(() => {});   // si el backend no responde, el aviso ya lo muestra cargarProductos()
  }, [cargarProductos, carritoId]);

  // ===== Acciones del carrito (antes eran acciones locales del reducer) =====

  // AGREGAR_AL_CARRITO → POST /carrito/items. El backend responde 409 si no hay stock.
  const agregarAlCarrito = (juegoId) =>
    operarCarrito('/carrito/items', { method: 'POST', body: { juegoId, cantidad: 1 } });

  // RESTAR_DEL_CARRITO → PUT con la cantidad actual - 1 (con 0 el backend quita el ítem)
  const restarDelCarrito = (juegoId) => {
    const item = estado.carrito.find((i) => i.juegoId === juegoId);
    if (!item) return Promise.resolve(false);
    return operarCarrito(`/carrito/items/${juegoId}`, { method: 'PUT', body: { cantidad: item.cantidad - 1 } });
  };

  // QUITAR_DEL_CARRITO y VACIAR_CARRITO
  const quitarDelCarrito = (juegoId) => operarCarrito(`/carrito/items/${juegoId}`, { method: 'DELETE' });
  const vaciarCarrito = () => operarCarrito('/carrito', { method: 'DELETE' });

  // COMPRAR → el backend valida stock, lo descuenta en el catálogo y vacía el carrito.
  // Después se recarga el catálogo para mostrar el stock actualizado.
  async function comprar() {
    try {
      const respuesta = await api('/carrito/comprar', {
        method: 'POST',
        headers: { 'X-Carrito-Id': carritoId },
      });
      dispatch({ type: 'CARGAR_CARRITO', payload: { items: [] } });
      avisar(respuesta.mensaje);
      await cargarProductos();
      return true;
    } catch (error) {
      avisarError(error);
      if (error.status === 409) await cargarProductos();   // el stock cambió: mostrar el vigente
      return false;
    }
  }

  // Manejo del mensaje temporal: se cierra solo a los 3 segundos
  useEffect(() => {
    if (estado.mensaje) {
      const timer = setTimeout(() => {
        dispatch({ type: 'LIMPIAR_MENSAJE' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [estado.mensaje]);

  return (
    <TiendaContext.Provider
      value={{
        estado,
        dispatch,
        cargarProductos,
        agregarAlCarrito,
        restarDelCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        comprar,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}

// 4. Hook personalizado
// El hook vive junto a su Provider a propósito (patrón habitual de Context).
// eslint-disable-next-line react-refresh/only-export-components
export function useTienda() {
  const context = useContext(TiendaContext);
  if (!context) {
    throw new Error('useTienda debe usarse dentro de TiendaProvider');
  }
  return context;
}
