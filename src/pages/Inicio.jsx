import { Link } from 'react-router';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP, normalizar } from '../utils/formatos.js';

// Color de la insignia y del botón según la consola, como en el proyecto anterior.
// Si la categoría no se reconoce, se usa un gris neutro.
function colorCategoria(categoria) {
  const texto = normalizar(categoria);
  if (texto.includes('ps') || texto.includes('playstation')) return 'primary';
  if (texto.includes('xbox')) return 'success';
  if (texto.includes('nintendo') || texto.includes('switch')) return 'danger';
  return 'secondary';
}

export default function Inicio() {
  // Los destacados salen del catálogo real: si el administrador cambia productos, la portada se actualiza.
  const { estado } = useTienda();
  const destacados = estado.productos.slice(0, 3);

  return (
    <>
      {/* Banner superior a todo el ancho */}
      <section className="hero-banner">
        <h1>TU PORTAL DE VIDEOJUEGOS DIGITALES</h1>
        <p>"Lo quieres, lo juegas". Acceso instantáneo a los mejores títulos.</p>
      </section>

      {/* Bienvenida centrada */}
      <section className="main-content">
        <h2>Bienvenido a Quark Games</h2>
        <p className="description">
          En Quark Games nos dedicamos a la distribución digital de los mejores videojuegos del
          mercado. Te garantizamos una compra rápida y segura, con entrega instantánea de tus
          códigos directamente en tu pantalla. ¡Sin esperas, solo play!
        </p>
        <p className="text-muted small mt-3 mb-0">
          Horario de atención: Lunes a Viernes de 09:00 a 18:00 hrs.
        </p>
      </section>

      {/* Productos destacados */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="badge bg-danger mb-2">Lo mejor de lo mejor</h2>

          {destacados.length === 0 ? (
            <p className="mb-0">Pronto tendremos juegos destacados para ti.</p>
          ) : (
            <Row className="g-4">
              {destacados.map((p) => {
                const color = colorCategoria(p.categoria);
                return (
                  <Col key={p.id} md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img
                        variant="top"
                        src={p.imagen}
                        alt={p.nombre}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Badge bg={color} className="mb-2 align-self-start">
                          {p.categoria}
                        </Badge>
                        <Card.Title as="h3" className="h5">
                          {p.nombre}
                        </Card.Title>
                        {/* mt-auto empuja precio y botón al fondo para que todas las tarjetas queden alineadas */}
                        <p className="fw-bold fs-5 mt-auto">{precioCLP(p.precio)}</p>
                        {/* Es un enlace de navegación, así que usamos Link con las clases de botón de
                            Bootstrap. Con <Button as={Link}> React Bootstrap le pone role="button" y deja
                            de ser un enlace para los lectores de pantalla y para las pruebas. */}
                        <Link
                          to="/productos"
                          className={`btn btn-${color}`}
                          aria-label={`Ver ${p.nombre}`}
                        >
                          Ver Juego
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}
