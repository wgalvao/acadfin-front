//sindicatos.js
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

import { fetchSindicatos, deleteSindicato } from "@/api/sindicatos";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";
import ModalDetails from "sub-components/crud/ModalDetails";
import LoadingSpinner from "sub-components/crud/Spinner";
import { useSession } from "next-auth/react";

const Sindicatos = () => {
  const [sindicatos, setSindicatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSindicato, setSelectedSindicato] = useState(null);
  const [sindicatoId, setSindicatoId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadSindicatos = async () => {
    setLoading(true);
    try {
      const data = await fetchSindicatos(session.user.pk);
      setSindicatos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só carrega os dados se a sessão estiver autenticada
    if (status === "authenticated") {
      loadSindicatos();
    }
  }, [status]);

  if (status === "loading") {
    // return <p>Carregando sessão...</p>;
    return <LoadingSpinner />;
  }

  const handleDeleteClick = (id) => {
    setSindicatoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSindicato(sindicatoId);
      setShowDeleteModal(false);
      loadSindicatos(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar sindicato:", error);
    }
  };

  const handleDetailsClick = (sindicato) => {
    console.log(sindicato);
    setSelectedSindicato(sindicato);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Sindicatos" addLink="/pages/sindicatos/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de sindicatos</Card.Title>

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
                      <b>Endereço</b>
                    </th>
                    <th>
                      <b>Telefone</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sindicatos.map((sindicato) => (
                    <tr key={sindicato.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(sindicato)}
                        >
                          {sindicato.nome}
                        </span>
                      </td>
                      <td>{sindicato.endereco}</td>
                      <td>{sindicato.telefone}</td>
                      <td>
                        <Link href={`/pages/sindicatos/${sindicato.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(sindicato.id)}
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
          body="Tem certeza de que deseja excluir este sindicato?"
        />
        {/* Modal de Detalhes do Sindicato */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          sindicato={selectedSindicato}
        />
      </Container>
    </Fragment>
  );
};

export default Sindicatos;
