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

import { fetchClientes, deleteCliente } from "@/api/clientes";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  const { data: session, status } = useSession({ required: true });

  const LoadingSpinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Loader2 size={48} className="spinner" />
    </div>
  );

  useEffect(() => {
    // Só carrega os dados se a sessão estiver autenticada
    if (status === "authenticated") {
      loadClientes();
    }
  }, [status]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      if (!session?.user?.pk) {
        setError("Sessão inválida ou expirada.");
        return;
      }
      const data = await fetchClientes(session.user.pk);
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    // return <p>Carregando sessão...</p>;
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return <p>Usuário não autenticado. Faça login para continuar.</p>;
  }

  const handleDeleteClick = (id) => {
    setClienteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCliente(clienteId);
      setShowDeleteModal(false);
      loadClientes(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  const handleDetailsClick = (cliente) => {
    console.log(cliente);
    setSelectedCliente(cliente);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-dark pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Clientes" addLink="/pages/clientes/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Clientes</Card.Title>

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
                      <b>Desde</b>
                    </th>
                    <th>
                      <b>Taxa de Desconto</b>
                    </th>
                    <th>
                      <b>Limite de Crédito</b>
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
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(cliente)}
                        >
                          {cliente.nome}
                        </span>
                      </td>
                      <td>{new Date(cliente.desde).toLocaleDateString()}</td>
                      <td>{cliente.taxa_desconto}</td>
                      <td>{cliente.limite_credito}</td>
                      <td>{cliente.observacao}</td>
                      <td>
                        <Link href={`/pages/clientes/${cliente.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(cliente.id)}
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
          body="Tem certeza de que deseja excluir este cliente?"
        />
        {/* Modal de Detalhes do Cliente */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cliente={selectedCliente}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, cliente }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cliente ? (
          <div>
            <p>
              <strong>Nome:</strong> {cliente.nome}
            </p>
            <p>
              <strong>Desde:</strong>{" "}
              {new Date(cliente.desde).toLocaleDateString()}
            </p>
            <p>
              <strong>Taxa de Desconto:</strong> {cliente.taxa_desconto}
            </p>
            <p>
              <strong>Limite de Crédito:</strong> {cliente.limite_credito}
            </p>
            <p>
              <strong>Observação:</strong> {cliente.observacao}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(cliente.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(cliente.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum cliente selecionado.</p>
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

export default Clientes;
