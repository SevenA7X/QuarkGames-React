import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export default function ProductoCard({ producto, alAgregar }) {
  // Asigna un color de etiqueta distinto según la consola del videojuego
  let colorConsola = 'secondary';
  if (producto.categoria === 'PS5') {
    colorConsola = 'primary';
  } else if (producto.categoria === 'Xbox Series X') {
    colorConsola = 'success';
  } else if (producto.categoria === 'Nintendo Switch') {
    colorConsola = 'danger';
  }

  return (
    // Tarjeta sin borde duro, con sombra suave y animación al pasar el cursor
    <Card className="h-100 border-0 shadow-sm card-hover">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        style={{ height: '180px', objectFit: 'cover' }}
      />

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg={colorConsola}>{producto.categoria}</Badge>
          <small className="text-muted">Stock: {producto.stock}</small>
        </div>

        <Card.Title className="fw-bold">{producto.nombre}</Card.Title>

        <Card.Text className="fw-bold fs-4 text-primary mt-auto mb-3">
          ${producto.precio.toLocaleString('es-CL')}
        </Card.Text>

        <Button
          variant={producto.stock > 0 ? 'primary' : 'secondary'}
          disabled={producto.stock <= 0}
          onClick={() => alAgregar(producto.id)}
          className="w-100 fw-semibold"
        >
          {producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
        </Button>
      </Card.Body>
    </Card>
  );
}