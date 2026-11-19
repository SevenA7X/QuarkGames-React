// Un "Reducer" es una funcion pura. Recibe el "estado" actual (productos, carrito)
// y una "accon" (qué queremos hacer), y retorna un nuevo objeto de estado.
//
// las reglas de negocio del carrito (no superar el stock, validar la compra,
// descontar el stock) viven en el backend (MS Carrito). El reducer ya no las calcula:
// solo guarda en el estado lo que responde el servidor. Así hay UNA sola fuente de verdad.
export function tiendaReducer(estado, accion) {
  switch (accion.type) {
    // Catálogo recibido del MS Catálogo (GET /juegos)
    case 'CARGAR_PRODUCTOS_DESDE_DB': {
      return { ...estado, productos: accion.payload ?? [] };
    }

    // Carrito recibido del MS Carrito. payload es la respuesta del backend:
    // { carritoId, items: [{ juegoId, titulo, imagen, precioUnitario, cantidad, subtotal }], total, ... }
    case 'CARGAR_CARRITO': {
      return { ...estado, carrito: accion.payload?.items ?? [] };
    }

    // Aviso flotante (éxito o advertencia). Lo usan las respuestas y los errores del backend.
    case 'MOSTRAR_MENSAJE': {
      return {
        ...estado,
        mensaje: accion.payload.mensaje,
        tipoMensaje: accion.payload.tipo ?? 'success',
      };
    }

    case 'GUARDAR_PRODUCTO': {
      const prod = accion.payload;
      const existe = estado.productos.some((p) => p.id === prod.id);

      // Si el ID ya existe, lo reemplazamos (editar). Si no, lo añadimos (crear).
      const nuevosProductos = existe
        ? estado.productos.map((p) => (p.id === prod.id ? prod : p))
        : [...estado.productos, prod];

      return { ...estado, productos: nuevosProductos };
    }

    case 'ELIMINAR_PRODUCTO': {
      const id = accion.payload;
      // Eliminamos el producto del catálogo...
      const nuevosProductos = estado.productos.filter((p) => p.id !== id);
      // ...y TAMBIÉN de la vista del carrito para mantener la integridad referencial
      const nuevoCarrito = estado.carrito.filter((i) => i.juegoId !== id);

      return { ...estado, productos: nuevosProductos, carrito: nuevoCarrito };
    }

    case 'LIMPIAR_MENSAJE': {
      return { ...estado, mensaje: '' };
    }

    // Si la acción no existe, devolvemos el estado sin tocarlo
    default:
      return estado;
  }
}
