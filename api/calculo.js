const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL + "calcular-decimo-terceiro/";

export const calculateDecimoTerceiro = async (data) => {
  console.log("Dados enviados para o cálculo:", data);

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Verifica se a resposta foi bem-sucedida
    if (response.ok) {
      // Verifica se a resposta contém conteúdo antes de chamar .json()
      if (response.status !== 204) {
        const responseData = await response.json();
        console.log("Resposta da API:", responseData);
        return responseData; // Retorna o JSON da resposta
      } else {
        console.log("Resposta sem conteúdo (204 No Content)");
        return { success: true }; // Retorna um objeto indicando sucesso sem conteúdo
      }
    } else {
      // Tenta extrair uma mensagem de erro, caso exista um corpo de resposta
      let errorDetails = {};
      try {
        errorDetails = await response.json();
      } catch (e) {
        // Se não for possível fazer o parse do JSON, usa o status ou texto da resposta
        errorDetails.message = response.statusText || "Erro desconhecido";
      }

      throw new Error(
        `Erro ao calcular décimo terceiro: ${errorDetails.message}`
      );
    }
  } catch (error) {
    console.error("Erro ao calcular décimo terceiro:", error);
    throw error;
  }
};
