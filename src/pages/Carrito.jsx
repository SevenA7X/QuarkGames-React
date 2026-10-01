import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

export default function Carrito({
  carrito,
  productos,
  alCambiarCantidad,
  alEliminar,
  alVaciar,
  alFinalizarCompra
}) {
  // Estado para mostrar un aviso de éxito cuando el cliente concreta la compra
  const [compraExitosa, setCompraExitosa] = useState(false);

  // Cruza los ítems del carrito con la información vigente del catálogo
  const detalleCarrito = carrito.map(item => {
    const infoProducto = productos.find(p => p.id === item.id);
    return {
      ...infoProducto,
      cantidad: item.cantidad,
      subtotal: infoProducto ? infoProducto.precio * item.cantidad : 0
    };
  });

  // Calcula el monto total sumando los subtotales
  const totalPagar = detalleCarrito.reduce((acumulador, item) => acumulador + item.subtotal, 0);

  // Ejecuta el descuento de stock en App.jsx y activa el mensaje de confirmación
  function confirmarCompra() {
    alFinalizarCompra();
    setCompraExitosa(true);
  }

  if (carrito.length === 0) {
    return (
      <section>
        <h1 className="h2 fw-bold mb-4">Carrito de Compras</h1>

        {/* Si acaba de comprar, muestra la alerta verde de confirmación */}
        {compraExitosa && (
          <Alert variant="success">
            <strong>¡Compra realizada con éxito!</strong> El stock del inventario ha sido actualizado automáticamente.
          </Alert>
        )}

        <Alert variant="info">
          Tu carrito está vacío actualmente.{' '}
          <Alert.Link href="#/productos">Explorar el catálogo de videojuegos</Alert.Link>.
        </Alert>
      </section>
    );
  }

  return (
    <section>
      <h1 className="h2 fw-bold mb-4">Carrito de Compras</h1>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Videojuego</th>
                <th>Precio Unitario</th>
                <th className="text-center">Cantidad</th>
                <th>Subtotal</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalleCarrito.map(item => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td>${item.precio.toLocaleString('es-CL')}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => alCambiarCantidad(item.id, item.cantidad - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-3 fw-bold">{item.cantidad}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={item.cantidad >= item.stock}
                      onClick={() => alCambiarCantidad(item.id, item.cantidad + 1)}
                    >
                      +
                    </Button>
                  </td>
                  <td className="fw-bold text-primary">
                    ${item.subtotal.toLocaleString('es-CL')}
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => alEliminar(item.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Panel inferior con total, vaciado y botón de finalizar compra */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <h2 className="h4 fw-bold mb-3 mb-md-0">
            Total a pagar: <span className="text-primary">${totalPagar.toLocaleString('es-CL')}</span>
          </h2>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={alVaciar}>
              Vaciar carrito
            </Button>
            <Button variant="success" className="fw-semibold" onClick={confirmarCompra}>
              Finalizar compra
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}