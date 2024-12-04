"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Col, Row, Container, Form, Button, Card } from "react-bootstrap";
import InputMask from "react-input-mask";
import { Save, Briefcase } from "lucide-react";
import { PageHeading } from "widgets";
import { validationSchemaSindicato } from "utils/validations"; // Assume-se que validationSchemaSindicato está definido para validar campos de sindicato
import ErrorMessage from "sub-components/ErrorMessage";
import { useSession, signOut } from "next-auth/react";
import {
  fetchSindicatoById,
  createSindicato,
  updateSindicato,
} from "@/api/sindicatos";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resolve } from "styled-jsx/css";

const Home = () => {
  const { id } = useParams(); // Captura o ID da URL
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [isCreating, setIsCreating] = useState(!id);
  const [loading, setLoading] = useState(false); // State for loading button

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchSindicatoById(id)
        .then((data) => {
          setFormData({ ...data });
          setIsCreating(false); // Set to false since we are editing)
        })
        .catch((error) =>
          console.error("Erro ao carregar dados do sindicato:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = validationSchemaSindicato.safeParse(formData);

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors(errorMessages);
      //   alert("Verifique os erros no formulário.");
      toast.error("Verifique os erros no formulário.", { autoClose: 2000 });
    } else {
      setLoading(true);
      try {
        console.log("Form Data:", formData); // Log form data

        let response;
        if (isCreating) {
          // Chama createSindicato com apenas formData
          response = await createSindicato(formData);
        } else {
          // Chama updateSindicato com id e formData
          response = await updateSindicato(id, formData);
        }

        console.log("API Response:", response); // Log API response
        if (response) {
          //   alert(
          //     `Sindicato ${isCreating ? "cadastrado" : "atualizado"} com sucesso!`
          //   );
          toast.success(
            `Sindicato ${
              isCreating ? "cadastrado" : "atualizado"
            } com sucesso!`,
            { autoClose: 2000 }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/pages/sindicatos");
        } else {
          toast.error("Ocorreu um erro ao tentar enviar o formulário.", {
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        // alert("Ocorreu um erro ao tentar enviar o formulário.");
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
      <PageHeading heading="Sindicatos" />
      <Row className="justify-content-center">
        <Col md={6} sm={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center">
                <Briefcase />
                {isCreating ? "Cadastro de sindicatos" : "Edição de sindicatos"}
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
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco"
                      placeholder="Digite o endereço"
                      value={formData.endereco}
                      onChange={handleChange}
                      isInvalid={!!errors.endereco}
                    />
                    <ErrorMessage message={errors.endereco} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <InputMask
                      mask="(99) 9999-9999"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Form.Control
                          {...inputProps}
                          type="text"
                          placeholder="Digite o telefone"
                          isInvalid={!!errors.telefone}
                        />
                      )}
                    </InputMask>
                    <ErrorMessage message={errors.telefone} />
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
