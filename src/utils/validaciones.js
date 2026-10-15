// ==========================================
// src/utils/validaciones.js
// ==========================================

import { normalizar } from './formatos.js';

// Revisa los datos de un producto antes de crearlo o editarlo.
// Recibe los datos del formulario, la lista actual de productos (para buscar duplicados)
// y opcionalmente el ID (si estamos editando, ignoramos el nombre del producto actual).
export function validarProducto(datos, productos, id = null) {
  const errores = {};
  
  // 1. Validar nombre (mínimo 3 caracteres)
  if (datos.nombre.trim().length < 3)
    errores.nombre = 'Ingresa al menos 3 caracteres.';
  // 2. Validar que el nombre no exista ya en otro producto usando normalizar()
  else if (
    productos.some(
      (p) => p.id !== id && normalizar(p.nombre) === normalizar(datos.nombre),
    )
  )
    errores.nombre = 'Ya existe un producto con ese nombre.';

  // 3. Validar categoría
  if (datos.categoria.trim().length < 3)
    errores.categoria = 'Ingresa al menos 3 caracteres.';
    
  // 4. Validar precio: debe ser un número finito, mayor a cero y no estar vacío.
  if (
    String(datos.precio).trim() === '' ||
    !Number.isFinite(Number(datos.precio)) ||
    Number(datos.precio) <= 0
  )
    errores.precio = 'El precio debe ser mayor que cero.';
    
  // 5. Validar stock: debe ser un número entero (no decimales) mayor o igual a cero.
  if (
    String(datos.stock).trim() === '' ||
    !Number.isInteger(Number(datos.stock)) ||
    Number(datos.stock) < 0
  )
    errores.stock = 'El stock debe ser un entero mayor o igual a cero.';
    
  // 6. Validar imagen: intenta crear un objeto URL nativo. Si falla o no es http/https, arroja error.
  try {
    if (!['http:', 'https:'].includes(new URL(datos.imagen.trim()).protocol))
      throw new Error();
  } catch {
    errores.imagen = 'Ingresa una URL de imagen http o https.';
  }
  
  return errores; // Retorna el objeto con todos los errores encontrados (o vacío si está perfecto)
}

// Se usa DESPUÉS de validar. Toma los datos crudos del formulario (strings) 
// y los convierte a sus tipos de datos correctos (números) limpiando espacios.
export function convertirProducto(datos) {
  return {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen.trim(),
  };
}

// Utiliza Expresiones Regulares (Regex) para validar el formulario de contacto.
export function validarContacto(campos) {
  const errores = {};
  
  // Regex para formato de email tradicional (texto@texto.dominio)
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      campos.email.trim(),
    )
  )
    errores.email = 'Ingresa un correo electrónico válido.';
    
  // Regex para asunto: Solo letras, números y puntuación básica. Entre 5 y 100 caracteres.
  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'-]{5,100}$/.test(campos.asunto.trim()))
    errores.asunto = 'El asunto debe tener entre 5 y 100 caracteres válidos.';
    
  // Regex para mensaje: Similar al asunto, pero permitiendo más signos (comillas, guiones) y entre 10 y 500 caracteres.
  if (
    !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'"\-():;]{10,500}$/.test(
      campos.mensaje.trim(),
    )
  )
    errores.mensaje =
      'El mensaje debe tener entre 10 y 500 caracteres válidos.';
      
  return errores;
}

// Revisa que el formulario de inicio de sesión no tenga campos vacíos.
// No comprueba si las credenciales son correctas: eso lo decide AuthContext al llamar a login().
export function validarLogin(campos) {
  const errores = {};

  if (campos.usuario.trim() === '') errores.usuario = 'Ingresa tu usuario.';
  if (campos.contrasena === '') errores.contrasena = 'Ingresa tu contraseña.';

  return errores;
}
