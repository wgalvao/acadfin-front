"use client";
import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  Container,
  Col,
  Row,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { Trash, UserPen } from "lucide-react";

import { fetchAcumuladores, deleteAcumulador } from "@/api/acumuladores";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Acumuladores = () => {
  const [acumuladores, setAcumuladores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAcumulador, setSelectedAcumulador] = useState(null);
  const [acumuladorId, setAcumuladorId] = useState(null);

  const { data: session, status } = useSession({ required: true });

  const loadAcumuladores = async () => {
    setLoading(true);
    try {
      const data = await fetchAcumuladores(session.user.pk);
      setAcumuladores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcumuladores();
  }, []);

  const handleDeleteClick = (id) => {
    setAcumuladorId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAcumulador(acumuladorId);
      setShowDeleteModal(false);
      loadAcumuladores(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar acumulador:", error);
    }
  };

  const handleDetailsClick = (acumulador) => {
    console.log(acumulador);
    setSelectedAcumulador(acumulador);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-dark pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Acumuladores" addLink="/pages/acumuladores/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Acumuladores</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Acumulador</b>
                    </th>
                    <th>
                      <b>Tipo</b>
                    </th>
                    <th>
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Valor</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {acumuladores.map((acumulador) => (
                    <tr key={acumulador.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(acumulador)}
                        >
                          {acumulador.acumulador}
                        </span>
                      </td>
                      <td>{acumulador.tipo}</td>
                      <td>{acumulador.descricao}</td>
                      <td>{acumulador.valor}</td>
                      <td>
                        <Link
                          href={`/pages/acumuladores/${acumulador.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(acumulador.id)}
                          className="ms-2"
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
        <ModalDelete
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirmação de Exclusão"
          body="Tem certeza de que deseja excluir este acumulador?"
        />
        {/* Modal de Detalhes do Acumulador */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          acumulador={selectedAcumulador}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, acumulador }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Acumulador</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {acumulador ? (
          <div>
            <p>
              <strong>Acumulador:</strong> {acumulador.acumulador}
            </p>
            <p>
              <strong>Tipo:</strong> {acumulador.tipo}
            </p>
            <p>
              <strong>Descrição:</strong> {acumulador.descricao}
            </p>
            <p>
              <strong>Valor:</strong> {acumulador.valor}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(acumulador.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(acumulador.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum acumulador selecionado.</p>
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

export default Acumuladores;
