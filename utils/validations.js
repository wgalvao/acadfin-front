import { z } from "zod";

export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const cepRegex = /^\d{5}-\d{3}$/;
export const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;

export const validationSchema = z.object({
  cpf: z.string().regex(cpfRegex, {
    message: "CPF inválido, formato esperado: 000.000.000-00",
  }),
  telefone: z.string().regex(phoneRegex, {
    message: "Número de telefone inválido, formato esperado: (00) 0000-0000",
  }),
  celular: z.string().regex(phoneRegex, {
    message: "Número de celular inválido, formato esperado: (00) 90000-0000",
  }),
  cep: z.string().regex(cepRegex, {
    message: "CEP inválido, formato esperado: 00000-000",
  }),
  estado: z.string().min(4, "Estado é obrigatório"),
  nome: z.string().min(4, "Nome completo é obrigatório"),
  data_nasc: z.string().min(4, "Data de nascimento é obrigatória"),
});

export const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const validationSchemaEmpresa = z.object({
  cnpj: z.string().regex(cnpjRegex, {
    message: "CNPJ inválido, formato esperado: 00.000.000/0000-00",
  }),
  nome_razao: z.string().min(3, {
    message: "Razão social é obrigatória e deve ter pelo menos 3 caracteres",
  }),
  nome_fantasia: z.string().min(3, {
    message: "Nome fantasia é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  endereco: z.string().min(5, {
    message: "Endereço é obrigatório e deve ter pelo menos 5 caracteres",
  }),
  bairro: z.string().min(3, {
    message: "Bairro é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  cidade: z.string().min(3, {
    message: "Cidade é obrigatória e deve ter pelo menos 3 caracteres",
  }),
  estado: z.string().min(2, {
    message: "Estado é obrigatório e deve ser uma sigla de 2 letras",
  }),
  cep: z
    .string()
    .regex(cepRegex, { message: "CEP inválido, formato esperado: 00000-000" }),
  telefone: z.string().regex(phoneRegex, {
    message: "Número de telefone inválido, formato esperado: (00) 0000-0000",
  }),
  email: z.string().email({ message: "Email inválido" }),
  inscricao_estadual: z.string().optional(),
});

export const validationSchemaSindicato = z.object({
  nome: z.string().min(3, {
    message: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  telefone: z.string().min(3, {
    message: "Telefone é obrigatório",
  }),
});

export const validationSchemaServico = z.object({
  codigo: z.string().min(3, {
    message: "Código é obrigatório",
  }),
  valor: z.string().min(3, {
    message: "Valor é obrigatório",
  }),
});

export const validationSchemaCentroCusto = z.object({
  codigo: z.string().min(3, {
    message: "Código é obrigatório",
  }),
});
