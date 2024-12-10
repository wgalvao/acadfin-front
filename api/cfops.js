const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "cfops/";

// Função para obter todos os CFOPs
export const fetchCfops = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}user/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar CFOPs");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar CFOPs:", error);
    throw error;
  }
};

// Função para obter um CFOP pelo ID
export const fetchCfopById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar CFOP");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar CFOP:", error);
    throw error;
  }
};

// Função para criar um novo CFOP
export const createCfop = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao criar CFOP");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar CFOP:", error);
    throw error;
  }
};

// Função para atualizar um CFOP existente
export const updateCfop = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar CFOP");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar CFOP:", error);
    throw error;
  }
};

// Função para deletar um CFOP
export const deleteCfop = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar CFOP");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar CFOP:", error);
    throw error;
  }
};
