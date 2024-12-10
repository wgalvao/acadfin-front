"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { fetchEmpresas } from "@/api/empresas";
import { fetchFuncionariosByEmpresa } from "@/api/funcionarios";
import { useSession } from "next-auth/react";
import LoadingSpinner from "sub-components/crud/Spinner";

const DecimoTerceiro = () => {
  const [empresas, setEmpresas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState("");
  const [salario, setSalario] = useState("");
  const [taxaPercentual, setTaxaPercentual] = useState("");
  const [isIntegral, setIsIntegral] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const data = await fetchEmpresas(session.user.pk);
      setEmpresas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFuncionarios = async (id) => {
    setLoading(true);
    try {
      const data = await fetchFuncionariosByEmpresa(id);
      setFuncionarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só carrega os dados se a sessão estiver autenticada
    if (status === "authenticated") {
      loadEmpresas();
    }
  }, [status]);

  useEffect(() => {
    if (selectedEmpresa) {
      loadFuncionarios(selectedEmpresa);
    }
  }, [selectedEmpresa]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const handleEmpresaChange = (e) => {
    setSelectedEmpresa(e.target.value);
    setSelectedFuncionario("");
  };

  const handleFuncionarioChange = (e) => {
    setSelectedFuncionario(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para calcular o décimo terceiro
    console.log("Empresa selecionada:", selectedEmpresa);
    console.log("Funcionário selecionado:", selectedFuncionario);
    console.log("Salário:", salario);
    console.log("Taxa Percentual:", taxaPercentual);
    console.log("É integral?", isIntegral);
  };

  if (session) {
    return (
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={6} lg={8} md={10} xs={12} className="py-8 py-xl-0">
          <Card className="smooth-shadow-md">
            <Card.Body className="p-6">
              <div className="mb-4 text-center">
                <h1>Cálculo de Décimo Terceiro</h1>
                <p className="mb-6">
                  Selecione a empresa e o funcionário para calcular o décimo
                  terceiro.
                </p>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Empresa</Form.Label>
                  <Form.Select
                    value={selectedEmpresa}
                    onChange={handleEmpresaChange}
                    required
                  >
                    <option value="">Selecione uma empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome_razao}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedEmpresa && (
                  <Form.Group className="mb-3">
                    <Form.Label>Funcionário</Form.Label>
                    <Form.Select
                      value={selectedFuncionario}
                      onChange={handleFuncionarioChange}
                      required
                    >
                      <option value="">Selecione um funcionário</option>
                      {funcionarios.map((funcionario) => (
                        <option key={funcionario.id} value={funcionario.id}>
                          {funcionario.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {selectedFuncionario && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Salário</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          value={salario}
                          onChange={(e) => setSalario(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Taxa Percentual</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={taxaPercentual}
                          onChange={(e) => setTaxaPercentual(e.target.value)}
                          required
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Pagamento</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Integral"
                          name="tipoPagamento"
                          id="integral"
                          checked={isIntegral}
                          onChange={() => setIsIntegral(true)}
                        />
                        <Form.Check
                          type="radio"
                          label="Parcial"
                          name="tipoPagamento"
                          id="parcial"
                          checked={!isIntegral}
                          onChange={() => setIsIntegral(false)}
                        />
                      </div>
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Calcular
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
};

export default DecimoTerceiro;
