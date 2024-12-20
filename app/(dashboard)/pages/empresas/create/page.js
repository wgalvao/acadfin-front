"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import InputMask from "react-input-mask"; // Importa a biblioteca de máscara
import {
  Col,
  Row,
  Container,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { Save, Briefcase } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import sub components
import { PageHeading } from "widgets";
import { createEmpresa, updateEmpresa, fetchEmpresaById } from "@/api/empresas";
import { fetchClientes } from "@/api/clientes";
import estados from "data/Estados";
import { validationSchemaEmpresa } from "utils/validations";
import ErrorMessage from "sub-components/ErrorMessage";

import { useSession } from "next-auth/react";

const Empresas = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const { data: session, status } = useSession();

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
    user_id: "",
    cliente: "",
  });

  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);

  const [cnpjConsulta, setCnpjConsulta] = useState("");
  const [cnpjData, setCnpjData] = useState(null);
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  const formatCnpj = (cnpj) => {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  const formatCep = (cep) => {
    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  const formatPhone = (phone) => {
    return phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
  };

  useEffect(() => {
    if (id) {
      fetchEmpresaById(id)
        .then((data) => {
          setFormData(data);
          setIsEditing(true); // Set to true since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados da empresa:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpar erros antes de validar
    const result = validationSchemaEmpresa.safeParse(formData);

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors(errorMessages); // Atualiza o estado de erros com as mensagens
      toast.error("Verifique os erros no formulário.", { autoClose: 2000 });
    } else {
      setLoading(true);
      try {
        const response = await (isEditing
          ? updateEmpresa(id, formData)
          : createEmpresa(formData));

        if (response) {
          toast.success(
            `Empresa ${isEditing ? "atualizada" : "cadastrada"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/empresas");
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

  useEffect(() => {
    if (status === "authenticated" && session?.user?.pk) {
      setFormData((prevState) => ({
        ...prevState,
        user_id: session.user.pk, // Atualize o user_id no estado
      }));
      fetchClientes(session.user.pk).then((data) => setClientes(data));
    }
  }, [session, status]);

  const handleCnpjConsulta = async () => {
    if (!cnpjConsulta) {
      toast.error("Por favor, insira um CNPJ válido.", { autoClose: 2000 });
      return;
    }

    // Remove pontos, traços e barras do CNPJ
    const cleanedCnpj = cnpjConsulta.replace(/[.-\/]/g, "");

    setLoadingCnpj(true);
    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`
      );
      const data = await response.json();
      setCnpjData(data);
    } catch (error) {
      console.error("Erro ao consultar CNPJ:", error);
      toast.error("Ocorreu um erro ao consultar o CNPJ.", { autoClose: 2000 });
    } finally {
      setLoadingCnpj(false);
    }
  };

  const handleCopyToForm = () => {
    if (cnpjData) {
      const formattedCnpj = formatCnpj(cnpjData.cnpj);
      const formattedCep = formatCep(cnpjData.cep);
      const formattedPhone = formatPhone(cnpjData.ddd_telefone_1);

      setFormData({
        ...formData,
        cnpj: formattedCnpj,
        nome_razao: cnpjData.razao_social,
        nome_fantasia: cnpjData.nome_fantasia,
        endereco: cnpjData.logradouro,
        bairro: cnpjData.bairro,
        cidade: cnpjData.municipio,
        estado: cnpjData.uf,
        cep: formattedCep,
        telefone: formattedPhone,
        email: cnpjData.email,
        inscricao_estadual: cnpjData.inscricao_estadual,
      });
      toast.success("Dados copiados para o formulário.", { autoClose: 2000 });
    }
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Empresas" />

      <Card>
        <Card.Body>
          <Card.Title as="h3">
            <Briefcase />
            {isEditing ? "Edição de empresas" : "Cadastro de empresas"}
          </Card.Title>

          <div className="py-2">
            <Form.Group className="mb-3">
              <Form.Label>Consultar CNPJ</Form.Label>
              <InputMask
                mask="99.999.999/9999-99"
                value={cnpjConsulta}
                onChange={(e) => setCnpjConsulta(e.target.value)}
              >
                {(inputProps) => (
                  <Form.Control
                    {...inputProps}
                    type="text"
                    placeholder="Digite o CNPJ"
                  />
                )}
              </InputMask>
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleCnpjConsulta}
                disabled={loadingCnpj}
              >
                {loadingCnpj ? "Consultando..." : "Consultar"}
              </Button>
            </Form.Group>

            {cnpjData && (
              <Alert variant="info" className="mt-3">
                <Alert.Heading>Dados do CNPJ</Alert.Heading>
                <div>
                  <strong>CNPJ:</strong> {cnpjData.cnpj}
                </div>
                <div>
                  <strong>Razão Social:</strong> {cnpjData.razao_social}
                </div>
                <div>
                  <strong>Nome Fantasia:</strong> {cnpjData.nome_fantasia}
                </div>
                <div>
                  <strong>Telefone:</strong> {cnpjData.ddd_telefone_1}
                </div>
                <Button
                  variant="secondary"
                  onClick={handleCopyToForm}
                  className="mt-3"
                >
                  Copiar para o formulário
                </Button>
              </Alert>
            )}
          </div>

          <div className="py-2">
            <Form onSubmit={handleSubmit}>
              {/* Hidden input field for session.user.pk */}
              <input type="hidden" name="user_id" value={session?.user?.pk} />
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
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Proprietário</Form.Label>
                    <Form.Select
                      name="cliente"
                      value={formData.cliente}
                      onChange={handleChange}
                      isInvalid={!!errors.cliente}
                    >
                      <option value="">Selecione uma Proprietário</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                    </Form.Select>
                    <ErrorMessage message={errors.cliente} />
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

export default Empresas;
