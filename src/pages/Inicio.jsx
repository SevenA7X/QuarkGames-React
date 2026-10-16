import { Link } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext.jsx';
import ProductoCard from '../components/ProductoCard.jsx';

export default function Inicio() {
  const { estado } = useTienda();
  
  // Array con las plataformas que queremos destacar
  const plataformas = ['PC', 'PlayStation 5', 'Xbox Series X|S', 'Nintendo Switch'];
  
  // Buscamos dinámicamente el primer juego que coincida con cada plataforma
  // filter(Boolean) elimina valores nulos o indefinidos si una plataforma se queda sin juegos
  const destacados = plataformas
    .map(plataforma => estado.productos.find(p => p.plataforma === plataforma))
    .filter(Boolean); 

  return (
    <>
      <section className="hero-banner">
        <h1>TU PORTAL DE VIDEOJUEGOS DIGITALES</h1>
        <p>"Lo quieres, lo juegas". Acceso instantáneo a los mejores títulos.</p>
      </section>

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

      <section className="bg-light py-5">
        <Container>
          {/* Etiqueta reducida a tamaño normal con un poco de padding (px-3 py-2) */}
          {/* Reemplace el <span> actual por este <h2> */}
<h2 className="badge bg-danger mb-4 px-3 py-2 fs-6">
  Lo mejor de lo mejor
</h2>

          {destacados.length === 0 ? (
            <p className="mb-0">Pronto tendremos juegos destacados para ti.</p>
          ) : (
            <Row className="g-3">
              {destacados.map((p) => (
                // lg={3} divide la fila de 12 en 4 columnas (12/3 = 4 tarjetas)
                <Col key={p.id} sm={6} md={4} lg={3}>
                  <ProductoCard producto={p} />
                </Col>
              ))}
            </Row>
          )}
          
          <div className="text-center mt-5">
            <Link to="/productos" className="btn btn-outline-primary btn-lg">
              Ver todo el catálogo
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}