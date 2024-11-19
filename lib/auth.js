// auth.js
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api/auth";

// Helper function to handle API errors
const handleApiError = (error) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(JSON.stringify(error.response.data));
  } else {
    console.error("An unexpected error occurred:", error);
    throw new Error("An unexpected error occurred.");
  }
};

// Function to register a new user
export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/register/`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 201) {
      return await authenticateAndFetchData(
        userData.username,
        userData.password1
      );
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// Function to register a new user
// Function to register a new user
// export async function registerUser(userData) {
//   try {
//     const response = await axios.post(`${API_URL}/register/`, userData, {
//       headers: { "Content-Type": "application/json" },
//     });
//     if (response.status === 201) {
//       return await authenticateAndFetchData(
//         userData.username,
//         userData.password1
//       );
//     }
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       // Return the error response from the backend
//       return error.response.data;
//     }
//     throw new Error("An unexpected error occurred.");
//   }
// }

// Function to authenticate and fetch user data
export async function authenticateAndFetchData(username, password) {
  try {
    const authResponse = await axios.post(
      `${API_URL}/login/`,
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    const { access, refresh } = authResponse.data;

    const userDataResponse = await axios.get(`${API_URL}/user/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    const userData = userDataResponse.data;

    Cookies.set("accessToken", access, {
      secure: true,
      sameSite: "Strict",
      expires: 1,
    });
    Cookies.set("refreshToken", refresh, {
      secure: true,
      sameSite: "Strict",
      expires: 7,
    });
    Cookies.set("userId", userData.pk, {
      secure: true,
      sameSite: "Strict",
      expires: 7,
    });
    Cookies.set("userName", userData.first_name || userData.username, {
      secure: true,
      sameSite: "Strict",
      expires: 7,
    });

    return {
      access,
      refresh,
      id: userData.pk,
      name: userData.first_name || userData.username,
    };
  } catch (error) {
    handleApiError(error);
  }
}

// Function to refresh the access token
export async function refreshToken(refreshToken) {
  try {
    const response = await axios.post(
      `${API_URL}/token/refresh/`,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.access;
  } catch (error) {
    handleApiError(error);
  }
}

// Hook to manage authentication state
export function useAuth() {
  const router = useRouter();

  const logOut = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const accessToken = Cookies.get("accessToken");
      if (refreshToken && accessToken) {
        await axios.post(
          `${API_URL}/logout/`,
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("userId", { path: "/" });
      Cookies.remove("userName", { path: "/" });
      router.push("/authentication/sign-in");
    }
  };

  const isAuthenticated = () => !!Cookies.get("accessToken");

  const getAuthHeaders = () => {
    const accessToken = Cookies.get("accessToken");
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  };

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
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw error;
  };

  const authenticatedRequest = async (config) => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await axios({
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
      });

      return response;
    } catch (error) {
      try {
        const newAccessToken = await handleAuthError(error);
        if (newAccessToken) {
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

  return { logOut, isAuthenticated, getAuthHeaders, authenticatedRequest };
}

// Hook to get user data from cookies
export function useAuthState() {
  const getUserData = () => ({
    id: Cookies.get("userId"),
    name: Cookies.get("userName"),
    isAuthenticated: !!Cookies.get("accessToken"),
  });

  return { getUserData };
}
