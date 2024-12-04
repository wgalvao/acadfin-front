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

import { fetchContas, deleteConta } from "@/api/contas";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Contas = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConta, setSelectedConta] = useState(null);
  const [contaId, setContaId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadContas = async () => {
    setLoading(true);
    try {
      const data = await fetchContas(session.user.pk);
      setContas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContas();
  }, []);

  const handleDeleteClick = (id) => {
    setContaId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteConta(contaId);
      setShowDeleteModal(false);
      loadContas(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  const handleDetailsClick = (conta) => {
    console.log(conta);
    setSelectedConta(conta);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-dark pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Contas" addLink="/pages/contas/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Contas</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Conta</b>
                    </th>
                    <th>
                      <b>Tipo de Conta</b>
                    </th>
                    <th>
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Saldo</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((conta) => (
                    <tr key={conta.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(conta)}
                        >
                          {conta.conta}
                        </span>
                      </td>
                      <td>{conta.tipo_conta}</td>
                      <td>{conta.descricao}</td>
                      <td>{conta.saldo}</td>
                      <td>
                        <Link href={`/pages/contas/${conta.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(conta.id)}
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
          body="Tem certeza de que deseja excluir esta conta?"
        />
        {/* Modal de Detalhes da Conta */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          conta={selectedConta}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, conta }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Conta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {conta ? (
          <div>
            <p>
              <strong>Conta:</strong> {conta.conta}
            </p>
            <p>
              <strong>Tipo de Conta:</strong> {conta.tipo_conta}
            </p>
            <p>
              <strong>Descrição:</strong> {conta.descricao}
            </p>
            <p>
              <strong>Saldo:</strong> {conta.saldo}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(conta.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(conta.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhuma conta selecionada.</p>
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

export default Contas;
