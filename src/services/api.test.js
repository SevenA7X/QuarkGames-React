import { describe, it, expect, vi } from 'vitest';
import { api, ApiError, API_URL, guardarToken, obtenerToken } from './api.js';

// Respuesta mínima con la forma que usa api.js (ok, status, text)
function respuesta(status, cuerpo) {
  const texto = cuerpo === undefined ? '' : typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo);
  return { ok: status >= 200 && status < 300, status, text: async () => texto };
}

describe('cliente HTTP (api.js)', () => {
  it('hace GET al API Gateway y devuelve el JSON', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(200, [{ id: 1 }]));

    const datos = await api('/juegos');

    expect(datos).toEqual([{ id: 1 }]);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_URL}/juegos`, expect.objectContaining({ method: 'GET' }));
  });

  it('envía el cuerpo como JSON y agrega el token si hay sesión', async () => {
    guardarToken('abc.def.ghi');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(201, { id: 9 }));

    await api('/juegos', { method: 'POST', body: { titulo: 'Hades' } });

    const opciones = fetchSpy.mock.calls[0][1];
    expect(opciones.body).toBe('{"titulo":"Hades"}');
    expect(opciones.headers['Content-Type']).toBe('application/json');
    expect(opciones.headers.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('no envía Authorization si no hay sesión', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(200, []));

    await api('/juegos');

    expect(fetchSpy.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('devuelve null cuando la respuesta viene vacía (204)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(204));

    expect(await api('/juegos')).toBeNull();
  });

  it('convierte un error del backend en ApiError con su mensaje y detalles', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(409, {
      status: 409,
      mensaje: 'Stock insuficiente para completar la compra.',
      detalles: ['Elden Ring: pediste 6, quedan 5'],
    }));

    const error = await api('/carrito/comprar', { method: 'POST' }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(409);
    expect(error.message).toBe('Stock insuficiente para completar la compra.');
    expect(error.detalles).toEqual(['Elden Ring: pediste 6, quedan 5']);
  });

  it('entiende los errores de validación del catálogo (mapa de campos)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(400, { categoriaId: 'El ID de la categoría es obligatorio' }));

    const error = await api('/juegos', { method: 'POST', body: {} }).catch((e) => e);

    expect(error.message).toBe('Revisa los datos ingresados.');
    expect(error.errores.categoriaId).toBe('El ID de la categoría es obligatorio');
  });

  it('explica cuando el backend no responde', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const error = await api('/juegos').catch((e) => e);

    expect(error.status).toBe(0);
    expect(error.message).toMatch(/No se pudo conectar/);
  });

  it('cierra la sesión si el token es rechazado (401)', async () => {
    guardarToken('token-vencido');
    const aviso = vi.fn();
    window.addEventListener('quark:sesion-expirada', aviso);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(401, { status: 401, mensaje: 'Debes iniciar sesión como administrador.' }));

    await api('/juegos/1', { method: 'DELETE' }).catch(() => {});

    expect(obtenerToken()).toBeNull();
    expect(aviso).toHaveBeenCalledTimes(1);
    window.removeEventListener('quark:sesion-expirada', aviso);
  });
});
