-- Primeiro, vamos remover todas as políticas existentes da tabela users
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON auth.users;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON auth.users;

-- Criar políticas simplificadas sem recursão
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON auth.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
  ON auth.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Verificar e corrigir políticas na tabela profiles se necessário
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;

CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Verificar e corrigir políticas na tabela orders
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios pedidos" ON orders;

CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios pedidos"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); 