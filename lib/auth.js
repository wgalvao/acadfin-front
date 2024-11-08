// auth.js
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api/auth"; // Substitua pela URL correta da sua API Django

// Função para registrar novo usuário
export async function registerUser(userData) {
  try {
    // Registra o usuário
    console.log("ddd" + userData);
    const registerResponse = await axios.post(
      `${API_URL}/register/`,
      {
        username: userData.username,
        email: userData.email,
        password1: userData.password,
        password2: userData.password,
        first_name: userData.firstName || "",
        // last_name: userData.lastName || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Se o registro for bem-sucedido, faz login automaticamente
    if (registerResponse.status === 201) {
      return await authenticateAndFetchData(
        userData.username,
        userData.password
      );
    }

    return registerResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Registration Error:", error.message);
      if (error.response) {
        // Trata diferentes tipos de erros do Django REST Framework
        if (error.response.status === 400) {
          const errorMessages = [];
          const errors = error.response.data;

          // Processa mensagens de erro do DRF
          Object.keys(errors).forEach((key) => {
            if (Array.isArray(errors[key])) {
              errorMessages.push(`${key}: ${errors[key].join(", ")}`);
            } else {
              errorMessages.push(`${key}: ${errors[key]}`);
            }
          });

          throw new Error(errorMessages.join("\n"));
        }
        throw new Error("Falha no registro. Por favor, tente novamente.");
      }
    }
    throw new Error("Ocorreu um erro inesperado durante o registro.");
  }
}

export async function authenticateAndFetchData(username, password) {
  try {
    // Passo 1: Autenticação e obtenção dos tokens
    const authResponse = await axios.post(
      `${API_URL}/login/`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { access, refresh } = authResponse.data;
    console.log("Authentication successful.");

    // Passo 2: Requisição autenticada para buscar dados do usuário
    try {
      const { data: userData } = await axios.get(`${API_URL}/user/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log("Fetched user data:", userData);

      // Armazena tokens e dados do usuário nos cookies com configurações de segurança
      Cookies.set("accessToken", access, {
        secure: true,
        sameSite: "Strict",
        expires: 1,
      }); // Expira em 1 dia
      Cookies.set("refreshToken", refresh, {
        secure: true,
        sameSite: "Strict",
        expires: 7,
      }); // Expira em 7 dias
      Cookies.set("userId", userData.pk, {
        secure: true,
        sameSite: "Strict",
        expires: 7,
      }); // Expira em 7 dia
      Cookies.set("userName", userData.firstName || userData.username, {
        secure: true,
        sameSite: "Strict",
        expires: 7,
      }); // Expira em 7 dias
      // Optional: Redirect to the dashboard after successful login
      // router.push("/");

      return {
        access,
        refresh,
        id: userData.pk,
        name: userData.first_name || userData.username,
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user data");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Authentication Error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw new Error("Autenticação falhou. Usuário ou senha inválidos.");
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred during authentication.");
    }
  }
}

export async function refreshToken(refreshToken) {
  try {
    const refreshResponse = await axios.post(
      `${API_URL}/token/refresh/`,
      {
        refresh: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return refreshResponse.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh token");
  }
}

// export function useLogOut() {
//   const router = useRouter();

//   const logOut = () => {
//     // Remove cookies on logout
//     Cookies.remove("accessToken", { path: "/" });
//     Cookies.remove("refreshToken", { path: "/" });
//     Cookies.remove("userId", { path: "/" });
//     Cookies.remove("userName", { path: "/" });

//     // Redirect to sign-in page
//     router.push("/authentication/sign-in");
//   };

//   return logOut;
// }

export function useAuth() {
  const router = useRouter();

  const logOut = async () => {
    try {
      // Pega o token de refresh dos cookies
      const refreshToken = Cookies.get("refreshToken");
      const accessToken = Cookies.get("accessToken");

      if (refreshToken && accessToken) {
        // Faz a requisição de logout na API
        await axios.post(
          `${API_URL}/logout/`,
          {
            refresh_token: refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error);
      // Continua com o processo de logout mesmo se houver erro na API
    } finally {
      // Limpa todos os cookies relacionados à autenticação
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("userId", { path: "/" });
      Cookies.remove("userName", { path: "/" });

      // Redireciona para a página de login
      router.push("/authentication/sign-in");
    }
  };

  const isAuthenticated = () => {
    return !!Cookies.get("accessToken");
  };

  const getAuthHeaders = () => {
    const accessToken = Cookies.get("accessToken");
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  };

  // Função auxiliar para lidar com erros de autenticação
  const handleAuthError = async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const newAccessToken = await refreshToken(refreshToken);
          return newAccessToken;
        }
      } catch (refreshError) {
        await logOut();
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
    }
    throw error;
  };

  // Função para fazer requisições autenticadas
  const authenticatedRequest = async (config) => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        throw new Error("Não autenticado");
      }

      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response;
    } catch (error) {
      try {
        const newAccessToken = await handleAuthError(error);
        if (newAccessToken) {
          // Tenta novamente com o novo token
          return await axios({
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        }
      } catch (retryError) {
        throw retryError;
      }
      throw error;
    }
  };

  return {
    logOut,
    isAuthenticated,
    getAuthHeaders,
    authenticatedRequest,
  };
}

// Hook personalizado para gerenciar estado de autenticação
export function useAuthState() {
  const getUserData = () => {
    return {
      id: Cookies.get("userId"),
      name: Cookies.get("userName"),
      isAuthenticated: !!Cookies.get("accessToken"),
    };
  };

  return {
    getUserData,
  };
}
