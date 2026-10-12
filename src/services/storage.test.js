import { describe, it, expect, beforeEach } from 'vitest';
import { leerJSON, guardarJSON } from './storage.js';

describe('Servicio storage.js', () => {
  // Antes de cada prueba, limpiamos la memoria del navegador simulado
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe guardar y leer un objeto JSON correctamente', () => {
    const datos = { usuario: 'admin', rol: 'super' };
    guardarJSON('test_clave', datos);
    
    const recuperado = leerJSON('test_clave', null);
    // toStrictEqual verifica que los objetos sean idénticos en estructura y valores
    expect(recuperado).toStrictEqual(datos);
  });

  it('debe retornar el valor por defecto si la clave no existe', () => {
    const recuperado = leerJSON('clave_inexistente', []);
    expect(recuperado).toStrictEqual([]);
  });

  it('debe retornar el valor por defecto si el JSON es inválido', () => {
    // Forzamos un error guardando texto plano que no es formato JSON válido
    localStorage.setItem('clave_rota', 'esto no es json {');
    
    const recuperado = leerJSON('clave_rota', 'defecto');
    expect(recuperado).toBe('defecto');
  });
});