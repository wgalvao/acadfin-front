const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "acumuladores/";

// Função para obter todos os Acumuladores
export const fetchAcumuladores = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar acumuladores");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar acumuladores:", error);
    throw error;
  }
};

// Função para obter um Acumulador pelo ID
export const fetchAcumuladorById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar acumulador");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar acumulador:", error);
    throw error;
  }
};

// Função para criar um novo Acumulador
export const createAcumulador = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao criar acumulador");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao criar acumulador:", error);
    throw error;
  }
};

// Função para atualizar um Acumulador existente
export const updateAcumulador = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar acumulador");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar acumulador:", error);
    throw error;
  }
};

// Função para deletar um Acumulador
export const deleteAcumulador = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar acumulador");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar acumulador:", error);
    throw error;
  }
};
