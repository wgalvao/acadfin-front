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

import { fetchServicos, deleteServico } from "@/api/servicos";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedServico, setSelectedServico] = useState(null);
  const [servicoId, setServicoId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadServicos = async () => {
    setLoading(true);
    try {
      const data = await fetchServicos(session.user.pk);
      setServicos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicos();
  }, []);

  const handleDeleteClick = (id) => {
    setServicoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteServico(servicoId);
      setShowDeleteModal(false);
      loadServicos(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
    }
  };

  const handleDetailsClick = (servico) => {
    console.log(servico);
    setSelectedServico(servico);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Serviços" addLink="/pages/servicos/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de serviços</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Código</b>
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
                  {servicos.map((servico) => (
                    <tr key={servico.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(servico)}
                        >
                          {servico.codigo}
                        </span>
                      </td>
                      <td>{servico.descricao}</td>
                      <td>R$ {servico.valor}</td>
                      <td>
                        <Link href={`/pages/servicos/${servico.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(servico.id)}
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
          body="Tem certeza de que deseja excluir este serviço?"
        />
        {/* Modal de Detalhes do Serviço */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Serviço</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedServico ? (
              <div>
                <p>
                  <strong>Código:</strong> {selectedServico.codigo}
                </p>
                <p>
                  <strong>Descrição:</strong> {selectedServico.descricao}
                </p>
                <p>
                  <strong>Valor R$:</strong> {selectedServico.valor}
                </p>
                <p>
                  <strong>Criado em:</strong>{" "}
                  {new Date(selectedServico.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Atualizado em:</strong>{" "}
                  {new Date(selectedServico.updated_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>Nenhum servico selecionado.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDetailsModal(false)}
            >
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default Servicos;
