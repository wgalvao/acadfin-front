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

import { fetchPlanoContas, deletePlanoConta } from "@/api/planoContas";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const PlanoContas = () => {
  const [planoContas, setPlanoContas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlanoConta, setSelectedPlanoConta] = useState(null);
  const [planoContaId, setPlanoContaId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadPlanoContas = async () => {
    setLoading(true);
    try {
      const data = await fetchPlanoContas(session.user.pk);
      setPlanoContas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanoContas();
  }, []);

  const handleDeleteClick = (id) => {
    setPlanoContaId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePlanoConta(planoContaId);
      setShowDeleteModal(false);
      loadPlanoContas(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar plano de conta:", error);
    }
  };

  const handleDetailsClick = (planoConta) => {
    console.log(planoConta);
    setSelectedPlanoConta(planoConta);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-secondary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header
              title="Plano de Contas"
              addLink="/pages/plano-contas/create"
            />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Plano de Contas</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Código de Contas</b>
                    </th>
                    <th>
                      <b>Nome da Conta</b>
                    </th>
                    <th>
                      <b>Tipo de Conta</b>
                    </th>
                    <th>
                      <b>Nível</b>
                    </th>
                    <th>
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Conta Pai</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {planoContas.map((planoConta) => (
                    <tr key={planoConta.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(planoConta)}
                        >
                          {planoConta.codigo_contas}
                        </span>
                      </td>
                      <td>{planoConta.nome_conta}</td>
                      <td>{planoConta.tipo_conta}</td>
                      <td>{planoConta.nivel}</td>
                      <td>{planoConta.descricao}</td>
                      <td>{planoConta.conta_pai}</td>
                      <td>
                        <Link
                          href={`/pages/plano-contas/${planoConta.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(planoConta.id)}
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
          body="Tem certeza de que deseja excluir este plano de conta?"
        />
        {/* Modal de Detalhes do Plano de Contas */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          planoConta={selectedPlanoConta}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, planoConta }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Plano de Contas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {planoConta ? (
          <div>
            <p>
              <strong>Código de Contas:</strong> {planoConta.codigo_contas}
            </p>
            <p>
              <strong>Nome da Conta:</strong> {planoConta.nome_conta}
            </p>
            <p>
              <strong>Tipo de Conta:</strong> {planoConta.tipo_conta}
            </p>
            <p>
              <strong>Nível:</strong> {planoConta.nivel}
            </p>
            <p>
              <strong>Descrição:</strong> {planoConta.descricao}
            </p>
            <p>
              <strong>Conta Pai:</strong> {planoConta.conta_pai}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(planoConta.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(planoConta.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum plano de conta selecionado.</p>
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

export default PlanoContas;
