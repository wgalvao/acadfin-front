"use client";

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";
// import hooks
import useMounted from "hooks/useMounted";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

import { signIn } from "next-auth/react";

const SignIn = () => {
  const router = useRouter();
  const hasMounted = useMounted();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const result = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result.error) {
        setError("Usuário ou senha inválidos. Por favor, tente novamente.");
      } else if (result.ok) {
        router.push("/");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4 text-center">
              <Link href="/">
                <Image
                  src="/images/brand/logo/logo-primary.png"
                  className="mb-2"
                  height={40}
                  alt=""
                />
              </Link>
              <p className="mb-6">
                Por favor, entre com suas credenciais de acesso.
              </p>
            </div>
            {/* Form */}
            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                {/* Username */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Usuário</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="**************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>Lembrar-me</Form.Check.Label>
                  </Form.Check>
                </div>

                {error && <p className="text-danger">{error}</p>}

                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Acessando..." : "Acessar"}
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link href="/authentication/sign-up" className="fs-5">
                        Criar uma conta{" "}
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/authentication/forget-password"
                        className="text-inherit fs-5"
                      >
                        {/* Esqueci minha senha? */}
                      </Link>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
