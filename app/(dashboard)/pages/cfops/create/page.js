"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, FileText } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaCfop } from "utils/validations"; // Assume-se que validationSchemaCfop está definido para validar campos de CFOP
import ErrorMessage from "sub-components/ErrorMessage";
import { useAuthState } from "@/lib/auth";
import { fetchCfopById, createCfop, updateCfop } from "@/api/cfops";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CfopForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { getUserData } = useAuthState();
  const session = getUserData();
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    codigo: "",
    descricao: "",
    tipo_operacao: "",
    user_id: session.id,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchCfopById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do CFOP:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaCfop.safeParse(formData);

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
          // Chama createCfop com apenas formData
          response = await createCfop(formData);
        } else {
          // Chama updateCfop com id e formData
          response = await updateCfop(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `CFOP ${isCreating ? "cadastrado" : "atualizado"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/cfops");
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
      <PageHeading heading="CFOPs" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <FileText />
                {isCreating ? "Cadastro de CFOPs" : "Edição de CFOPs"}
              </Card.Title>
              <div className="py-2">
                <Form onSubmit={handleSubmit}>
                  {/* Hidden input field for session.id */}
                  <input type="hidden" name="user_id" value={session.id} />

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
                    <Form.Label>Tipo de Operação</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipo_operacao"
                      placeholder="Digite o tipo de operação"
                      value={formData.tipo_operacao}
                      onChange={handleChange}
                      isInvalid={!!errors.tipo_operacao}
                    />
                    <ErrorMessage message={errors.tipo_operacao} />
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

export default CfopForm;