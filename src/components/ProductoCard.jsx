import { Card, Badge, Button } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP, estadoStock } from '../utils/formatos.js';

// Ahora la tarjeta solo necesita recibir los datos del 'producto'
export default function ProductoCard({ producto }) {
  // Nos conectamos al contexto global. Solo extraemos 'dispatch'
  // porque esta tarjeta no necesita leer la lista completa de productos,
  // solo necesita la capacidad de "disparar" acciones.
  const { dispatch } = useTienda();
  
  // Usamos nuestra función utilitaria para saber qué color (variante) y texto mostrar
  const stockInfo = estadoStock(producto.stock);

  function manejarAgregar() {
    // Al hacer clic, enviamos un "mensaje" al Reducer: 
    // "Quiero hacer la acción AGREGAR_AL_CARRITO y te paso este ID como carga útil (payload)"
    dispatch({ type: 'AGREGAR_AL_CARRITO', payload: producto.id });
  }

  return (
    // h-100 hace que todas las tarjetas midan lo mismo. shadow-sm añade una sombra suave.
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={producto.imagen} 
        alt={producto.nombre} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      
      {/* d-flex flex-column permite que el botón se empuje siempre hacia abajo */}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text className="text-muted mb-2">{producto.categoria}</Card.Text>
        
        {/* fs-5 (font-size) y fw-bold (font-weight bold) para destacar el precio */}
        <Card.Text className="fs-5 fw-bold mb-2">
          {precioCLP(producto.precio)}
        </Card.Text>
        
        <div className="mb-3">
          {/* Badge de React Bootstrap cambia de color dinámicamente gracias a estadoStock() */}
          <Badge bg={stockInfo.variante}>{stockInfo.texto}</Badge>
        </div>
        
        {/* mt-auto empuja este botón hasta el fondo de la tarjeta para que queden alineados */}
        <Button 
          variant="primary" 
          className="mt-auto" 
          disabled={producto.stock === 0}
          onClick={manejarAgregar}
        >
          Agregar al carrito
        </Button>
      </Card.Body>
    </Card>
  );
}