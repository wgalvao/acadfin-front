const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "aliquotas/";

// Função para obter todos os Contas
export const fetchAliquotas = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar Contas");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    throw error;
  }
};

// Função para obter um cargo pelo ID
export const fetchAliquotaById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Erro ao buscar cargo");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar cargo:", error);
    throw error;
  }
};

export const createAliquota = async (data) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create Aliquota");
  }
  return response.json();
};

// Função para atualizar um Aliquota existente
export const updateAliquota = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar Aliquota");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);
    throw error;
  }
};

export const deleteAliquota = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar Conta");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar Conta:", error);
    throw error;
  }
};
