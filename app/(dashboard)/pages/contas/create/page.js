"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Wallet } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaConta } from "utils/validations"; // Assume-se que validationSchemaConta está definido para validar campos de conta
import ErrorMessage from "sub-components/ErrorMessage";
import { useAuthState } from "@/lib/auth";
import { fetchContaById, createConta, updateConta } from "@/api/contas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContaForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { getUserData } = useAuthState();
  const session = getUserData();
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    conta: "",
    tipo_conta: "",
    descricao: "",
    saldo: "",
    user_id: session.id,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchContaById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados da conta:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Substitui a vírgula por ponto no campo saldo
    const formattedFormData = {
      ...formData,
      saldo: formData.saldo.replace(",", "."),
    };

    const result = validationSchemaConta.safeParse(formattedFormData);

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
          // Chama createConta com apenas formData
          response = await createConta(formattedFormData);
        } else {
          // Chama updateConta com id e formData
          response = await updateConta(id, formattedFormData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Conta ${isCreating ? "cadastrada" : "atualizada"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/contas");
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
      <PageHeading heading="Contas" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Wallet />
                {isCreating ? "Cadastro de Contas" : "Edição de Contas"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input type="hidden" name="user_id" value={session.id} />

                  {/* Form fields */}
                  <Form.Group className="mb-3">
                    <Form.Label>Conta</Form.Label>
                    <Form.Control
                      type="text"
                      name="conta"
                      placeholder="Digite o nome da conta"
                      value={formData.conta}
                      onChange={handleChange}
                      isInvalid={!!errors.conta}
                    />
                    <ErrorMessage message={errors.conta} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Conta</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipo_conta"
                      placeholder="Digite o tipo de conta"
                      value={formData.tipo_conta}
                      onChange={handleChange}
                      isInvalid={!!errors.tipo_conta}
                    />
                    <ErrorMessage message={errors.tipo_conta} />
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
                    <Form.Label>Saldo</Form.Label>
                    <Form.Control
                      type="text"
                      name="saldo"
                      placeholder="Digite o saldo"
                      value={formData.saldo}
                      onChange={handleChange}
                      isInvalid={!!errors.saldo}
                    />
                    <ErrorMessage message={errors.saldo} />
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

export default ContaForm;