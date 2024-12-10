const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "jornadas/";

// Função para obter todas as jornadas
export const fetchJornadas = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}user/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar jornadas");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar jornadas:", error);
    throw error;
  }
};

// Função para obter uma jornada pelo ID
export const fetchJornadaById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Erro ao buscar jornada");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar jornada:", error);
    throw error;
  }
};

export const createJornada = async (data) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create Jornada");
  }
  return response.json();
};

// Função para atualizar uma jornada existente
export const updateJornada = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar jornada");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar jornada:", error);
    throw error;
  }
};

export const deleteJornada = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar jornada");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar jornada:", error);
    throw error;
  }
};
