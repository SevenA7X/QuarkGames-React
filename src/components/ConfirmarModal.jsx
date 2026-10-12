
import { Modal, Button } from 'react-bootstrap';

// Este componente es reutilizable ("Tonto" o "Dumb Component"). 
// No toma decisiones por sí mismo, solo recibe a través de props:
// - show (booleano para mostrar/ocultar)
// - onHide (función para cerrar el modal)
// - titulo y mensaje (textos dinámicos)
// - onConfirmar (función que se ejecuta si el usuario dice "Sí")
export default function ConfirmarModal({ show, onHide, titulo, mensaje, onConfirmar }) {
  return (
    // 'centered' centra el modal verticalmente en la pantalla
    <Modal show={show} onHide={onHide} centered>
      {/* closeButton agrega automáticamente la 'X' en la esquina para cerrar */}
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>{mensaje}</p>
      </Modal.Body>
      
      <Modal.Footer>
        {/* Botón secundario para cancelar y cerrar el modal */}
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        {/* Botón de peligro (rojo) para confirmar la acción destructiva */}
        <Button variant="danger" onClick={onConfirmar}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}