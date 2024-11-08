# Acadfin - Sistema de Informação Contábil

Este é o projeto **Acadfin**, um sistema de informação contábil desenvolvido como parte da disciplina de **Sistemas de Informações Contábeis** da **UNITINS**. O sistema utiliza **Next.js** no frontend e se comunica com uma API backend em **Django REST Framework** com autenticação **Simple JWT**.

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração e Instalação](#configuração-e-instalação)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

## Sobre o Projeto

O Acadfin é um sistema projetado para gerenciar informações contábeis e oferecer suporte à tomada de decisões gerenciais. Ele foi desenvolvido como parte do curso de Ciências Contábeis da UNITINS, com foco em utilizar um sistema integrado para facilitar o acesso e a visualização de dados contábeis.

## Tecnologias Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/) — Framework React para construção de aplicações modernas
- **Backend**: [Django REST Framework](https://www.django-rest-framework.org/) — API desenvolvida em Django para servir dados ao frontend
- **Autenticação**: [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/) — Autenticação segura baseada em tokens JWT
- **Gerenciamento de Estado**: Context API/React Query (opcional)
- **Ambiente de Desenvolvimento**: Visual Studio Code

## Configuração e Instalação

### Pré-requisitos

- Node.js e npm/pnpm
- Python e pip
- Ambiente virtual para o Django (recomendado)

### Passos para Configuração

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/acadfin.git
   cd acadfin
   ```

2. **Instale as dependências do frontend**

   No diretório do frontend, instale as dependências com o npm ou pnpm:

   ```
   cd frontend
   npm install
   # ou
   pnpm install

   ```

3. **Configuração do backend**

   Para configurar o backend em Django, siga o README.md localizado no diretório backend, que inclui as instruções para configurar o Simple JWT.

   **Configuração de variáveis de ambiente**

   Crie um arquivo .env.local no diretório frontend e defina as variáveis de ambiente necessárias:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Inicie o Servidor de Desenvolvimento**

   Inicie o frontend:

   ```
   npm run dev
   # ou
   pnpm dev

   ```

5. **Acesse a Aplicação**

   A aplicação estará disponível em http://localhost:3000.

## Funcionalidades

- Autenticação de usuários com Simple JWT
- Visualização de informações contábeis
- Interface para tomada de decisões gerenciais
- Painel com relatórios financeiros e contábeis

## Estruturua do projeto

```
acadfin/
├── backend/          # Backend em Django REST Framework
├── frontend/         # Frontend em Next.js
│   ├── components/   # Componentes de UI reutilizáveis
│   ├── pages/        # Páginas da aplicação Next.js
│   ├── services/     # Serviços para comunicação com a API
│   ├── utils/        # Utilitários e helpers
│   └── public/       # Arquivos estáticos
├── README.md
└── .gitignore

```
