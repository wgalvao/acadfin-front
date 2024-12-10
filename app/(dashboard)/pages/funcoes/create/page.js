"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import { Save, Briefcase } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaFuncao } from "utils/validations"; // Assume-se que validationSchemaFuncao está definido para validar campos de função
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import { fetchFuncaoById, createFuncao, updateFuncao } from "@/api/funcoes";
import { fetchEmpresas } from "@/api/empresas"; // Assume-se que fetchEmpresas está definido para buscar empresas
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FuncaoForm = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  // Carregar empresas ao montar o componente
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    codva: "",
    codvp: "",
    codvt: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetchEmpresas().then((data) => setEmpresas(data));

    if (id) {
      fetchFuncaoById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing
        })
        .catch((error) =>
          console.error("Erro ao carregar dados da função:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaFuncao.safeParse(formData);

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
          // Chama createFuncao com apenas formData
          response = await createFuncao(formData);
        } else {
          // Chama updateFuncao com id e formData
          response = await updateFuncao(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          toast.success(
            `Função ${isCreating ? "cadastrada" : "atualizada"} com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/funcoes");
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
      <PageHeading heading="Funções" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Briefcase />
                {isCreating ? "Cadastro de Funções" : "Edição de Funções"}
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
                    <Form.Label>Empresa</Form.Label>
                    <Form.Select
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      isInvalid={!!errors.empresa}
                    >
                      <option value="">Selecione uma empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nome_razao}
                        </option>
                      ))}
                    </Form.Select>
                    <ErrorMessage message={errors.empresa} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>CODVA</Form.Label>
                    <Form.Control
                      type="text"
                      name="codva"
                      placeholder="Digite o CODVA"
                      value={formData.codva}
                      onChange={handleChange}
                      isInvalid={!!errors.codva}
                    />
                    <ErrorMessage message={errors.codva} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>CODVP</Form.Label>
                    <Form.Control
                      type="text"
                      name="codvp"
                      placeholder="Digite o CODVP"
                      value={formData.codvp}
                      onChange={handleChange}
                      isInvalid={!!errors.codvp}
                    />
                    <ErrorMessage message={errors.codvp} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>CODVT</Form.Label>
                    <Form.Control
                      type="text"
                      name="codvt"
                      placeholder="Digite o CODVT"
                      value={formData.codvt}
                      onChange={handleChange}
                      isInvalid={!!errors.codvt}
                    />
                    <ErrorMessage message={errors.codvt} />
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

export default FuncaoForm;
