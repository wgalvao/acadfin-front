"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, User } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaCliente } from "utils/validations"; // Assume-se que validationSchemaCliente está definido para validar campos de cliente
import ErrorMessage from "sub-components/ErrorMessage";
import { useAuthState } from "@/lib/auth";
import { fetchClienteById, createCliente, updateCliente } from "@/api/clientes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClienteForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { getUserData } = useAuthState();
  const session = getUserData();
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    nome: "",
    desde: "",
    taxa_desconto: "",
    limite_credito: "",
    observacao: "",
    user_id: session.id,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchClienteById(id)
        .then((data) => {
          setFormData({
            ...data,
            desde: new Date(data.desde).toISOString().split("T")[0],
          });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do cliente:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Substitui a vírgula por ponto nos campos taxa_desconto e limite_credito
    const formattedFormData = {
      ...formData,
      taxa_desconto: formData.taxa_desconto.replace(",", "."),
      limite_credito: formData.limite_credito.replace(",", "."),
    };

    const result = validationSchemaCliente.safeParse(formattedFormData);

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors(errorMessages);
      toast.error("Verifique os erros no formulário.", { autoClose: 2000 });
    } else {
      setLoading(true);
      try {
        console.log("Form Data:", formattedFormData); // Log form data

        let response;
        if (isCreating) {
          // Chama createCliente com apenas formData
          response = await createCliente(formattedFormData);
        } else {
          // Chama updateCliente com id e formData
          response = await updateCliente(id, formattedFormData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Cliente ${isCreating ? "cadastrado" : "atualizado"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/clientes");
        } else {
          toast.error("Ocorreu um erro ao tentar enviar o formulário.", {
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        toast.error("Ocorreu um erro ao tentar enviar o formulário.");
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
      <PageHeading heading="Clientes" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <User />
                {isCreating ? "Cadastro de Clientes" : "Edição de Clientes"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input type="hidden" name="user_id" value={session.id} />

                  {/* Form fields */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      placeholder="Digite o nome"
                      value={formData.nome}
                      onChange={handleChange}
                      isInvalid={!!errors.nome}
                    />
                    <ErrorMessage message={errors.nome} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Desde</Form.Label>
                    <Form.Control
                      type="date"
                      name="desde"
                      value={formData.desde}
                      onChange={handleChange}
                      isInvalid={!!errors.desde}
                    />
                    <ErrorMessage message={errors.desde} />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Taxa de Desconto</Form.Label>
                        <Form.Control
                          type="text"
                          name="taxa_desconto"
                          placeholder="Digite a taxa de desconto"
                          value={formData.taxa_desconto}
                          onChange={handleChange}
                          isInvalid={!!errors.taxa_desconto}
                        />
                        <ErrorMessage message={errors.taxa_desconto} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Limite de Crédito</Form.Label>
                        <Form.Control
                          type="text"
                          name="limite_credito"
                          placeholder="Digite o limite de crédito"
                          value={formData.limite_credito}
                          onChange={handleChange}
                          isInvalid={!!errors.limite_credito}
                        />
                        <ErrorMessage message={errors.limite_credito} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="observacao"
                      placeholder="Digite a observação"
                      value={formData.observacao}
                      onChange={handleChange}
                      isInvalid={!!errors.observacao}
                    />
                    <ErrorMessage message={errors.observacao} />
                  </Form.Group>

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
                          <Save /> {isCreating ? "Salvar" : "Atualizar"}{" "}
                          informações
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer autoClose={2000} />
    </Container>
  );
};

export default ClienteForm;
