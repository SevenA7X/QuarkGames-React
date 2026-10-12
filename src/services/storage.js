
// Función para recuperar datos guardados en el navegador
export function leerJSON(clave, valorPorDefecto) {
  try {
    // Busca el texto plano asociado a la 'clave' (ej. "quark_productos")
    const guardado = localStorage.getItem(clave);
    // Convierte el texto JSON de vuelta a un objeto/arreglo de JavaScript
    return guardado ? JSON.parse(guardado) : valorPorDefecto;
  } catch {
    // El try/catch evita que la aplicación se "caiga" si el texto guardado está corrupto
    return valorPorDefecto;
  }
}

// Función para guardar datos en el navegador
export function guardarJSON(clave, valor) {
  try {
    // localStorage solo acepta texto. JSON.stringify convierte los objetos/arreglos a texto plano.
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error('Error al guardar en localStorage', error);
  }
}