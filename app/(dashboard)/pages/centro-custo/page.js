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

import { fetchCentroCustos, deleteCentroCusto } from "@/api/centroCustos";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const CentroCusto = () => {
  const [centroCustos, setCentroCustos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCentroCusto, setSelectedCentroCusto] = useState(null);
  const [centroCustoId, setCentroCustoId] = useState(null);

  const loadCentroCustos = async () => {
    setLoading(true);
    try {
      const data = await fetchCentroCustos();
      setCentroCustos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCentroCustos();
  }, []);

  const handleDeleteClick = (id) => {
    setCentroCustoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCentroCusto(centroCustoId);
      setShowDeleteModal(false);
      loadCentroCustos(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar centro de custo:", error);
    }
  };

  const handleDetailsClick = (centroCusto) => {
    console.log(centroCusto);
    setSelectedCentroCusto(centroCusto);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header
              title="Centro de Custos"
              addLink="/pages/centro-custo/create"
            />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de centros de custo</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Nome</b>
                    </th>
                    <th>
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Código</b>
                    </th>
                    <th>
                      <b>Ativo</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {centroCustos.map((centroCusto) => (
                    <tr key={centroCusto.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(centroCusto)}
                        >
                          {centroCusto.nome}
                        </span>
                      </td>
                      <td>{centroCusto.descricao}</td>
                      <td>{centroCusto.codigo}</td>
                      <td>{centroCusto.ativo ? "Sim" : "Não"}</td>
                      <td>
                        <Link
                          href={`/pages/centro-custo/${centroCusto.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(centroCusto.id)}
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
          body="Tem certeza de que deseja excluir este centro de custo?"
        />
        {/* Modal de Detalhes do Centro de Custo */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          centroCusto={selectedCentroCusto}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, centroCusto }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Centro de Custo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {centroCusto ? (
          <div>
            <p>
              <strong>Nome:</strong> {centroCusto.nome}
            </p>
            <p>
              <strong>Descrição:</strong> {centroCusto.descricao}
            </p>
            <p>
              <strong>Código:</strong> {centroCusto.codigo}
            </p>
            <p>
              <strong>Ativo:</strong> {centroCusto.ativo ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(centroCusto.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(centroCusto.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum centro de custo selecionado.</p>
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

export default CentroCusto;
