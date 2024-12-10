"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Briefcase } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaServico } from "utils/validations"; // Assume-se que validationSchemaServico está definido para validar campos de serviço
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import { fetchServicoById, createServico, updateServico } from "@/api/servicos";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    codigo: "",
    descricao: "",
    valor: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchServicoById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do serviço:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaServico.safeParse(formData);

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
          // Chama createServico com apenas formData
          response = await createServico(formData);
        } else {
          // Chama updateServico com id e formData
          response = await updateServico(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Serviço ${isCreating ? "cadastrado" : "atualizado"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/servicos");
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
      <PageHeading heading="Serviços" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Briefcase />
                {isCreating ? "Cadastro de serviços" : "Edição de serviços"}
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
                    <Form.Label>Código</Form.Label>
                    <Form.Control
                      type="text"
                      name="codigo"
                      placeholder="Digite o código"
                      value={formData.codigo}
                      onChange={handleChange}
                      isInvalid={!!errors.codigo}
                    />
                    <ErrorMessage message={errors.codigo} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="descricao"
                      placeholder="Digite a descrição"
                      value={formData.descricao}
                      onChange={handleChange}
                      isInvalid={!!errors.descricao}
                    />
                    <ErrorMessage message={errors.descricao} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Valor</Form.Label>
                    <Form.Control
                      type="number"
                      name="valor"
                      placeholder="Digite o valor"
                      value={formData.valor}
                      onChange={handleChange}
                      isInvalid={!!errors.valor}
                    />
                    <ErrorMessage message={errors.valor} />
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

export default Home;
