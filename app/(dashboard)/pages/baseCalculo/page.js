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

import { fetchBaseCalculos, deleteBaseCalculo } from "@/api/baseCalculo";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";
import { useSession } from "next-auth/react";

import LoadingSpinner from "sub-components/crud/Spinner";

const BaseCalculo = () => {
  const [baseCalculos, setBaseCalculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBaseCalculo, setSelectedBaseCalculo] = useState(null);
  const [baseCalculoId, setBaseCalculoId] = useState(null);
  const { data: session, status } = useSession({ required: true });

  const loadBaseCalculos = async () => {
    setLoading(true);
    try {
      const data = await fetchBaseCalculos(session.user.pk);
      setBaseCalculos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só carrega os dados se a sessão estiver autenticada
    if (status === "authenticated") {
      loadBaseCalculos();
    }
  }, [status]);

  if (status === "loading") {
    // return <p>Carregando sessão...</p>;
    return <LoadingSpinner />;
  }
  const handleDeleteClick = (id) => {
    setBaseCalculoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBaseCalculo(baseCalculoId);
      setShowDeleteModal(false);
      loadBaseCalculos(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar base de cálculo:", error);
    }
  };

  const handleDetailsClick = (baseCalculo) => {
    console.log(baseCalculo);
    setSelectedBaseCalculo(baseCalculo);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header
              title="Base de Cálculo"
              addLink="/pages/baseCalculo/create"
            />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Bases de Cálculo</Card.Title>

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
                      <b>Descrição</b>
                    </th>
                    <th>
                      <b>Tipo</b>
                    </th>
                    <th>
                      <b>Percentual</b>
                    </th>
                    <th>
                      <b>Valor Mínimo</b>
                    </th>
                    <th>
                      <b>Valor Máximo</b>
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
                  {baseCalculos.map((baseCalculo) => (
                    <tr key={baseCalculo.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(baseCalculo)}
                        >
                          {baseCalculo.nome}
                        </span>
                      </td>
                      <td>{baseCalculo.descricao}</td>
                      <td>{baseCalculo.tipo}</td>
                      <td>{baseCalculo.percentual}</td>
                      <td>{baseCalculo.valor_minimo}</td>
                      <td>{baseCalculo.valor_maximo}</td>
                      <td>{baseCalculo.ativo ? "Sim" : "Não"}</td>
                      <td>
                        <Link
                          href={`/pages/baseCalculo/${baseCalculo.id}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(baseCalculo.id)}
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
          body="Tem certeza de que deseja excluir esta base de cálculo?"
        />
        {/* Modal de Detalhes da Base de Cálculo */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          baseCalculo={selectedBaseCalculo}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, baseCalculo }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Base de Cálculo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {baseCalculo ? (
          <div>
            <p>
              <strong>Nome:</strong> {baseCalculo.nome}
            </p>
            <p>
              <strong>Descrição:</strong> {baseCalculo.descricao}
            </p>
            <p>
              <strong>Tipo:</strong> {baseCalculo.tipo}
            </p>
            <p>
              <strong>Percentual:</strong> {baseCalculo.percentual}
            </p>
            <p>
              <strong>Valor Mínimo:</strong> {baseCalculo.valor_minimo}
            </p>
            <p>
              <strong>Valor Máximo:</strong> {baseCalculo.valor_maximo}
            </p>
            <p>
              <strong>Ativo:</strong> {baseCalculo.ativo ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(baseCalculo.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(baseCalculo.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhuma base de cálculo selecionada.</p>
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

export default BaseCalculo;
