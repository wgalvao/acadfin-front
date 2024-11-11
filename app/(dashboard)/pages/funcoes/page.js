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

import { fetchFuncoes, deleteFuncao } from "@/api/funcoes";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Funcoes = () => {
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFuncao, setSelectedFuncao] = useState(null);
  const [funcaoId, setFuncaoId] = useState(null);

  const loadFuncoes = async () => {
    setLoading(true);
    try {
      const data = await fetchFuncoes();
      setFuncoes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuncoes();
  }, []);

  const handleDeleteClick = (id) => {
    setFuncaoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFuncao(funcaoId);
      setShowDeleteModal(false);
      loadFuncoes(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar função:", error);
    }
  };

  const handleDetailsClick = (funcao) => {
    console.log(funcao);
    setSelectedFuncao(funcao);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Funções" addLink="/pages/funcoes/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Funções</Card.Title>

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
                      <b>Empresa</b>
                    </th>
                    <th>
                      <b>CODVA</b>
                    </th>
                    <th>
                      <b>CODVP</b>
                    </th>
                    <th>
                      <b>CODVT</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {funcoes.map((funcao) => (
                    <tr key={funcao.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(funcao)}
                        >
                          {funcao.nome}
                        </span>
                      </td>
                      {console.log(funcao)}
                      <td>{funcao.empresa_nome}</td>
                      <td>{funcao.codva}</td>
                      <td>{funcao.codvp}</td>
                      <td>{funcao.codvt}</td>
                      <td>
                        <Link href={`/pages/funcoes/${funcao.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(funcao.id)}
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
          body="Tem certeza de que deseja excluir esta função?"
        />
        {/* Modal de Detalhes da Função */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          funcao={selectedFuncao}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, funcao }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Função</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {funcao ? (
          <div>
            <p>
              <strong>Nome:</strong> {funcao.nome}
            </p>
            <p>
              <strong>Empresa:</strong> {funcao.empresa_nome}
            </p>
            <p>
              <strong>CODVA:</strong> {funcao.codva}
            </p>
            <p>
              <strong>CODVP:</strong> {funcao.codvp}
            </p>
            <p>
              <strong>CODVT:</strong> {funcao.codvt}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(funcao.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(funcao.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhuma função selecionada.</p>
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

export default Funcoes;
