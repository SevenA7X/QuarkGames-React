import { Card, Badge, Button } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP, estadoStock } from '../utils/formatos.js';

export default function ProductoCard({ producto }) {
  const { dispatch } = useTienda();
  const stockInfo = estadoStock(producto.stock);

  function manejarAgregar() {
    dispatch({ type: 'AGREGAR_AL_CARRITO', payload: producto.id });
  }

  // Mantenemos solo el color identificador de la plataforma
  function getPlataformaColor(plataforma) {
    switch (plataforma) {
      case 'PlayStation 5':
        return 'primary'; // Azul
      case 'Xbox Series X|S':
        return 'success'; // Verde
      case 'Nintendo Switch':
        return 'danger'; // Rojo
      case 'PC':
      default:
        return 'dark'; // Negro
    }
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={producto.imagen} 
        alt={producto.nombre} 
        style={{ height: '160px', objectFit: 'cover' }} 
      />
      
      <Card.Body className="d-flex flex-column p-3">
        <div className="mb-2 d-flex gap-1 flex-wrap">
          {/* Etiqueta de plataforma: Usa el color de la marca */}
          <Badge bg={getPlataformaColor(producto.plataforma)} style={{ fontSize: '0.75rem' }}>
            {producto.plataforma}
          </Badge>
          {/* Etiqueta de categoría: Diseño neutral, limpio y secundario */}
          <Badge bg="light" text="dark" className="border border-secondary-subtle" style={{ fontSize: '0.75rem' }}>
            {producto.categoria}
          </Badge>
        </div>
        
        <Card.Title className="fs-6 fw-bold mb-1">{producto.nombre}</Card.Title>
        
        <Card.Text className="fw-bold mb-2 mt-1">
          {precioCLP(producto.precio)}
        </Card.Text>
        
        <div className="mb-3">
          <Badge bg={stockInfo.variante} style={{ fontSize: '0.7rem' }}>{stockInfo.texto}</Badge>
          <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>Stock: {producto.stock}</span>
        </div>
        
        <Button 
          variant={getPlataformaColor(producto.plataforma)} 
          className="mt-auto btn-sm" 
          disabled={producto.stock === 0}
          onClick={manejarAgregar}
        >
          Agregar al carrito
        </Button>
      </Card.Body>
    </Card>
  );
}