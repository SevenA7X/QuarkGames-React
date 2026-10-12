import { useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import ProductoCard from '../components/ProductoCard.jsx';
import { normalizar } from '../utils/formatos.js';

export default function Productos() {
  // 1. Extraemos SOLO el estado de los productos de nuestro Contexto Global
  const { estado } = useTienda();
  const { productos } = estado;

  // 2. Estados locales para los filtros del catálogo
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [soloConStock, setSoloConStock] = useState(false);

  // 3. Obtenemos las categorías únicas dinámicamente para el selector 
  // (Usamos Set para evitar categorías repetidas en la lista desplegable)
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))];

  // 4. Lógica de Filtrado (Se ejecuta automáticamente cada vez que un estado cambia)
  const visibles = productos.filter((p) => {
    // Si el usuario escribió algo, verificamos si el nombre del producto incluye la búsqueda
    // normalizar() remueve tildes y mayúsculas de ambos lados para que coincidan.
    const cumpleBusqueda = busqueda
      ? normalizar(p.nombre).includes(normalizar(busqueda))
      : true;
      
    // Si el usuario seleccionó una categoría, verificamos que coincida
    const cumpleCategoria = categoria ? p.categoria === categoria : true;
    
    // Si el usuario definió un precio máximo, descartamos los más caros
    const cumplePrecio = precioMax ? p.precio <= Number(precioMax) : true;
    
    // Si el usuario marcó el check, descartamos los que tienen stock en 0
    const cumpleStock = soloConStock ? p.stock > 0 : true;

    // Solo mostramos el producto si pasa todos los filtros
    return cumpleBusqueda && cumpleCategoria && cumplePrecio && cumpleStock;
  });

  return (
    <Container className="py-4">
      <h1 className="mb-4">Catálogo de Productos</h1>
      
      {/* Panel de Filtros usando grilla (Row y Col) para que sea responsivo */}
      <Row className="mb-4 g-3 align-items-end">
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label>Buscar por nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Resident Evil"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Form.Group>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas</option>
              {categoriasUnicas.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <Form.Group>
            <Form.Label>Precio máximo</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Sin límite"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col xs={12} md={2}>
          <Form.Check
            type="switch"
            id="switch-stock"
            label="Solo con stock"
            checked={soloConStock}
            onChange={(e) => setSoloConStock(e.target.checked)}
          />
        </Col>
      </Row>

      {/* Grilla de resultados (Responsive: 1 columna en móvil, 2 en tablet, 3 o 4 en PC) */}
      {visibles.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay productos que coincidan con los filtros.
        </div>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {visibles.map((p) => (
            <Col key={p.id}>
              {/* Notar que aquí ya no le pasamos 'alAgregar' como prop a ProductoCard */}
              <ProductoCard producto={p} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}