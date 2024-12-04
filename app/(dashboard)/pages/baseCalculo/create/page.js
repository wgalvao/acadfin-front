"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Calculator } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaBaseCalculo } from "utils/validations"; // Assume-se que validationSchemaBaseCalculo está definido para validar campos de base de cálculo
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import {
  fetchBaseCalculoById,
  createBaseCalculo,
  updateBaseCalculo,
} from "@/api/baseCalculo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BaseCalculoForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: "",
    percentual: "",
    valor_minimo: "",
    valor_maximo: "",
    ativo: true,
    user_id: session.user.pk,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchBaseCalculoById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados da base de cálculo:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaBaseCalculo.safeParse(formData);

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
          // Chama createBaseCalculo com apenas formData
          response = await createBaseCalculo(formData);
        } else {
          // Chama updateBaseCalculo com id e formData
          response = await updateBaseCalculo(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Base de Cálculo ${
              isCreating ? "cadastrada" : "atualizada"
            } com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/baseCalculo");
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
      <PageHeading heading="Base de Cálculo" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Calculator />
                {isCreating
                  ? "Cadastro de Base de Cálculo"
                  : "Edição de Base de Cálculo"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input type="hidden" name="user_id" value={session.user.pk} />

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
                    <Form.Label>Percentual</Form.Label>
                    <Form.Control
                      type="text"
                      name="percentual"
                      placeholder="Digite o percentual"
                      value={formData.percentual}
                      onChange={handleChange}
                      isInvalid={!!errors.percentual}
                    />
                    <ErrorMessage message={errors.percentual} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Valor Mínimo</Form.Label>
                    <Form.Control
                      type="text"
                      name="valor_minimo"
                      placeholder="Digite o valor mínimo"
                      value={formData.valor_minimo}
                      onChange={handleChange}
                      isInvalid={!!errors.valor_minimo}
                    />
                    <ErrorMessage message={errors.valor_minimo} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Valor Máximo</Form.Label>
                    <Form.Control
                      type="text"
                      name="valor_maximo"
                      placeholder="Digite o valor máximo"
                      value={formData.valor_maximo}
                      onChange={handleChange}
                      isInvalid={!!errors.valor_maximo}
                    />
                    <ErrorMessage message={errors.valor_maximo} />
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

export default BaseCalculoForm;
