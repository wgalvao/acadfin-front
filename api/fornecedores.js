// utils/apiClient.js

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "fornecedores/";

// Função para obter todos os funcionários
export const fetchFornecedores = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar funcionários");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    throw error;
  }
};

// Função para obter um funcionário pelo ID
export const fetchFornecedorById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}${id}/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar funcionário");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    throw error;
  }
};

// Função para criar um novo funcionário
// export const createFornecedor = async (data) => {
//   try {
//     const response = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Erro ao criar funcionário");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Erro ao criar funcionário:", error);
//     throw error;
//   }
// };

// Função para criar um novo funcionário
export const createFornecedor = async (data) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);

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
    console.log(response);
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

// Função para atualizar um funcionário existente
export const updateFornecedor = async (id, data) => {
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

export const deleteFornecedor = async (id) => {
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
