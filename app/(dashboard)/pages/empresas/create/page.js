// createCompany.js
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputMask from "react-input-mask";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Briefcase } from "lucide-react";

// import sub components
import { PageHeading } from "widgets";
import { createEmpresa } from "@/api/empresas";
import estados from "data/Estados";
import { validationSchemaEmpresa } from "utils/validations";
import ErrorMessage from "sub-components/ErrorMessage";
import { useAuthState } from "@/lib/auth";

const Empresas = () => {
  const router = useRouter();
  const { getUserData } = useAuthState();
  // const logOut = useLogOut();
  const session = getUserData();
  const [formData, setFormData] = useState({
    cnpj: "",
    nome_razao: "",
    nome_fantasia: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
    inscricao_estadual: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaEmpresa.safeParse(formData);

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors(errorMessages);
      alert("Verifique os erros no formulário.");
    } else {
      try {
        const response = await createEmpresa(formData);
        // const response = await fetch("http://localhost:8000/api/empresas/", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(formData),
        // });
        // console.log(response);

        if (response.ok) {
          alert("Empresa cadastrada com sucesso!");
          setFormData({
            cnpj: "",
            nome_razao: "",
            nome_fantasia: "",
            endereco: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            telefone: "",
            email: "",
            inscricao_estadual: "",
          });
          router.push("/pages/empresas");
        } else {
          const errorData = await response.json();
          alert("Erro ao enviar o formulário: " + errorData.message);
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Ocorreu um erro ao tentar enviar o formulário.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Empresas" />

      <Card>
        <Card.Body>
          <Card.Title as="h3">
            <Briefcase />
            Cadastro de empresas
          </Card.Title>
          <div className="py-2">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CNPJ</Form.Label>
                    <InputMask
                      mask="99.999.999/9999-99"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          placeholder="Digite o CNPJ"
                          isInvalid={!!errors.cnpj}
                        />
                      )}
                    </InputMask>
                    <ErrorMessage message={errors.cnpj} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Razão Social</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_razao"
                      placeholder="Digite a razão social"
                      value={formData.nome_razao}
                      onChange={handleChange}
                      isInvalid={!!errors.nome_razao}
                    />
                    <ErrorMessage message={errors.nome_razao} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Fantasia</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_fantasia"
                      placeholder="Digite o nome fantasia"
                      value={formData.nome_fantasia}
                      onChange={handleChange}
                      isInvalid={!!errors.nome_fantasia}
                    />
                    <ErrorMessage message={errors.nome_fantasia} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Inscrição Estadual</Form.Label>
                    <Form.Control
                      type="text"
                      name="inscricao_estadual"
                      placeholder="Digite a inscrição estadual"
                      value={formData.inscricao_estadual}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco"
                      placeholder="Digite o endereço"
                      value={formData.endereco}
                      onChange={handleChange}
                      isInvalid={!!errors.endereco}
                    />
                    <ErrorMessage message={errors.endereco} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control
                      type="text"
                      name="bairro"
                      placeholder="Digite o bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      isInvalid={!!errors.bairro}
                    />
                    <ErrorMessage message={errors.bairro} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="cidade"
                      placeholder="Digite a cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      isInvalid={!!errors.cidade}
                    />
                    <ErrorMessage message={errors.cidade} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      as="select"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      isInvalid={!!errors.estado}
                    >
                      <option value="">Selecione o estado</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </Form.Control>
                    <ErrorMessage message={errors.estado} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <InputMask
                      mask="99999-999"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          placeholder="Digite o CEP"
                          isInvalid={!!errors.cep}
                        />
                      )}
                    </InputMask>
                    <ErrorMessage message={errors.cep} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <InputMask
                      mask="(99) 9999-9999"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          placeholder="Digite o telefone"
                          isInvalid={!!errors.telefone}
                        />
                      )}
                    </InputMask>
                    <ErrorMessage message={errors.telefone} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Digite o email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <ErrorMessage message={errors.email} />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button
                  className="mb-3"
                  variant="success"
                  size="lg"
                  type="submit"
                >
                  <Save /> Salvar informações
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Empresas;
