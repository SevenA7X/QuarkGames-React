
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
  // 1. Sin stock (0): Gris
  if (stock <= 0) {
    return { texto: 'Agotado', variante: 'secondary' }; 
  }
  
  // 2. Stock crítico (1 a 5): Rojo
  if (stock <= 5) {
    const texto = stock === 1 ? 'Última 1 unidad' : `Últimas ${stock} unidades`;
    return { texto, variante: 'danger' }; 
  }
  
  // 3. Stock bajo (6 a 10): Naranjo
  if (stock <= 10) {
    return { texto: 'Disponible', variante: 'naranja' }; 
  }
  
  // 4. Stock medio (11 a 19): Amarillo
  if (stock < 20) {
    return { texto: 'Disponible', variante: 'warning' }; 
  }
  
  // 5. Stock óptimo (20 hacia arriba): Verde
  return { texto: 'Disponible', variante: 'success' }; 
}