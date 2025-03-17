-- Primeiro, desativar RLS temporariamente para orders
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes na tabela orders
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Usuários podem excluir seus próprios pedidos" ON orders;

-- Reativar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Criar políticas simplificadas e diretas, sem recursão
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON orders
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem criar seus próprios pedidos"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Política para administradores visualizarem todos os pedidos
CREATE POLICY "Administradores podem ver todos os pedidos" 
  ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  ); 