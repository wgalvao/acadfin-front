const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "plano-contas/";

// Função para obter todos os Planos de Contas
export const fetchPlanoContas = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}user/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar planos de contas");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar planos de contas:", error);
    throw error;
  }
};

// Função para obter um Plano de Contas pelo ID
export const fetchPlanoContaById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar plano de contas");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar plano de contas:", error);
    throw error;
  }
};

// Função para criar um novo Plano de Contas
export const createPlanoConta = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao criar plano de contas");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar plano de contas:", error);
    throw error;
  }
};

// Função para atualizar um Plano de Contas existente
export const updatePlanoConta = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar plano de contas");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar plano de contas:", error);
    throw error;
  }
};

// Função para deletar um Plano de Contas
export const deletePlanoConta = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar plano de contas");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar plano de contas:", error);
    throw error;
  }
};
