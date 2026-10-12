
// Un "Reducer" es una función pura. Recibe el "estado" actual (productos, carrito)
// y una "acción" (qué queremos hacer), y retorna un nuevo objeto de estado.
export function tiendaReducer(estado, accion) {
  // Evaluamos el "tipo" de acción enviada
  switch (accion.type) {
    case 'AGREGAR_AL_CARRITO': {
      // payload es el dato que acompaña a la acción (en este caso, el ID del producto)
      const id = accion.payload; 
      const producto = estado.productos.find((p) => p.id === id);
      const cantidad = estado.carrito.find((i) => i.id === id)?.cantidad ?? 0;

      // Regla de negocio: Validar que el producto exista y haya stock suficiente
      if (!producto || cantidad >= producto.stock) {
        return { ...estado, mensaje: 'Stock insuficiente.' };
      }

      // Inmutabilidad: Si el ítem ya existe, creamos un nuevo arreglo map() sumando 1.
      // Si no existe, creamos un nuevo arreglo sumando el ítem al final [...estado].
      const existe = estado.carrito.some((i) => i.id === id);
      const nuevoCarrito = existe
        ? estado.carrito.map((i) =>
            i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i,
          )
        : [...estado.carrito, { id, cantidad: 1 }];

      // Retornamos una copia del estado (...estado) modificando solo carrito y mensaje
      return { ...estado, carrito: nuevoCarrito, mensaje: 'Producto agregado.' };
    }

    case 'QUITAR_DEL_CARRITO': {
      // Usamos .filter() para crear un nuevo arreglo excluyendo el ID seleccionado
      const nuevoCarrito = estado.carrito.filter((i) => i.id !== accion.payload);
      return { ...estado, carrito: nuevoCarrito };
    }

    case 'VACIAR_CARRITO': {
      // Simplemente reemplazamos el carrito por un arreglo vacío
      return { ...estado, carrito: [] };
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
      // ...y TAMBIÉN lo eliminamos del carrito para mantener la integridad referencial
      const nuevoCarrito = estado.carrito.filter((i) => i.id !== id);
      
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