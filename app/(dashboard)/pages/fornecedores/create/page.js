"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, User } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaFornecedor } from "utils/validations"; // Assume-se que validationSchemaFornecedor está definido para validar campos de fornecedor
import ErrorMessage from "sub-components/ErrorMessage";
import {
  fetchFornecedorById,
  createFornecedor,
  updateFornecedor,
} from "@/api/fornecedores";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

const FornecedorForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const { data: session, status } = useSession({ required: true });

  const [formData, setFormData] = useState({
    pessoa_id: "",
    desde: "",
    observacao: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchFornecedorById(id)
        .then((data) => {
          setFormData({
            ...data,
            desde: new Date(data.desde).toISOString().split("T")[0],
          });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do fornecedor:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaFornecedor.safeParse(formData);

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors(errorMessages);
      toast.error("Verifique os erros no formulário.", { autoClose: 2000 });
    } else {
      setLoading(true);
      try {
        console.log("Form Data:", formData); // Log form data

        let response;
        if (isCreating) {
          // Chama createFornecedor com apenas formData
          response = await createFornecedor(formData);
        } else {
          // Chama updateFornecedor com id e formData
          response = await updateFornecedor(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Fornecedor ${
              isCreating ? "cadastrado" : "atualizado"
            } com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/fornecedores");
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

  useEffect(() => {
    if (status === "authenticated" && session?.user?.pk) {
      setFormData((prevState) => ({
        ...prevState,
        user_id: session.user.pk, // Atualize o user_id no estado
      }));
    }
  }, [session, status]);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Fornecedores" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <User />
                {isCreating
                  ? "Cadastro de Fornecedores"
                  : "Edição de Fornecedores"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input
                    type="hidden"
                    name="user_id"
                    value={session?.user?.pk}
                  />

                  {/* Form fields */}
                  <Form.Group className="mb-3">
                    <Form.Label>Pessoa</Form.Label>
                    <Form.Control
                      type="number"
                      name="pessoa_id"
                      placeholder="Digite o nome da pessoa"
                      value={formData.pessoa_id}
                      onChange={handleChange}
                      isInvalid={!!errors.pessoa_id}
                    />
                    <ErrorMessage message={errors.pessoa_id} />
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

export default FornecedorForm;
