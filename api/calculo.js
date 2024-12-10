const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL + "calcular-decimo-terceiro/";
export const calcularDecimo = async (data) => {
  console.log(data);
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      // Tenta extrair uma mensagem de erro, caso exista um corpo de resposta
      let errorDetails = {};
      try {
        errorDetails = await response.json();
      } catch (e) {
        // Se não for possível fazer o parse do JSON, usa o status ou texto da resposta
        errorDetails.message = response.statusText || "Erro desconhecido";
      }

      throw new Error(`Erro ao criar funcionário: ${errorDetails.message}`);
    }

    // Verifica se a resposta contém conteúdo antes de chamar .json()
    if (response.status !== 204) {
      //   return await response.json(); // Retorna o JSON caso não seja um "204 No Content"
      return await response; // Retorna o JSON caso não seja um "204 No Content"
    } else {
      return { success: true }; // Para o caso de uma resposta 204 sem conteúdo
    }
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    throw error;
  }
};
