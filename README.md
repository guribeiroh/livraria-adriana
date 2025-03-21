# Livraria Online

Este é um projeto de uma livraria online desenvolvida com Next.js, utilizando Supabase como banco de dados.

## Configuração do Banco de Dados

### Preparar o Supabase

1. Crie uma conta em [Supabase](https://supabase.io)
2. Crie um novo projeto
3. Anote a URL e a chave anônima do seu projeto
4. Crie as tabelas do banco de dados usando os scripts em `supabase/schema.sql`
5. Insira dados de exemplo usando os scripts em `supabase/seed.sql`

### Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Preencha as variáveis de ambiente com suas credenciais do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

## Executando o Projeto

Para instalar as dependências:
```bash
npm install
# ou
yarn install
```

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Armazena informações dos usuários
- **categories**: Categorias de livros
- **books**: Cadastro de livros disponíveis
- **reviews**: Avaliações dos usuários para os livros
- **orders**: Pedidos realizados
- **order_items**: Itens incluídos em cada pedido
- **wishlist**: Lista de desejos dos usuários
- **coupons**: Cupons de desconto
- **site_settings**: Configurações gerais do site

### Relações

- Um livro pertence a uma categoria
- Um usuário pode fazer muitos pedidos
- Um pedido contém vários itens de pedido
- Um usuário pode avaliar muitos livros
- Um livro pode ter muitas avaliações
- Um usuário pode ter muitos livros na lista de desejos

## Funcionalidades

- Listagem de livros por categoria
- Busca de livros
- Carrinho de compras
- Checkout e processamento de pedidos
- Lista de desejos
- Avaliações de livros
- Painel administrativo

## Contribuição

Para contribuir com este projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

Agradecemos a sua contribuição!
