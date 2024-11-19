"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Percent } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaAcumulador } from "utils/validations"; // Assume-se que validationSchemaAcumulador está definido para validar campos de acumulador
import ErrorMessage from "sub-components/ErrorMessage";
import { useAuthState } from "@/lib/auth";
import {
  fetchAcumuladorById,
  createAcumulador,
  updateAcumulador,
} from "@/api/acumuladores";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AcumuladorForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { getUserData } = useAuthState();
  const session = getUserData();
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    acumulador: "",
    tipo: "",
    descricao: "",
    valor: "",
    user_id: session.id,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchAcumuladorById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do acumulador:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Substitui a vírgula por ponto no campo valor
    const formattedFormData = {
      ...formData,
      valor: formData.valor.replace(",", "."),
    };

    const result = validationSchemaAcumulador.safeParse(formattedFormData);

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
          // Chama createAcumulador com apenas formData
          response = await createAcumulador(formattedFormData);
        } else {
          // Chama updateAcumulador com id e formData
          response = await updateAcumulador(id, formattedFormData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Acumulador ${
              isCreating ? "cadastrado" : "atualizado"
            } com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/acumuladores");
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
      <PageHeading heading="Acumuladores" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Percent />
                {isCreating
                  ? "Cadastro de Acumuladores"
                  : "Edição de Acumuladores"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input type="hidden" name="user_id" value={session.id} />

                  {/* Form fields */}
                  <Form.Group className="mb-3">
                    <Form.Label>Acumulador</Form.Label>
                    <Form.Control
                      type="text"
                      name="acumulador"
                      placeholder="Digite o nome do acumulador"
                      value={formData.acumulador}
                      onChange={handleChange}
                      isInvalid={!!errors.acumulador}
                    />
                    <ErrorMessage message={errors.acumulador} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipo"
                      placeholder="Digite o tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      isInvalid={!!errors.tipo}
                    />
                    <ErrorMessage message={errors.tipo} />
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
                      type="text"
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

export default AcumuladorForm;
