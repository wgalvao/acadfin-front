// empresas.js
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
import { Trash } from "lucide-react";

import { fetchEmpresas, deleteEmpresa } from "@/api/empresas";

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmpresa(empresaId);
      setShowModal(false);
      loadEmpresas(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
    }
  };

  return (
    <Fragment>
      <div className="bg-primary pt-8 pb-8"></div>
      <Container fluid className="mt-n10 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0 text-white">Empresas</h3>
              </div>
              <div>
                <Link href="/pages/empresas/create" className="btn btn-white">
                  Adicionar nova empresa
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <Card className="mt-6" style={{ width: "auto" }}>
          <Card.Body>
            <Card.Title>Listagem de empresas</Card.Title>

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
                    <tr key={empresa.cod_empresa}>
                      <td>{empresa.nome_razao}</td>
                      <td>{empresa.cnpj}</td>
                      <td>{empresa.telefone}</td>
                      <td>
                        <Link
                          href={`/pages/empresas/${empresa.cod_empresa}/edit/`}
                        >
                          <Button variant="outline-warning" size="sm">
                            Alterar
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(empresa.cod_empresa)}
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

        {/* Modal de Confirmação */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação de Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja excluir esta empresa?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default Empresas;
