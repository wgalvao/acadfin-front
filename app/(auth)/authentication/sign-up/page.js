"use client";

// importar bibliotecas de módulos node
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";
import { registerUser } from "lib/auth";
import { useRouter } from "next/navigation";

// importar hooks
import useMounted from "hooks/useMounted";

const SignUp = () => {
  const router = useRouter();
  const hasMounted = useMounted();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    firstName: "",
    lastName: "",
    terms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Tenta registrar o usuário
      const response = await registerUser(formData);
      console.log(response);
      // Check if the response contains errors
      if (response && response.errors) {
        const backendErrors = {};
        for (const [field, messages] of Object.entries(response.errors)) {
          backendErrors[field] = messages[0]; // Assuming the first message is the most relevant
        }
        setErrors(backendErrors);
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        router.push("/");
      }
      // If successful, redirect to the home page
    } catch (error) {
      // Handle unexpected errors
      setErrors({ general: error.message });
      setIsLoading(false);
    }
  };
  const validateForm = (data) => {
    const newErrors = {};

    if (!data.username) {
      newErrors.username = "Nome de usuário é obrigatório";
    }

    if (!data.email) {
      newErrors.email = "E-mail é obrigatório";
    }

    if (!data.password1) {
      newErrors.password1 = "Senha é obrigatória";
    }

    if (data.password1 !== data.password2) {
      newErrors.password2 = "As senhas não coincidem";
    }

    // if (!data.terms) {
    //   newErrors.terms = "Você precisa aceitar os termos de serviço";
    // }
    console.log(newErrors);
    return newErrors;
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4 text-center">
              <Link href="/">
                <Image
                  src="/images/brand/logo/logo-primary.png"
                  height={40}
                  className="mb-2"
                  alt=""
                />
              </Link>
              <p className="mb-6">
                Por favor, insira suas informações de usuário.
              </p>
            </div>
            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="mb-3 text-danger">{errors.general}</div>
                )}

                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Nome de usuário</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Informe tal como o @ do instagram. Sem acentos ou espaços"
                    value={formData.username}
                    onChange={handleInputChange}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Digite seu endereço aqui"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password1">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password1"
                    placeholder="**************"
                    value={formData.password1}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password1}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password1}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password2"
                    placeholder="**************"
                    value={formData.password2}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password2}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    isInvalid={!!errors.terms}
                  >
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>
                      Eu concordo com os{" "}
                      <Link href="#"> Termos de Serviço </Link> e{" "}
                      <Link href="#"> Política de Privacidade.</Link>
                    </Form.Check.Label>
                    <Form.Control.Feedback type="invalid">
                      {errors.terms}
                    </Form.Control.Feedback>
                  </Form.Check>
                </div>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta Gratuita"}
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
