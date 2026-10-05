// Formatea un número al estándar de moneda chilena (CLP) sin decimales
export const precioCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);