// Cliente HTTP único de la aplicación. Todas las llamadas al backend pasan por aquí:
//  - Usan la URL del API Gateway (nunca la de un microservicio directo).
//  - Agregan el token JWT en la cabecera Authorization cuando hay sesión.
//  - Convierten las respuestas de error del backend en un ApiError con un mensaje legible.
import { leerJSON, guardarJSON } from './storage.js';

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '');
const CLAVE_TOKEN = 'quark_token';

// Error con el código HTTP y los datos que envió el backend
export class ApiError extends Error {
  constructor(status, mensaje, errores = {}, detalles = []) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.errores = errores;
    this.detalles = detalles;
  }
}

// ===== Token de sesión =====
// Se guarda en localStorage para que la sesión sobreviva a un F5 (persistencia de sesión).
export const obtenerToken = () => leerJSON(CLAVE_TOKEN, null);
export const guardarToken = (token) => guardarJSON(CLAVE_TOKEN, token);
export const limpiarToken = () => localStorage.removeItem(CLAVE_TOKEN);

// Lee el cuerpo de la respuesta sin romperse si viene vacío (204) o si no es JSON
async function leerCuerpo(respuesta) {
  const texto = await respuesta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return { mensaje: texto };
  }
}

// Traduce el cuerpo de error del backend a un ApiError.
// Auth y Carrito responden { status, mensaje, errores?, detalles? }.
// El catálogo, en errores de validación, responde solo el mapa { campo: mensaje }.
function crearError(status, datos) {
  if (datos?.mensaje) {
    return new ApiError(status, datos.mensaje, datos.errores ?? {}, datos.detalles ?? []);
  }
  if (datos && typeof datos === 'object' && !Array.isArray(datos)) {
    return new ApiError(status, 'Revisa los datos ingresados.', datos);
  }
  return new ApiError(status, `Error inesperado del servidor (HTTP ${status}).`);
}

// Llamada genérica: api('/juegos'), api('/juegos', { method: 'POST', body: juego }), etc.
export async function api(ruta, { method = 'GET', body, headers = {} } = {}) {
  const cabeceras = { ...headers };
  if (body !== undefined) cabeceras['Content-Type'] = 'application/json';

  const token = obtenerToken();
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: cabeceras,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa que el API Gateway esté iniciado.');
  }

  const datos = await leerCuerpo(respuesta);

  if (!respuesta.ok) {
    // Token vencido o inválido: se cierra la sesión en toda la app (AuthContext escucha este evento)
    if (respuesta.status === 401 && token) {
      limpiarToken();
      window.dispatchEvent(new Event('quark:sesion-expirada'));
    }
    throw crearError(respuesta.status, datos);
  }

  return datos;   // null cuando la respuesta viene vacía (204)
}
