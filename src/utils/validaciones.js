import { normalizar } from './formatos.js';

// Revisa los datos de un producto antes de crearlo o editarlo.
export function validarProducto(datos, productos, id = null) {
  const errores = {};
  
  // 1. Validar Título
  if (!datos.titulo || datos.titulo.trim().length < 3)
    errores.titulo = 'Ingresa al menos 3 caracteres.';
  // 2. Validar que el título no exista ya en otro producto usando normalizar()
  else if (
    productos.some(
      (p) => p.id !== id && normalizar(p.titulo) === normalizar(datos.titulo),
    )
  )
    errores.titulo = 'Ya existe un producto con ese título.';

  // 3. Validar Categoría ID (debe ser un número del 1 al 7 según tu SQL)
  if (
    String(datos.categoriaId).trim() === '' ||
    !Number.isInteger(Number(datos.categoriaId)) ||
    Number(datos.categoriaId) < 1 ||
    Number(datos.categoriaId) > 7
  )
    errores.categoriaId = 'Ingresa un ID de categoría válido (1 al 7).';

  // NUEVO: Validar Plataforma
  if (!datos.plataforma || datos.plataforma.trim().length < 2)
    errores.plataforma = 'La plataforma es obligatoria.';

  // 4. Validar Descripción
  if (!datos.descripcion || datos.descripcion.trim().length < 5)
    errores.descripcion = 'Ingresa una descripción válida.';
    
  // 5. Validar precio: debe ser un número finito, mayor a cero y no estar vacío.
  if (
    String(datos.precio).trim() === '' ||
    !Number.isFinite(Number(datos.precio)) ||
    Number(datos.precio) <= 0
  )
    errores.precio = 'El precio debe ser mayor que cero.';
    
  // 6. Validar stock: debe ser un número entero (no decimales) mayor o igual a cero.
  if (
    String(datos.stock).trim() === '' ||
    !Number.isInteger(Number(datos.stock)) ||
    Number(datos.stock) < 0
  )
    errores.stock = 'El stock debe ser un entero mayor o igual a cero.';
    
  // 7. Validar imagen: intenta crear un objeto URL nativo.
  try {
    if (!['http:', 'https:'].includes(new URL(datos.imagen.trim()).protocol))
      throw new Error();
  } catch {
    errores.imagen = 'Ingresa una URL de imagen http o https.';
  }
  
  return errores;
}

// Se usa DESPUÉS de validar. Toma los datos crudos del formulario (strings) 
// y los convierte a sus tipos de datos correctos (números) limpiando espacios.
export function convertirProducto(datos) {
  return {
    titulo: datos.titulo.trim(),
    categoriaId: Number(datos.categoriaId),
    plataforma: datos.plataforma.trim(), // <-- AHORA SÍ VIAJA AL BACKEND
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen.trim(),
  };
}

// Utiliza Expresiones Regulares (Regex) para validar el formulario de contacto
export function validarContacto(campos) {
  const errores = {};
  
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      campos.email.trim(),
    )
  )
    errores.email = 'Ingresa un correo electrónico válido.';
    
  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'-]{5,100}$/.test(campos.asunto.trim()))
    errores.asunto = 'El asunto debe tener entre 5 y 100 caracteres válidos.';
    
  if (
    !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'"\-():;]{10,500}$/.test(
      campos.mensaje.trim(),
    )
  )
    errores.mensaje =
      'El mensaje debe tener entre 10 y 500 caracteres válidos.';
      
  return errores;
}

export function validarLogin(campos) {
  const errores = {};

  if (campos.usuario.trim() === '') errores.usuario = 'Ingresa tu usuario.';
  if (campos.contrasena === '') errores.contrasena = 'Ingresa tu contraseña.';

  return errores;
}