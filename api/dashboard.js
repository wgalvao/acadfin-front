const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "dashboard-stats/";

// Função para obter todos os Acumuladores
export const fetchDash = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}`);
    // console.log(response);
    // const response = await fetch(BASE_URL);
    console.log(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar dash");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dash:", error);
    throw error;
  }
};
