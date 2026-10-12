
// Utiliza la API nativa del navegador (Intl.NumberFormat) para formatear 
// cualquier número al estándar de moneda chilena, sin decimales.
// Ejemplo: 10000 se transforma en "$ 10.000".
export const precioCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);

// Toma un texto, lo separa en caracteres base y acentos (normalize 'NFD'),
// elimina los acentos (replace con expresión regular), lo pasa a minúsculas
// y le quita espacios en los bordes (trim).
// Es fundamental para que el buscador encuentre "Mario" aunque el usuario escriba " Mário ".
export const normalizar = (texto) =>
  String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Recibe la cantidad de stock y retorna un objeto con el texto a mostrar 
// y la "variante" (color) que usará el componente <Badge> de React Bootstrap.
export function estadoStock(stock) {
  if (stock <= 0) return { texto: 'Sin stock', variante: 'danger' }; // Rojo
  if (stock <= 3)
    return { texto: `Últimas ${stock} unidades`, variante: 'warning' }; // Amarillo
  return { texto: 'Disponible', variante: 'success' }; // Verde
}