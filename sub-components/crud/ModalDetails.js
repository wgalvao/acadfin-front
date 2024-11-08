import { Modal, Button } from "react-bootstrap";

const ModalDetails = ({ show, onHide, sindicato }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {/* <Modal.Title>Detalhes do: {sindicato.nome}</Modal.Title> */}
        <Modal.Title>Detalhes do Sindicato</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sindicato ? (
          <div>
            <p>
              <strong>Nome:</strong> {sindicato.nome}
            </p>
            <p>
              <strong>Endereço:</strong> {sindicato.endereco}
            </p>
            <p>
              <strong>Telefone:</strong> {sindicato.telefone}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(sindicato.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(sindicato.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum sindicato selecionado.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetails;
