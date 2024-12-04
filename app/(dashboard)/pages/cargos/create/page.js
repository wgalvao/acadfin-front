"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Briefcase } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaCargo } from "utils/validations"; // Assume-se que validationSchemaCargo está definido para validar campos de cargo
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import { fetchCargoById, createCargo, updateCargo } from "@/api/cargos";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CargoForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    cargo: "",
    descricao: "",
    nivel: "",
    salario: "",
    ativo: true,
    user_id: session.user.pk,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchCargoById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do cargo:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Substitui a vírgula por ponto no campo salario
    const formattedFormData = {
      ...formData,
      salario: formData.salario.replace(",", "."),
    };

    const result = validationSchemaCargo.safeParse(formattedFormData);

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
          // Chama createCargo com apenas formData
          response = await createCargo(formattedFormData);
        } else {
          // Chama updateCargo com id e formData
          response = await updateCargo(id, formattedFormData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Cargo ${isCreating ? "cadastrado" : "atualizado"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/cargos");
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
      <PageHeading heading="Cargos" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Briefcase />
                {isCreating ? "Cadastro de Cargos" : "Edição de Cargos"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input type="hidden" name="user_id" value={session.user.pk} />

                  {/* Form fields */}
                  <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                      type="text"
                      name="cargo"
                      placeholder="Digite o cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      isInvalid={!!errors.cargo}
                    />
                    <ErrorMessage message={errors.cargo} />
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
                    <Form.Label>Salário</Form.Label>
                    <Form.Control
                      type="text"
                      name="salario"
                      placeholder="Digite o salário"
                      value={formData.salario}
                      onChange={handleChange}
                      isInvalid={!!errors.salario}
                    />
                    <ErrorMessage message={errors.salario} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ativo</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "ativo", value: e.target.checked },
                        })
                      }
                    />
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

export default CargoForm;
