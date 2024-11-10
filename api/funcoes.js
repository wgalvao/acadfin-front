const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "funcoes/";

// Função para obter todas as funções
export const fetchFuncoes = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar funções");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar funções:", error);
    throw error;
  }
};

// Função para obter uma função pelo ID
export const fetchFuncaoById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Erro ao buscar função");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar função:", error);
    throw error;
  }
};

export const createFuncao = async (data) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create Função");
  }
  return response.json();
};

// Função para atualizar uma função existente
export const updateFuncao = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar função");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar função:", error);
    throw error;
  }
};

export const deleteFuncao = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar função");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar função:", error);
    throw error;
  }
};
