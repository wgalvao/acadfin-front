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
    password: "",
    confirmPassword: "",
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
      // Validações locais primeiro
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Tenta registrar o usuário
      const response = await registerUser(formData);

      // Se bem sucedido, redireciona para a dashboard ou página inicial
      router.push("/");
      console.log("era pra ter ido");
    } catch (error) {
      // Trata erros de registro
      if (error.message.includes(":")) {
        // Processa erros do backend em formato de objeto
        const errorLines = error.message.split("\n");
        const newErrors = {};

        errorLines.forEach((line) => {
          const [field, message] = line.split(": ");
          newErrors[field] = message;
        });

        setErrors(newErrors);
      } else {
        // Erro geral
        setErrors({ general: error.message });
      }
    } finally {
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

    if (!data.password) {
      newErrors.password = "Senha é obrigatória";
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
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
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Nome de usuário</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Nome de Usuário"
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

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="**************"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="**************"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* <div className="mb-3">
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
                </div> */}

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
