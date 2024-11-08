import { Modal as BSModal, Button } from "react-bootstrap";

const ModalDelete = ({ show, onHide, onConfirm, title, body }) => (
  <BSModal show={show} onHide={onHide}>
    <BSModal.Header closeButton>
      <BSModal.Title>{title}</BSModal.Title>
    </BSModal.Header>
    <BSModal.Body>{body}</BSModal.Body>
    <BSModal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Confirmar
      </Button>
    </BSModal.Footer>
  </BSModal>
);

export default ModalDelete;
