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
  const [plataforma, setPlataforma] = useState(''); // <-- NUEVO ESTADO
  const [precioMax, setPrecioMax] = useState('');
  const [soloConStock, setSoloConStock] = useState(false);

  // 3. Obtenemos las categorías y plataformas únicas dinámicamente para los selectores 
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))];
  const plataformasUnicas = [...new Set(productos.map((p) => p.plataforma))]; // <-- NUEVO ARREGLO

  // 4. Lógica de Filtrado
  const visibles = productos.filter((p) => {
    const cumpleBusqueda = busqueda
      ? normalizar(p.nombre).includes(normalizar(busqueda))
      : true;
      
    const cumpleCategoria = categoria ? p.categoria === categoria : true;
    
    // <-- NUEVO FILTRO DE PLATAFORMA
    const cumplePlataforma = plataforma ? p.plataforma === plataforma : true; 
    
    const cumplePrecio = precioMax ? p.precio <= Number(precioMax) : true;
    const cumpleStock = soloConStock ? p.stock > 0 : true;

    // Solo mostramos el producto si pasa todos los filtros
    return cumpleBusqueda && cumpleCategoria && cumplePlataforma && cumplePrecio && cumpleStock;
  });

  return (
    <Container className="py-4">
      <h1 className="mb-4">Catálogo de Productos</h1>
      
      {/* Panel de Filtros */}
      <Row className="mb-4 g-3 align-items-end">
        <Col xs={12} md={3}>
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
        
        <Col xs={12} sm={4} md={2}>
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

        {/* <-- NUEVO SELECTOR DE PLATAFORMA */}
        <Col xs={12} sm={4} md={2}>
          <Form.Group>
            <Form.Label>Plataforma</Form.Label>
            <Form.Select value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
              <option value="">Todas</option>
              {plataformasUnicas.map((plat) => (
                <option key={plat} value={plat}>{plat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col xs={12} sm={4} md={3}>
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

      {/* Grilla de resultados */}
      {visibles.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay productos que coincidan con los filtros.
        </div>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {visibles.map((p) => (
            <Col key={p.id}>
              <ProductoCard producto={p} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}