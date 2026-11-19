import { describe, it, expect } from 'vitest';
import { tiendaReducer } from './tiendaReducer.js';

// El reducer solo guarda en el estado lo que responde el backend: eso es lo que se prueba aquí.
describe('tiendaReducer', () => {
  const estadoInicial = {
    productos: [{ id: 7, titulo: 'Elden Ring', stock: 5 }],
    carrito: [],
    mensaje: '',
  };

  it('carga el catálogo recibido del backend', () => {
    const juegos = [{ id: 1, titulo: 'Hades' }, { id: 2, titulo: 'DOOM' }];
    const nuevo = tiendaReducer(estadoInicial, { type: 'CARGAR_PRODUCTOS_DESDE_DB', payload: juegos });

    expect(nuevo.productos).toEqual(juegos);
  });

  it('usa un catálogo vacío si el backend no envía cuerpo (204)', () => {
    const nuevo = tiendaReducer(estadoInicial, { type: 'CARGAR_PRODUCTOS_DESDE_DB', payload: null });

    expect(nuevo.productos).toEqual([]);
  });

  it('guarda los ítems del carrito que responde el MS Carrito', () => {
    const respuesta = {
      carritoId: 'abc',
      items: [{ juegoId: 7, titulo: 'Elden Ring', precioUnitario: 49990, cantidad: 2, subtotal: 99980 }],
      total: 99980,
    };
    const nuevo = tiendaReducer(estadoInicial, { type: 'CARGAR_CARRITO', payload: respuesta });

    expect(nuevo.carrito).toHaveLength(1);
    expect(nuevo.carrito[0].cantidad).toBe(2);
    // Inmutabilidad: el estado original no se modifica
    expect(estadoInicial.carrito).toEqual([]);
  });

  it('muestra un aviso de advertencia', () => {
    const nuevo = tiendaReducer(estadoInicial, {
      type: 'MOSTRAR_MENSAJE',
      payload: { mensaje: 'Stock insuficiente.', tipo: 'warning' },
    });

    expect(nuevo.mensaje).toBe('Stock insuficiente.');
    expect(nuevo.tipoMensaje).toBe('warning');
  });

  it('usa éxito como tipo de aviso por defecto y lo limpia', () => {
    const conAviso = tiendaReducer(estadoInicial, { type: 'MOSTRAR_MENSAJE', payload: { mensaje: 'Producto agregado.' } });
    expect(conAviso.tipoMensaje).toBe('success');

    const limpio = tiendaReducer(conAviso, { type: 'LIMPIAR_MENSAJE' });
    expect(limpio.mensaje).toBe('');
  });

  it('crea o reemplaza un producto guardado desde el panel', () => {
    const creado = tiendaReducer(estadoInicial, { type: 'GUARDAR_PRODUCTO', payload: { id: 9, titulo: 'Hades', stock: 3 } });
    expect(creado.productos).toHaveLength(2);

    const editado = tiendaReducer(creado, { type: 'GUARDAR_PRODUCTO', payload: { id: 7, titulo: 'Elden Ring GOTY', stock: 5 } });
    expect(editado.productos).toHaveLength(2);
    expect(editado.productos[0].titulo).toBe('Elden Ring GOTY');
  });

  it('al eliminar un producto también lo quita de la vista del carrito', () => {
    const conCarrito = { ...estadoInicial, carrito: [{ juegoId: 7, cantidad: 1 }] };
    const nuevo = tiendaReducer(conCarrito, { type: 'ELIMINAR_PRODUCTO', payload: 7 });

    expect(nuevo.productos).toEqual([]);
    expect(nuevo.carrito).toEqual([]);
  });

  it('ignora acciones desconocidas', () => {
    expect(tiendaReducer(estadoInicial, { type: 'NO_EXISTE' })).toBe(estadoInicial);
  });
});
