"use client";

// Importações de bibliotecas e módulos
import { Fragment, useState, useEffect } from "react";
import { Container, Col, Row, Card, Spinner } from "react-bootstrap";
import Link from "next/link";
import { Briefcase } from "react-bootstrap-icons";
import { useSession } from "next-auth/react";

// Importação de dados
import { fetchDash } from "api/dashboard";

const StatCard = ({ title, value, icon: Icon }) => (
  <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-0">{title}</h4>
          </div>
          <div className="icon-shape icon-md bg-light-primary text-primary rounded-2">
            <Icon size={18} />
          </div>
        </div>
        <div>
          <h1 className="fw-bold">{value}</h1>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const Home = () => {
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState(null);
  const { data: session, status } = useSession();

  // Buscar dados do dashboard
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.user?.pk) {
        try {
          const data = await fetchDash(session.user.pk);
          setStats(data);
          setUsername(session.user.username);
        } catch (error) {
          console.error("Erro ao buscar dados do dashboard:", error);
          setStats({}); // Evitar spinner infinito
        }
      }
    };

    fetchData();
  }, [session, status]);

  // Verifica se os dados ainda estão sendo carregados
  if (status === "loading" || (status === "authenticated" && stats === null)) {
    return (
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "100vh" }}
            >
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Renderiza mensagem de erro ou conteúdo vazio
  if (status === "authenticated" && stats && Object.keys(stats).length === 0) {
    return (
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col>
            <div className="text-center">
              <p>Não há dados disponíveis para exibir.</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0 text-white">Dashboard de {username}</h3>
              <Link href="#" className="btn btn-white">
                ...
              </Link>
            </div>
          </Col>

          {/* Cartões com as estatísticas */}
          <StatCard
            title="Empresas"
            value={stats?.total_empresas}
            icon={Briefcase}
          />
          <StatCard
            title="Clientes"
            value={stats?.total_clientes}
            icon={Briefcase}
          />
          <StatCard
            title="Funcionários"
            value={stats?.total_funcionarios}
            icon={Briefcase}
          />
          <StatCard
            title="Fornecedores"
            value={stats?.total_fornecedores}
            icon={Briefcase}
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Home;
