"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, FileText } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaPlanoConta } from "utils/validations"; // Assume-se que validationSchemaPlanoConta está definido para validar campos de plano de contas
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import {
  fetchPlanoContaById,
  createPlanoConta,
  updatePlanoConta,
} from "@/api/planoContas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlanoContaForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    codigo_contas: "",
    nome_conta: "",
    tipo_conta: "",
    nivel: "",
    descricao: "",
    conta_pai: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchPlanoContaById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do plano de contas:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaPlanoConta.safeParse(formData);

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
          // Chama createPlanoConta com apenas formData
          response = await createPlanoConta(formData);
        } else {
          // Chama updatePlanoConta com id e formData
          response = await updatePlanoConta(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Plano de Contas ${
              isCreating ? "cadastrado" : "atualizado"
            } com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/plano-contas");
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
      <PageHeading heading="Plano de Contas" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <FileText />
                {isCreating
                  ? "Cadastro de Plano de Contas"
                  : "Edição de Plano de Contas"}
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
                    <Form.Label>Código de Contas</Form.Label>
                    <Form.Control
                      type="text"
                      name="codigo_contas"
                      placeholder="Digite o código de contas"
                      value={formData.codigo_contas}
                      onChange={handleChange}
                      isInvalid={!!errors.codigo_contas}
                    />
                    <ErrorMessage message={errors.codigo_contas} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nome da Conta</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_conta"
                      placeholder="Digite o nome da conta"
                      value={formData.nome_conta}
                      onChange={handleChange}
                      isInvalid={!!errors.nome_conta}
                    />
                    <ErrorMessage message={errors.nome_conta} />
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
                    <Form.Label>Nível</Form.Label>
                    <Form.Control
                      type="text"
                      name="nivel"
                      placeholder="Digite o nível"
                      value={formData.nivel}
                      onChange={handleChange}
                      isInvalid={!!errors.nivel}
                    />
                    <ErrorMessage message={errors.nivel} />
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
                    <Form.Label>Conta Pai</Form.Label>
                    <Form.Control
                      type="text"
                      name="conta_pai"
                      placeholder="Digite a conta pai"
                      value={formData.conta_pai}
                      onChange={handleChange}
                      isInvalid={!!errors.conta_pai}
                    />
                    <ErrorMessage message={errors.conta_pai} />
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

export default PlanoContaForm;
