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

import { fetchFornecedores, deleteFornecedor } from "@/api/fornecedores";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";
import LoadingSpinner from "sub-components/crud/Spinner";
import { useSession } from "next-auth/react";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [fornecedorId, setFornecedorId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadFornecedores = async () => {
    setLoading(true);
    try {
      const data = await fetchFornecedores(session.user.pk);
      setFornecedores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Só carrega os dados se a sessão estiver autenticada
    if (status === "authenticated") {
      loadFornecedores();
    }
  }, [status]);

  if (status === "loading") {
    // return <p>Carregando sessão...</p>;
    return <LoadingSpinner />;
  }
  const handleDeleteClick = (id) => {
    setFornecedorId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFornecedor(fornecedorId);
      setShowDeleteModal(false);
      loadFornecedores(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
    }
  };

  const handleDetailsClick = (fornecedor) => {
    console.log(fornecedor);
    setSelectedFornecedor(fornecedor);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-dark pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Fornecedores" addLink="/pages/fornecedores/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Fornecedores</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Pessoa</b>
                    </th>
                    <th>
                      <b>Desde</b>
                    </th>
                    <th>
                      <b>Observação</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map((fornecedor) => (
                    <tr key={fornecedor.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(fornecedor)}
                        >
                          {fornecedor.nome}
                        </span>
                      </td>
                      <td>{new Date(fornecedor.desde).toLocaleDateString()}</td>
                      <td>{fornecedor.observacao}</td>
                      <td>
                        <Link
                          href={`/pages/fornecedores/${fornecedor.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(fornecedor.id)}
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
          body="Tem certeza de que deseja excluir este fornecedor?"
        />
        {/* Modal de Detalhes do Fornecedor */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          fornecedor={selectedFornecedor}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, fornecedor }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Fornecedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fornecedor ? (
          <div>
            <p>
              <strong>Pessoa:</strong> {fornecedor.nome}
            </p>
            <p>
              <strong>Desde:</strong>{" "}
              {new Date(fornecedor.desde).toLocaleDateString()}
            </p>
            <p>
              <strong>Observação:</strong> {fornecedor.observacao}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(fornecedor.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(fornecedor.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum fornecedor selecionado.</p>
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

export default Fornecedores;
