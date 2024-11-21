"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import InputMask from "react-input-mask"; // Importa a biblioteca de máscara
import { z } from "zod";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, BookMarked } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "@/lib/auth";

// import sub components
import { PricingCard, PageHeading, FeatureLeftTopIcon } from "widgets";
import {
  createFuncionario,
  updateFuncionario,
  fetchFuncionarioById,
} from "@/api/funcionarios";

import { fetchEmpresas } from "api/empresas";

import estados from "data/Estados";
import { validationSchema } from "utils/validations";
import ErrorMessage from "sub-components/ErrorMessage";

// Função auxiliar para formatar a data de YYYY-MM-DD para DD/MM/YYYY
const formatDateToDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função auxiliar para formatar a data de DD/MM/YYYY para YYYY-MM-DD
const formatDateToSubmit = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

const Funcionarios = () => {
  const { getUserData } = useAuthState();
  const session = getUserData();

  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    cep: "",
    cpf: "",
    telefone: "",
    celular: "",
    estado: "",
    nome: "",
    estado_civil: "",
    data_nasc: "",
    idade: "",
    sexo: "",
    escolaridade: "",
    naturalidade: "",
    pis: "",
    identidade: "",
    ctps: "",
    serie: "",
    endereco: "",
    bairro: "",
    cidade: "",
    email: "",
    user_id: session.id,
  });

  const [errors, setErrors] = useState({});
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetchEmpresas().then((data) => setEmpresas(data));
    if (id) {
      fetchFuncionarioById(id)
        .then((data) => {
          // Formata a data de nascimento para DD/MM/YYYY
          const formattedData = {
            ...data,
            data_nasc: new Date(data.data_nasc).toISOString().split("T")[0],
          };
          setFormData(formattedData);
          setIsEditing(true); // Set to true since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do funcionário:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpar erros antes de validar
    const result = validationSchema.safeParse(formData);

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors(errorMessages); // Atualiza o estado de erros com as mensagens
      toast.error("Verifique os erros no formulário.", { autoClose: 2000 });
    } else {
      setLoading(true);
      try {
        const formattedData = {
          ...formData,
        };

        const response = await (isEditing
          ? updateFuncionario(id, formattedData)
          : createFuncionario(formattedData));

        if (response) {
          toast.success(
            `Funcionário ${
              isEditing ? "atualizado" : "cadastrado"
            } com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/funcionarios");
        } else {
          toast.error("Ocorreu um erro ao tentar enviar o formulário.", {
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        toast.error(
          `Ocorreu um erro ao tentar enviar o formulário: ${error.message}`
        );
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Funcionários" />

      <Card>
        <Card.Body>
          <Card.Title as="h3">
            <BookMarked />
            {isEditing
              ? " Edição de funcionários"
              : " Cadastro de funcionários"}
          </Card.Title>
          <div className="py-2">
            <Form onSubmit={handleSubmit}>
              {/* Dados Gerais */}
              {/* Hidden input field for session.id */}
              <input type="hidden" name="user_id" value={session.id} />
              <Card.Title as="h4">Dados Gerais</Card.Title>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome completo"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      isInvalid={!!errors.nome} // Exibe erro se houver
                    />
                    <ErrorMessage message={errors.nome} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado Civil</Form.Label>
                    <Form.Control
                      as="select"
                      name="estado_civil"
                      value={formData.estado_civil}
                      onChange={handleChange}
                    >
                      <option value="">Selecione o estado civil</option>
                      <option value="solteiro">Solteiro</option>
                      <option value="casado">Casado</option>
                      <option value="divorciado">Divorciado</option>
                      <option value="viuvo">Viúvo</option>
                      <option value="uniao_estavel">União estável</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* // Dentro do JSX do componente */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Início</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_nasc"
                      value={formData.data_nasc}
                      onChange={handleChange}
                      isInvalid={!!errors.data_nasc}
                    />
                    <ErrorMessage message={errors.data_nasc} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Idade</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Digite a idade"
                      name="idade"
                      value={formData.idade}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sexo</Form.Label>
                    <Form.Control
                      as="select"
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                    >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Escolaridade</Form.Label>
                    <Form.Control
                      type="text"
                      name="escolaridade"
                      placeholder="Digite a escolaridade"
                      value={formData.escolaridade}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Naturalidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="naturalidade"
                      placeholder="Digite a naturalidade"
                      value={formData.naturalidade}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Documentação */}
              {/* <h5 className="mt-4">Documentação</h5> */}
              <Card.Title as="h4">Vínculo</Card.Title>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Empresa</Form.Label>
                    <Form.Select
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      isInvalid={!!errors.empresa}
                    >
                      <option value="">Selecione uma empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nome_razao}
                        </option>
                      ))}
                    </Form.Select>
                    <ErrorMessage message={errors.empresa} />
                  </Form.Group>
                </Col>
              </Row>
              <Card.Title as="h4">Documentação</Card.Title>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <InputMask
                      mask="999.999.999-99"
                      value={formData.cpf}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          placeholder="Digite o CPF"
                          name="cpf"
                          isInvalid={!!errors.cpf}
                        />
                      )}
                    </InputMask>
                    <Form.Control.Feedback type="invalid">
                      {errors.cpf}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>PIS</Form.Label>
                    <Form.Control
                      type="text"
                      name="pis"
                      placeholder="Digite o PIS"
                      value={formData.pis}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Identidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="identidade"
                      placeholder="Digite a identidade"
                      value={formData.identidade}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CTPS</Form.Label>
                    <Form.Control
                      type="text"
                      name="ctps"
                      placeholder="Digite o CTPS"
                      value={formData.ctps}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Série</Form.Label>
                    <Form.Control
                      type="text"
                      name="serie"
                      placeholder="Digite a série"
                      value={formData.serie}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Endereço e Contato */}
              {/* <h5 className="mt-4">Endereço e Contato</h5>*/}
              <Card.Title as="h4">Endereço e Contato</Card.Title>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o endereço"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                    />
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
                    />
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
                    />
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
                      isInvalid={!!errors.estado} // Exibe erro se houver
                    >
                      <option value="">Selecione o estado</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.estado}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control type="text" placeholder="Digite o CEP" />
                  </Form.Group>
                </Col> */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <InputMask
                      mask="99999-999"
                      value={formData.cep}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          placeholder="Digite o celular"
                          name="cep"
                          isInvalid={!!errors.cep}
                        />
                      )}
                    </InputMask>
                    <Form.Control.Feedback type="invalid">
                      {errors.cep}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
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
                          name="telefone"
                          isInvalid={!!errors.telefone}
                        />
                      )}
                    </InputMask>
                    <Form.Control.Feedback type="invalid">
                      {errors.telefone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Celular</Form.Label>
                    <InputMask
                      type="text"
                      mask="(99) 99999-9999"
                      name="celular"
                      value={formData.celular}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          name="celular"
                          placeholder="Digite o celular"
                          isInvalid={!!errors.celular}
                        />
                      )}
                    </InputMask>
                    <Form.Control.Feedback type="invalid">
                      {errors.celular}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Digite o email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                {/* <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Naturalidade</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite a naturalidade"
                    />
                  </Form.Group>
                </Col> */}
              </Row>
              <div className="d-grid gap-2">
                <Button
                  className="mb-3"
                  variant="success"
                  size="lg"
                  type="submit"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>{" "}
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Save /> {isEditing ? "Atualizar" : "Salvar"} informações
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer autoClose={2000} />
    </Container>
  );
};

export default Funcionarios;
