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

import { fetchAliquotas, deleteAliquota } from "@/api/aliquotas";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Aliquotas = () => {
  const [aliquotas, setAliquotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAliquota, setSelectedAliquota] = useState(null);
  const [aliquotaId, setAliquotaId] = useState(null);

  const loadAliquotas = async () => {
    setLoading(true);
    try {
      const data = await fetchAliquotas();
      setAliquotas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAliquotas();
  }, []);

  const handleDeleteClick = (id) => {
    setAliquotaId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAliquota(aliquotaId);
      setShowDeleteModal(false);
      loadAliquotas(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar alíquota:", error);
    }
  };

  const handleDetailsClick = (aliquota) => {
    console.log(aliquota);
    setSelectedAliquota(aliquota);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Alíquotas" addLink="/pages/aliquotas/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Alíquotas</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Tipo de Imposto</b>
                    </th>
                    <th>
                      <b>Percentual</b>
                    </th>
                    <th>
                      <b>Estado</b>
                    </th>
                    <th>
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Data de Início</b>
                    </th>
                    <th>
                      <b>Data de Fim</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aliquotas.map((aliquota) => (
                    <tr key={aliquota.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(aliquota)}
                        >
                          {aliquota.tipo_imposto}
                        </span>
                      </td>
                      <td>{aliquota.percentual}</td>
                      <td>{aliquota.estado}</td>
                      <td>{aliquota.descricao}</td>
                      <td>
                        {new Date(aliquota.data_inicio).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(aliquota.data_fim).toLocaleDateString()}
                      </td>
                      <td>
                        <Link href={`/pages/aliquotas/${aliquota.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(aliquota.id)}
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
          body="Tem certeza de que deseja excluir esta alíquota?"
        />
        {/* Modal de Detalhes da Alíquota */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          aliquota={selectedAliquota}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, aliquota }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Alíquota</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {aliquota ? (
          <div>
            <p>
              <strong>Tipo de Imposto:</strong> {aliquota.tipo_imposto}
            </p>
            <p>
              <strong>Percentual:</strong> {aliquota.percentual}
            </p>
            <p>
              <strong>Estado:</strong> {aliquota.estado}
            </p>
            <p>
              <strong>Descrição:</strong> {aliquota.descricao}
            </p>
            <p>
              <strong>Data de Início:</strong>{" "}
              {new Date(aliquota.data_inicio).toLocaleDateString()}
            </p>
            <p>
              <strong>Data de Fim:</strong>{" "}
              {new Date(aliquota.data_fim).toLocaleDateString()}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(aliquota.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(aliquota.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhuma alíquota selecionada.</p>
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

export default Aliquotas;
