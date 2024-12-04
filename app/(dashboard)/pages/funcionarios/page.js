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

import { fetchFuncionarios, deleteFuncionario } from "@/api/funcionarios";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [funcionarioId, setFuncionarioId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadFuncionarios = async () => {
    setLoading(true);
    try {
      const data = await fetchFuncionarios(session.user.pk);
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
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFuncionario(funcionarioId);
      setShowDeleteModal(false);
      loadFuncionarios(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  const handleDetailsClick = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Funcionários" addLink="/pages/funcionarios/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Funcionários</Card.Title>

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
                      <b>Email</b>
                    </th>
                    <th>
                      <b>Telefone</b>
                    </th>
                    <th>
                      <b>Cidade</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(funcionario)}
                        >
                          {funcionario.nome}
                        </span>
                      </td>
                      <td>{funcionario.cpf}</td>
                      <td>{funcionario.email}</td>
                      <td>{funcionario.telefone}</td>
                      <td>{funcionario.cidade}</td>
                      <td>
                        <Link
                          href={`/pages/funcionarios/${funcionario.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
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
        <ModalDelete
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirmação de Exclusão"
          body="Tem certeza de que deseja excluir este funcionário?"
        />
        {/* Modal de Detalhes do Funcionário */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          funcionario={selectedFuncionario}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, funcionario }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Funcionário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {funcionario ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <p>
                <strong>Nome:</strong> {funcionario.nome}
              </p>
              <p>
                <strong>CPF:</strong> {funcionario.cpf}
              </p>
              <p>
                <strong>Email:</strong> {funcionario.email}
              </p>
              <p>
                <strong>Telefone:</strong> {funcionario.telefone}
              </p>
              <p>
                <strong>Celular:</strong> {funcionario.celular}
              </p>
              <p>
                <strong>Estado:</strong> {funcionario.estado}
              </p>
              <p>
                <strong>Cidade:</strong> {funcionario.cidade}
              </p>
              <p>
                <strong>Endereço:</strong> {funcionario.endereco},{" "}
                {funcionario.bairro}
              </p>
              <p>
                <strong>CEP:</strong> {funcionario.cep}
              </p>
              <p>
                <strong>Estado Civil:</strong> {funcionario.estado_civil}
              </p>
            </div>
            <div>
              <p>
                <strong>Data de Nascimento:</strong>{" "}
                {new Date(funcionario.data_nasc).toLocaleDateString()}
              </p>
              <p>
                <strong>Idade:</strong> {funcionario.idade} anos
              </p>
              <p>
                <strong>Sexo:</strong> {funcionario.sexo}
              </p>
              <p>
                <strong>Escolaridade:</strong> {funcionario.escolaridade}
              </p>
              <p>
                <strong>Naturalidade:</strong> {funcionario.naturalidade}
              </p>
              <p>
                <strong>PIS:</strong> {funcionario.pis}
              </p>
              <p>
                <strong>Identidade:</strong> {funcionario.identidade}
              </p>
              <p>
                <strong>CTPS/Série:</strong> {funcionario.ctps} /{" "}
                {funcionario.serie}
              </p>
              <p>
                <strong>Criado em:</strong>{" "}
                {new Date(funcionario.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Atualizado em:</strong>{" "}
                {new Date(funcionario.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p>Nenhum funcionário selecionado.</p>
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

export default Funcionarios;
