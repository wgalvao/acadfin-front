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

  estado_civil: z.string().min(4, "Estado civil é obrigatório"),
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
  // email: z.string().email({ message: "Email inválido" }),
  // cliente: z.string().min(3, {
  //   message: "Proprietário é obrigatório e deve ter pelo menos 3 caracteres",
  // }),
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

export const validationSchemaCargo = z.object({
  salario: z.string().min(3, {
    message: "Salário é obrigatório",
  }),
  cargo: z.string().min(3, {
    message: "Descrição é obrigatória",
  }),
});

export const validationSchemaFuncao = z.object({
  nome: z.string().min(3, {
    message: "Nome é obrigatório",
  }),
});

export const validationSchemaBaseCalculo = z.object({
  nome: z.string().min(3, {
    message: "Nome é obrigatório",
  }),
  // percentual: z.number().min(0, {
  //   message: "Percentual é obrigatório",
  // }),
  // valor_minimo: z.number().min(0, {
  //   message: "Valor mínimo é obrigatório",
  // }),
  // valor_maximo: z.number().min(0, {
  //   message: "Valor máximo é obrigatório",
  // }),
  // tipo: z.string().min(3, {
  //   message: "Tipo é obrigatório",
  // }),
});

export const validationSchemaCliente = z.object({
  nome: z.string().min(3, {
    message: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  desde: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data inválida",
  }),
  taxa_desconto: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Taxa de desconto deve ser um número válido",
  }),
  limite_credito: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Limite de crédito deve ser um número válido",
  }),
  observacao: z.string().optional(),
});

export const validationSchemaFornecedor = z.object({
  // pessoa: z.string().min(0, {
  //   message: "Pessoa é obrigatório e deve ter pelo menos 3 caracteres",
  // }),
  desde: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data inválida",
  }),
  observacao: z.string().optional(),
});

export const validationSchemaConta = z.object({
  conta: z.string().min(3, {
    message: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  saldo: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Saldo deve ser um número válido",
  }),
  descricao: z.string().min(3, {
    message: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
  }),
});

export const validationSchemaAliquota = z.object({
  tipo_imposto: z.string().min(3, {
    tipo: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  percentual: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Saldo deve ser um número válido",
  }),
  data_inicio: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data inválida",
  }),
  data_fim: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data inválida",
  }),
  descricao: z.string().min(3, {
    message: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
  }),
});

export const validationSchemaAcumulador = z.object({
  acumulador: z.string().min(3, {
    message: "Acumulador é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  tipo: z.string().min(3, {
    message: "Tipo é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  valor: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Taxa de desconto deve ser um número válido",
  }),
  descricao: z.string().optional(),
});

export const validationSchemaCfop = z.object({
  codigo: z.string().min(3, {
    message: "Código é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  tipo_operacao: z.string().min(3, {
    message: "Tipo é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  descricao: z.string().optional(),
});

export const validationSchemaPlanoConta = z.object({
  codigo_contas: z.string().min(3, {
    message: "Código é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  nome_conta: z.string().min(3, {
    message: "Nome da conta é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  tipo_conta: z.string().min(3, {
    message: "Nível é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  nivel: z.string().min(3, {
    message: "Nível é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  conta_pai: z.string().min(3, {
    message: "Conta pai é obrigatório e deve ter pelo menos 3 caracteres",
  }),
  descricao: z.string().optional(),
});
