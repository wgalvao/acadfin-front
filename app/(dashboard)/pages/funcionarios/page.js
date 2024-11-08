// funcionarios.js
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
import { Trash } from "lucide-react";

import { fetchFuncionarios, deleteFuncionario } from "@/api/funcionarios";

const Home = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [funcionarioId, setFuncionarioId] = useState(null);

  const loadFuncionarios = async () => {
    setLoading(true);
    try {
      const data = await fetchFuncionarios();
      setFuncionarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const handleDeleteClick = (id) => {
    setFuncionarioId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFuncionario(funcionarioId);
      setShowModal(false);
      loadFuncionarios(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0 text-white">Funcionários</h3>
              </div>
              <div>
                <Link
                  href="/pages/funcionarios/create"
                  className="btn btn-white"
                >
                  Adicionar novo funcionario
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de funcionários</Card.Title>

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
                      <b>CPF</b>
                    </th>
                    <th>
                      <b>Celular</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <td>{funcionario.nome}</td>
                      <td>{funcionario.cpf}</td>
                      <td>{funcionario.celular}</td>
                      <td>
                        <Link
                          href={`/pages/funcionarios/${funcionario.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            Alterar
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(funcionario.id)}
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

        {/* Modal de Confirmação */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação de Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja excluir este funcionário?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default Home;
