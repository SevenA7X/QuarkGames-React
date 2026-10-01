import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ProductoCard from '../components/ProductoCard.jsx';

export default function Productos({ productos, alAgregar }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');

  // Filtra los productos por coincidencia de texto y consola seleccionada
  const visibles = productos.filter(producto => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === '' || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 fw-bold mb-0">Catálogo de Videojuegos</h1>
        <Badge bg="dark" className="fs-6">
          {visibles.length} resultados
        </Badge>
      </div>

      {/* Barra de búsqueda y filtro dentro de una tarjeta limpia */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group controlId="busqueda">
                <Form.Label className="fw-semibold">Buscar por título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Elden Ring, Resident Evil..."
                  value={busqueda}
                  onChange={evento => setBusqueda(evento.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="categoria">
                <Form.Label className="fw-semibold">Filtrar por consola</Form.Label>
                <Form.Select
                  value={categoria}
                  onChange={evento => setCategoria(evento.target.value)}
                >
                  <option value="">Todas las consolas</option>
                  <option value="PS5">PS5</option>
                  <option value="Xbox Series X">Xbox Series X</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Grilla responsiva de Bootstrap: 1 col en móvil, 2 en tablet, 3 en escritorio */}
      <Row className="g-4">
        {visibles.map(producto => (
          <Col key={producto.id} xs={12} md={6} lg={4}>
            <ProductoCard producto={producto} alAgregar={alAgregar} />
          </Col>
        ))}
      </Row>
    </section>
  );
}