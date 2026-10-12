import { describe, it, expect } from 'vitest';
import { tiendaReducer } from './tiendaReducer.js';

describe('tiendaReducer', () => {
  const estadoInicial = {
    productos: [{ id: 1, nombre: 'Juego A', stock: 5 }],
    carrito: [],
    mensaje: ''
  };

  it('debe agregar un producto nuevo al carrito', () => {
    const accion = { type: 'AGREGAR_AL_CARRITO', payload: 1 };
    const nuevoEstado = tiendaReducer(estadoInicial, accion);
    
    // Verificamos que el carrito ahora tenga 1 elemento
    expect(nuevoEstado.carrito).toHaveLength(1);
    expect(nuevoEstado.carrito[0].id).toBe(1);
    expect(nuevoEstado.carrito[0].cantidad).toBe(1);
    expect(nuevoEstado.mensaje).toBe('Producto agregado.');
  });

  it('debe bloquear agregar si no hay stock suficiente', () => {
    const estadoSinStock = {
      productos: [{ id: 1, nombre: 'Juego A', stock: 1 }],
      carrito: [{ id: 1, cantidad: 1 }], // Ya tiene el máximo en carrito
      mensaje: ''
    };
    const accion = { type: 'AGREGAR_AL_CARRITO', payload: 1 };
    const nuevoEstado = tiendaReducer(estadoSinStock, accion);

    // La cantidad no debe cambiar y debe arrojar error
    expect(nuevoEstado.carrito[0].cantidad).toBe(1);
    expect(nuevoEstado.mensaje).toBe('Stock insuficiente.');
  });

  it('debe vaciar el carrito completamente', () => {
    const estadoLleno = { ...estadoInicial, carrito: [{ id: 1, cantidad: 2 }] };
    const accion = { type: 'VACIAR_CARRITO' };
    const nuevoEstado = tiendaReducer(estadoLleno, accion);

    expect(nuevoEstado.carrito).toHaveLength(0);
  });
});