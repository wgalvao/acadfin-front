const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "cargos/";

// Função para obter todos os cargos
export const fetchCargos = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar cargos");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    throw error;
  }
};

// Função para obter um cargo pelo ID
export const fetchCargoById = async (id) => {
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

export const createCargo = async (data) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create Cargo");
  }
  return response.json();
};

// Função para atualizar um cargo existente
export const updateCargo = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar cargo");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);
    throw error;
  }
};

export const deleteCargo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar cargo");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar cargo:", error);
    throw error;
  }
};
