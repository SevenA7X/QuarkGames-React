import { Card, Badge, Button } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP, estadoStock } from '../utils/formatos.js';

export default function ProductoCard({ producto }) {
  const { dispatch } = useTienda();
  const stockInfo = estadoStock(producto.stock);

  function manejarAgregar() {
    dispatch({ type: 'AGREGAR_AL_CARRITO', payload: producto.id });
  }

  function getPlataformaColor(plataforma) {
    switch (plataforma) {
      case 'PlayStation 5':
        return 'primary'; 
      case 'Xbox Series X|S':
        return 'success'; 
      case 'Nintendo Switch':
        return 'danger'; 
      case 'PC':
      default:
        return 'dark'; 
    }
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={producto.imagen} 
        alt={producto.titulo} 
        style={{ height: '160px', objectFit: 'cover' }} 
      />
      
      <Card.Body className="d-flex flex-column p-3">
        {/* Bloque superior: Etiquetas y Título */}
        <div className="mb-2 d-flex gap-1 flex-wrap">
          <Badge bg={getPlataformaColor(producto.plataforma)}>
            {producto.plataforma}
          </Badge>
          <Badge bg="light" text="dark" className="border border-secondary-subtle" style={{ fontSize: '0.75rem' }}>
            {producto.categoria?.nombre ?? producto.categoriaId ?? 'General'}
          </Badge>
        </div>
        
        <Card.Title className="fs-6 fw-bold mb-1">{producto.titulo}</Card.Title>
        
        {/* Bloque inferior: Empujado hacia abajo automáticamente con mt-auto */}
        <div className="mt-auto">
          <Card.Text className="fw-bold mb-2 mt-2">
            {precioCLP(producto.precio)}
          </Card.Text>
          
          <div className="mb-3">
            <Badge bg={stockInfo.variante} style={{ fontSize: '0.7rem' }}>{stockInfo.texto}</Badge>
            <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>Stock: {producto.stock}</span>
          </div>
          
          <Button className="w-100 btn-corporativo" onClick={manejarAgregar}>
            Agregar al carrito
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}