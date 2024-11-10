const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "servicos/";

// Função para obter todos os servicos
export const fetchServicos = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar servicos");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar servicos:", error);
    throw error;
  }
};

// Função para obter um funcionário pelo ID
export const fetchServicoById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Erro ao buscar funcionário");
    }
    // return await response.json();
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    throw error;
  }
};

export const createServico = async (data) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create Servico");
  }
  return response.json();
};

// Função para atualizar um funcionário existente
export const updateServico = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar funcionário");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    throw error;
  }
};

export const deleteServico = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar funcionário");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar funcionário:", error);
    throw error;
  }
};
