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

import { fetchCargos, deleteCargo } from "@/api/cargos";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

import { useSession } from "next-auth/react";
import LoadingSpinner from "sub-components/crud/Spinner";

const Cargos = () => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [cargoId, setCargoId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadCargos = async () => {
    setLoading(true);
    try {
      const data = await fetchCargos(session.user.pk);
      setCargos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só carrega os dados se a sessão estiver autenticada
    if (status === "authenticated") {
      loadCargos();
    }
  }, [status]);

  if (status === "loading") {
    // return <p>Carregando sessão...</p>;
    return <LoadingSpinner />;
  }

  const handleDeleteClick = (id) => {
    setCargoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCargo(cargoId);
      setShowDeleteModal(false);
      loadCargos(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar cargo:", error);
    }
  };

  const handleDetailsClick = (cargo) => {
    console.log(cargo);
    setSelectedCargo(cargo);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Cargos" addLink="/pages/cargos/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Cargos</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Cargo</b>
                    </th>
                    <th>
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Nível</b>
                    </th>
                    <th>
                      <b>Salário</b>
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
                  {cargos.map((cargo) => (
                    <tr key={cargo.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(cargo)}
                        >
                          {cargo.cargo}
                        </span>
                      </td>
                      <td>{cargo.descricao}</td>
                      <td>{cargo.nivel}</td>
                      <td>{cargo.salario}</td>
                      <td>{cargo.ativo ? "Sim" : "Não"}</td>
                      <td>
                        <Link href={`/pages/cargos/${cargo.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(cargo.id)}
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
          body="Tem certeza de que deseja excluir este cargo?"
        />
        {/* Modal de Detalhes do Cargo */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cargo={selectedCargo}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, cargo }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Cargo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargo ? (
          <div>
            <p>
              <strong>Cargo:</strong> {cargo.cargo}
            </p>
            <p>
              <strong>Descrição:</strong> {cargo.descricao}
            </p>
            <p>
              <strong>Nível:</strong> {cargo.nivel}
            </p>
            <p>
              <strong>Salário:</strong> {cargo.salario}
            </p>
            <p>
              <strong>Ativo:</strong> {cargo.ativo ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(cargo.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(cargo.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum cargo selecionado.</p>
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

export default Cargos;
