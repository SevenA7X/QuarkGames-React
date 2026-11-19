import { vi } from 'vitest';

// Backend simulado para las pruebas: reemplaza fetch y responde como lo harían los
// microservicios reales (Auth, Catálogo y Carrito) detrás del API Gateway.
// Así las pruebas de App no necesitan tener el backend encendido.

export const JUEGOS_PRUEBA = [
  { id: 7, titulo: 'Elden Ring', plataforma: 'PC', precio: 49990, stock: 5, categoriaId: 6,
    categoria: { id: 6, nombre: 'RPG' }, descripcion: 'RPG de acción.', imagen: 'https://img/elden.jpg' },
  { id: 4, titulo: 'Street Fighter 6', plataforma: 'PlayStation 5', precio: 55000, stock: 12, categoriaId: 4,
    categoria: { id: 4, nombre: 'Lucha' }, descripcion: 'Lucha clásica.', imagen: 'https://img/sf6.jpg' },
  { id: 8, titulo: 'Grand Theft Auto V', plataforma: 'Xbox Series X|S', precio: 20000, stock: 10, categoriaId: 5,
    categoria: { id: 5, nombre: 'Acción' }, descripcion: 'Mundo abierto.', imagen: 'https://img/gta.jpg' },
  { id: 12, titulo: 'Mario Kart 8 Deluxe', plataforma: 'Nintendo Switch', precio: 45000, stock: 18, categoriaId: 7,
    categoria: { id: 7, nombre: 'Carreras' }, descripcion: 'Carreras.', imagen: 'https://img/mk8.jpg' },
];

const TOKEN = 'token-de-prueba';

function respuesta(status, cuerpo) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (cuerpo === undefined ? '' : JSON.stringify(cuerpo)),
  };
}

export function simularBackend() {
  const db = {
    juegos: structuredClone(JUEGOS_PRUEBA),
    carritos: new Map(),   // X-Carrito-Id -> [{ juegoId, cantidad }]
  };

  const vistaCarrito = (id, mensaje) => {
    const items = (db.carritos.get(id) ?? []).map((i) => {
      const j = db.juegos.find((x) => x.id === i.juegoId);
      return { juegoId: i.juegoId, titulo: j.titulo, imagen: j.imagen, precioUnitario: j.precio,
        cantidad: i.cantidad, subtotal: j.precio * i.cantidad };
    });
    return { carritoId: id, items, totalUnidades: items.reduce((s, i) => s + i.cantidad, 0),
      total: items.reduce((s, i) => s + i.subtotal, 0), mensaje };
  };

  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, opciones = {}) => {
    const ruta = new URL(url).pathname.replace('/api/v1', '');
    const metodo = opciones.method ?? 'GET';
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : undefined;
    const cabeceras = opciones.headers ?? {};
    const esAdmin = cabeceras.Authorization === `Bearer ${TOKEN}`;

    // ===== MS Auth =====
    if (ruta === '/auth/login') {
      return cuerpo.usuario === 'admin' && cuerpo.clave === '1234'
        ? respuesta(200, { token: TOKEN, tipo: 'Bearer', usuario: 'admin', rol: 'ADMIN', expiraEnMs: 3600000 })
        : respuesta(401, { status: 401, mensaje: 'Usuario o contraseña incorrectos.' });
    }
    if (ruta === '/auth/validar') {
      return esAdmin
        ? respuesta(200, { usuario: 'admin', rol: 'ADMIN' })
        : respuesta(401, { status: 401, mensaje: 'Token ausente, inválido o expirado.' });
    }

    // ===== MS Catálogo =====
    if (ruta === '/juegos' && metodo === 'GET') return respuesta(200, db.juegos);
    if (ruta.startsWith('/juegos')) {
      if (!esAdmin) return respuesta(401, { status: 401, mensaje: 'Debes iniciar sesión como administrador.' });
      if (metodo === 'POST') {
        const nuevo = { ...cuerpo, id: 100 + db.juegos.length };
        db.juegos.push(nuevo);
        return respuesta(201, nuevo);
      }
      const id = Number(ruta.split('/')[2]);
      if (metodo === 'DELETE') {
        db.juegos = db.juegos.filter((j) => j.id !== id);
        return respuesta(200, 'Juego Eliminado');
      }
    }

    // ===== MS Carrito =====
    if (ruta.startsWith('/carrito')) {
      const id = cabeceras['X-Carrito-Id'];
      const items = db.carritos.get(id) ?? [];
      db.carritos.set(id, items);

      if (ruta === '/carrito' && metodo === 'GET') return respuesta(200, vistaCarrito(id));
      if (ruta === '/carrito' && metodo === 'DELETE') {
        db.carritos.set(id, []);
        return respuesta(200, vistaCarrito(id, 'Carrito vaciado.'));
      }
      if (ruta === '/carrito/items' && metodo === 'POST') {
        const juego = db.juegos.find((j) => j.id === cuerpo.juegoId);
        const item = items.find((i) => i.juegoId === cuerpo.juegoId);
        const actual = item?.cantidad ?? 0;
        if (actual + cuerpo.cantidad > juego.stock) {
          return respuesta(409, { status: 409, mensaje: 'Stock insuficiente.' });
        }
        if (item) item.cantidad += cuerpo.cantidad;
        else items.push({ juegoId: cuerpo.juegoId, cantidad: cuerpo.cantidad });
        return respuesta(200, vistaCarrito(id, 'Producto agregado.'));
      }
      if (ruta.startsWith('/carrito/items/')) {
        const juegoId = Number(ruta.split('/')[3]);
        if (metodo === 'PUT' && cuerpo.cantidad > 0) {
          items.find((i) => i.juegoId === juegoId).cantidad = cuerpo.cantidad;
          return respuesta(200, vistaCarrito(id, 'Cantidad actualizada.'));
        }
        db.carritos.set(id, items.filter((i) => i.juegoId !== juegoId));
        return respuesta(200, vistaCarrito(id, 'Producto eliminado del carrito.'));
      }
      if (ruta === '/carrito/comprar') {
        if (items.length === 0) return respuesta(400, { status: 400, mensaje: 'El carrito está vacío.' });
        const resumen = vistaCarrito(id);
        items.forEach((i) => { db.juegos.find((j) => j.id === i.juegoId).stock -= i.cantidad; });
        db.carritos.set(id, []);
        return respuesta(200, { ...resumen, mensaje: 'Compra simulada completada. Stock actualizado.' });
      }
    }

    return respuesta(404, { status: 404, mensaje: `Ruta no simulada: ${metodo} ${ruta}` });
  });

  return { db, fetchSpy, TOKEN };
}
