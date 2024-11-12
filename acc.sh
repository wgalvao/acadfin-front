#!/bin/bash

# Verifica se o argumento foi passado
if [ -z "$1" ]; then
  echo "Erro: Informe o nome da pasta como argumento."
  echo "Uso: $0 nome_da_pasta"
  exit 1
fi

# Define o caminho base e o nome da pasta com base no argumento
base_path="app/(dashboard)/pages"
folder_name="$1"
full_path="$base_path/$folder_name"

# Cria o diretório base, caso não exista
mkdir -p "$base_path"

# Cria a pasta principal dentro do caminho base
mkdir -p "$full_path"

# Cria o arquivo page.js dentro da pasta principal
touch "$full_path/page.js"

# Cria a subpasta 'create' e o arquivo page.js dentro dela
mkdir -p "$full_path/create"
touch "$full_path/create/page.js"

# Cria a subpasta '[id]/edit' e o arquivo page.js dentro dela
mkdir -p "$full_path/[id]/edit"
touch "$full_path/[id]/edit/page.js"

echo "Estrutura de diretórios e arquivos criada com sucesso em '$full_path'."
