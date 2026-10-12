import { describe, it, expect } from 'vitest';
import { validarProducto } from './validaciones.js';

describe('validarProducto', () => {
  const productosExistentes = [
    { id: 1, nombre: 'Elden Ring' }
  ];

  it('debe retornar un objeto vacío si los datos son correctos', () => {
    const datosValidos = {
      nombre: 'Dark Souls',
      categoria: 'RPG',
      precio: 40000,
      stock: 10,
      imagen: 'https://ejemplo.com/img.jpg'
    };
    
    const errores = validarProducto(datosValidos, productosExistentes);
    // Si no hay errores, el objeto debe estar vacío (0 llaves)
    expect(Object.keys(errores)).toHaveLength(0);
  });

  it('debe retornar error si el nombre ya existe (ignorando mayúsculas)', () => {
    const datosDuplicados = {
      nombre: ' elden RING ', // Simulamos escritura descuidada
      categoria: 'RPG',
      precio: 40000,
      stock: 10,
      imagen: 'https://ejemplo.com/img.jpg'
    };
    
    const errores = validarProducto(datosDuplicados, productosExistentes);
    expect(errores.nombre).toBe('Ya existe un producto con ese nombre.');
  });

  it('debe retornar errores si los números son inválidos', () => {
    const datosInvalidos = {
      nombre: 'Juego OK',
      categoria: 'Cat OK',
      precio: -500, // Error: precio negativo
      stock: 1.5,   // Error: stock decimal
      imagen: 'https://ejemplo.com/img.jpg'
    };
    
    const errores = validarProducto(datosInvalidos, productosExistentes);
    expect(errores.precio).toBeDefined();
    expect(errores.stock).toBeDefined();
  });
});