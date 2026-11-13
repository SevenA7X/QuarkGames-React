import { describe, it, expect } from 'vitest';
import { validarProducto, validarLogin, validarContacto } from './validaciones.js';

describe('validarProducto', () => {
  // Los productos usan los campos del backend: titulo, categoriaId, plataforma, descripcion...
  const productosExistentes = [
    { id: 1, titulo: 'Elden Ring' }
  ];

  it('debe retornar un objeto vacío si los datos son correctos', () => {
    const datosValidos = {
      titulo: 'Dark Souls',
      categoriaId: 6,
      plataforma: 'PC',
      descripcion: 'RPG de acción exigente.',
      precio: 40000,
      stock: 10,
      imagen: 'https://ejemplo.com/img.jpg'
    };
    
    const errores = validarProducto(datosValidos, productosExistentes);
    // Si no hay errores, el objeto debe estar vacío (0 llaves)
    expect(Object.keys(errores)).toHaveLength(0);
  });

  it('debe retornar error si el título ya existe (ignorando mayúsculas)', () => {
    const datosDuplicados = {
      titulo: ' elden RING ', // Simulamos escritura descuidada
      categoriaId: 6,
      plataforma: 'PC',
      descripcion: 'RPG de acción exigente.',
      precio: 40000,
      stock: 10,
      imagen: 'https://ejemplo.com/img.jpg'
    };
    
    const errores = validarProducto(datosDuplicados, productosExistentes);
    expect(errores.titulo).toBe('Ya existe un producto con ese título.');
  });

  it('debe retornar errores si los números son inválidos', () => {
    const datosInvalidos = {
      titulo: 'Juego OK',
      categoriaId: 6,
      plataforma: 'PC',
      descripcion: 'Descripción válida.',
      precio: -500, // Error: precio negativo
      stock: 1.5,   // Error: stock decimal
      imagen: 'https://ejemplo.com/img.jpg'
    };
    
    const errores = validarProducto(datosInvalidos, productosExistentes);
    expect(errores.precio).toBeDefined();
    expect(errores.stock).toBeDefined();
  });
});

describe('validarContacto', () => {
    it('debe retornar error si el correo electrónico tiene un formato inválido', () => {
      const camposInvalidos = {
        email: 'correo-sin-arroba.com',
        asunto: 'Consulta válida',
        mensaje: 'Este es un mensaje de prueba con la longitud correcta.'
      };
      
      const errores = validarContacto(camposInvalidos);
      expect(errores.email).toBe('Ingresa un correo electrónico válido.');
    });
  });

describe('validarLogin', () => {
  it('debe retornar un error por cada campo vacío', () => {
    // El usuario solo con espacios también cuenta como vacío
    const errores = validarLogin({ usuario: '   ', contrasena: '' });

    expect(errores.usuario).toBe('Ingresa tu usuario.');
    expect(errores.contrasena).toBe('Ingresa tu contraseña.');
  });

  it('debe retornar un objeto vacío si ambos campos tienen datos', () => {
    const errores = validarLogin({ usuario: 'admin', contrasena: '1234' });

    expect(Object.keys(errores)).toHaveLength(0);
  });
});