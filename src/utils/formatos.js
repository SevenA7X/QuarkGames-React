// Función auxiliar para leer y convertir datos desde localStorage de forma segura
export function leerJSON(clave, valorPorDefecto) {
  try {
    // Busca el texto guardado bajo la clave indicada
    const guardado = localStorage.getItem(clave);
    // Si existe, lo convierte de JSON a objeto/arreglo; si no, usa el valor por defecto
    return guardado ? JSON.parse(guardado) : valorPorDefecto;
  } catch {
    // Si ocurre un error de lectura, retorna el valor por defecto para no bloquear la app
    return valorPorDefecto;
  }
}