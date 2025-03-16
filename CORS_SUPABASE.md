# Configuração de CORS no Supabase

Este documento detalha como configurar corretamente o CORS (Cross-Origin Resource Sharing) no Supabase para permitir a comunicação entre o backend Supabase e o frontend hospedado na Vercel.

## Domínios da Vercel

Os seguintes domínios foram configurados para ter acesso ao Supabase:

```
https://livraria-adriana-erp7.vercel.app
https://livraria-adriana-erp7-git-master-gustavos-projects-f6f01993.vercel.app
https://livraria-adriana-erp7-2y9777l9o-gustavos-projects-f6f01993.vercel.app
```

## Configuração via SQL

A configuração do CORS foi realizada através da execução do seguinte comando SQL no Editor SQL do Supabase:

```sql
ALTER ROLE authenticator SET pgrst.server_cors_allowed_origins = 'https://livraria-adriana-erp7.vercel.app,https://livraria-adriana-erp7-git-master-gustavos-projects-f6f01993.vercel.app,https://livraria-adriana-erp7-2y9777l9o-gustavos-projects-f6f01993.vercel.app';

NOTIFY pgrst, 'reload config';
```

## Notas Importantes

1. Esta configuração afeta apenas a API de Dados (PostgREST)
2. Para Auth e outras funcionalidades do Supabase, é necessário configurar as URLs de redirecionamento na seção de Autenticação
3. Caso novos domínios sejam adicionados, este comando SQL deve ser executado novamente com todos os domínios
4. Não utilizar espaços entre os domínios na lista separada por vírgulas

## Verificação

Para verificar se o CORS está funcionando corretamente, monitore as requisições no console do navegador. Não devem aparecer erros de CORS quando a aplicação tentar se comunicar com o Supabase. 