"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Percent } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaAliquota } from "utils/validations"; // Assume-se que validationSchemaAliquota está definido para validar campos de alíquota
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import {
  fetchAliquotaById,
  createAliquota,
  updateAliquota,
} from "@/api/aliquotas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import estados from "data/Estados";

const AliquotaForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    tipo_imposto: "",
    percentual: "",
    estado: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchAliquotaById(id)
        .then((data) => {
          setFormData({
            ...data,
            data_inicio: new Date(data.data_inicio).toISOString().split("T")[0],
            data_fim: new Date(data.data_fim).toISOString().split("T")[0],
          });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados da alíquota:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Substitui a vírgula por ponto no campo percentual
    const formattedFormData = {
      ...formData,
      percentual: formData.percentual.replace(",", "."),
    };

    const result = validationSchemaAliquota.safeParse(formattedFormData);

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
          // Chama createAliquota com apenas formData
          response = await createAliquota(formattedFormData);
        } else {
          // Chama updateAliquota com id e formData
          response = await updateAliquota(id, formattedFormData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Alíquota ${isCreating ? "cadastrada" : "atualizada"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/aliquotas");
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
      <PageHeading heading="Alíquotas" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Percent />
                {isCreating ? "Cadastro de Alíquotas" : "Edição de Alíquotas"}
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
                    <Form.Label>Tipo de Imposto</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipo_imposto"
                      placeholder="Digite o tipo de imposto"
                      value={formData.tipo_imposto}
                      onChange={handleChange}
                      isInvalid={!!errors.tipo_imposto}
                    />
                    <ErrorMessage message={errors.tipo_imposto} />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                          isInvalid={!!errors.estado}
                        >
                          <option value="">Selecione um estado</option>
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </Form.Select>
                        <ErrorMessage message={errors.estado} />
                      </Form.Group>
                    </Col>
                  </Row>

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

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Data de Início</Form.Label>
                        <Form.Control
                          type="date"
                          name="data_inicio"
                          value={formData.data_inicio}
                          onChange={handleChange}
                          isInvalid={!!errors.data_inicio}
                        />
                        <ErrorMessage message={errors.data_inicio} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Data de Fim</Form.Label>
                        <Form.Control
                          type="date"
                          name="data_fim"
                          value={formData.data_fim}
                          onChange={handleChange}
                          isInvalid={!!errors.data_fim}
                        />
                        <ErrorMessage message={errors.data_fim} />
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

export default AliquotaForm;
