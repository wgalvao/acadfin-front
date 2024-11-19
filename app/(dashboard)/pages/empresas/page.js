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

import { fetchEmpresas, deleteEmpresa } from "@/api/empresas";

import Header from "sub-components/crud/Header";
import ModalDelete from "sub-components/crud/ModalDelete";

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const data = await fetchEmpresas();
      setEmpresas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  const handleDeleteClick = (id) => {
    setEmpresaId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmpresa(empresaId);
      setShowDeleteModal(false);
      loadEmpresas(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
    }
  };

  const handleDetailsClick = (empresa) => {
    setSelectedEmpresa(empresa);
    setShowDetailsModal(true);
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <Header title="Empresas" addLink="/pages/empresas/create" />
          </Col>
        </Row>
        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de Empresas</Card.Title>

            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error}</p>
            ) : (
              <Table striped responsive className="text-nowrap mt-3">
                <thead>
                  <tr>
                    <th>
                      <b>Razão Social</b>
                    </th>
                    <th>
                      <b>CNPJ</b>
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
                  {empresas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td>
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleDetailsClick(empresa)}
                        >
                          {empresa.nome_razao}
                        </span>
                      </td>
                      <td>{empresa.cnpj}</td>
                      <td>{empresa.telefone}</td>
                      <td>
                        <Link href={`/pages/empresas/${empresa.id}/edit/`}>
                          <Button variant="outline-warning" size="sm">
                            <UserPen />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(empresa.id)}
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
          body="Tem certeza de que deseja excluir esta empresa?"
        />

        {/* Modal de Detalhes da Empresa */}
        <ModalDetails
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          empresa={selectedEmpresa}
        />
      </Container>
    </Fragment>
  );
};

const ModalDetails = ({ show, onHide, empresa }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {empresa ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <p>
                <strong>Razão Social:</strong> {empresa.nome_razao}
              </p>
              <p>
                <strong>CNPJ:</strong> {empresa.cnpj}
              </p>
              <p>
                <strong>Telefone:</strong> {empresa.telefone}
              </p>
              <p>
                <strong>Email:</strong> {empresa.email}
              </p>
              <p>
                <strong>Endereço:</strong> {empresa.endereco}
              </p>
              <p>
                <strong>Bairro:</strong> {empresa.bairro}
              </p>
            </div>
            <div>
              <p>
                <strong>Cidade:</strong> {empresa.cidade}
              </p>
              <p>
                <strong>Estado:</strong> {empresa.estado}
              </p>
              <p>
                <strong>CEP:</strong> {empresa.cep}
              </p>
              <p>
                <strong>Data de Fundação:</strong>{" "}
                {new Date(empresa.data_fundacao).toLocaleDateString()}
              </p>
              <p>
                <strong>Inscrição Estadual:</strong>{" "}
                {empresa.inscricao_estadual}
              </p>
            </div>
          </div>
        ) : (
          <p>Nenhuma empresa selecionada.</p>
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

export default Empresas;
