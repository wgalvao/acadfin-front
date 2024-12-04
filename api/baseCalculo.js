const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "base-calculos/";

// Função para obter todas as bases de cálculo
export const fetchBaseCalculos = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}user/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar bases de cálculo");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar bases de cálculo:", error);
    throw error;
  }
};

// Função para obter uma base de cálculo pelo ID
export const fetchBaseCalculoById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Erro ao buscar base de cálculo");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar base de cálculo:", error);
    throw error;
  }
};

export const createBaseCalculo = async (data) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create Base de Cálculo");
  }
  return response.json();
};

// Função para atualizar uma base de cálculo existente
export const updateBaseCalculo = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar base de cálculo");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar base de cálculo:", error);
    throw error;
  }
};

export const deleteBaseCalculo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar base de cálculo");
    }

    // Retorna um valor de confirmação simples se não houver corpo de resposta
    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Erro ao deletar base de cálculo:", error);
    throw error;
  }
};
