import { useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import ProductoCard from '../components/ProductoCard.jsx';
import { normalizar } from '../utils/formatos.js';

export default function Productos() {
  const { estado } = useTienda();
  const { productos } = estado;

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [soloConStock, setSoloConStock] = useState(false);

  // CORRECCIÓN 1: Extraemos estrictamente el 'nombre' de la categoría (texto) y filtramos nulos
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria?.nombre ?? 'General').filter(Boolean))];
  
  // Extraemos plataformas únicas evitando nulos
  const plataformasUnicas = [...new Set(productos.map((p) => p.plataforma).filter(Boolean))]; 

  const visibles = productos.filter((p) => {
    // CORRECCIÓN 2: El atributo del DTO es 'titulo', no 'nombre'
    const cumpleBusqueda = busqueda
      ? normalizar(p.titulo || '').includes(normalizar(busqueda))
      : true;
      
    // CORRECCIÓN 3: Comparamos contra el nombre de la categoría extraído de forma segura
    const nombreCat = p.categoria?.nombre ?? 'General';
    const cumpleCategoria = categoria ? nombreCat === categoria : true;
    
    const cumplePlataforma = plataforma ? p.plataforma === plataforma : true; 
    
    const cumplePrecio = precioMax ? p.precio <= Number(precioMax) : true;
    const cumpleStock = soloConStock ? p.stock > 0 : true;

    return cumpleBusqueda && cumpleCategoria && cumplePlataforma && cumplePrecio && cumpleStock;
  });

  return (
    <Container className="py-4">
      <h1 className="mb-4">Catálogo de Productos</h1>
      
      <Row className="mb-4 g-3 align-items-end">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Buscar por título</Form.Label>
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
              {/* Ahora 'cat' es un texto puro y React no arrojará error */}
              {categoriasUnicas.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

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