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

import { fetchCfops, deleteCfop } from "@/api/cfops";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Cfops = () => {
  const [cfops, setCfops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCfop, setSelectedCfop] = useState(null);
  const [cfopId, setCfopId] = useState(null);

  const { data: session, status } = useSession({ required: true });

  const loadCfops = async () => {
    setLoading(true);
    try {
      const data = await fetchCfops(session.user.pk);
      setCfops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCfops();
  }, []);

  const handleDeleteClick = (id) => {
    setCfopId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCfop(cfopId);
      setShowDeleteModal(false);
      loadCfops(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar CFOP:", error);
    }
  };

  const handleDetailsClick = (cfop) => {
    console.log(cfop);
    setSelectedCfop(cfop);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-dark pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="CFOPs" addLink="/pages/cfops/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de CFOPs</Card.Title>

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
                      <b>Tipo de Operação</b>
                    </th>
                    <th>
                      <b>Ações</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cfops.map((cfop) => (
                    <tr key={cfop.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(cfop)}
                        >
                          {cfop.codigo}
                        </span>
                      </td>
                      <td>{cfop.descricao}</td>
                      <td>{cfop.tipo_operacao}</td>
                      <td>
                        <Link href={`/pages/cfops/${cfop.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          placeholder="Remover"
                          size="sm"
                          onClick={() => handleDeleteClick(cfop.id)}
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
          body="Tem certeza de que deseja excluir este CFOP?"
        />
        {/* Modal de Detalhes do CFOP */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cfop={selectedCfop}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, cfop }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do CFOP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cfop ? (
          <div>
            <p>
              <strong>Código:</strong> {cfop.codigo}
            </p>
            <p>
              <strong>Descrição:</strong> {cfop.descricao}
            </p>
            <p>
              <strong>Tipo de Operação:</strong> {cfop.tipo_operacao}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(cfop.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(cfop.updated_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Nenhum CFOP selecionado.</p>
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

export default Cfops;
