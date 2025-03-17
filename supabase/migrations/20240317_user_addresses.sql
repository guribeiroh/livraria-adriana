-- Criar tabela para endereços de usuários
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  sobrenome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  rua VARCHAR(255) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(255),
  bairro VARCHAR(255) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  padrao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhorar a performance de consultas
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

-- Adicionar coluna à tabela orders para referenciar o endereço
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES user_addresses(id);

-- Adicionar políticas de segurança RLS para a tabela user_addresses
CREATE POLICY "Usuários podem ver seus próprios endereços"
  ON user_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios endereços"
  ON user_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios endereços"
  ON user_addresses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios endereços"
  ON user_addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Habilitar RLS para a tabela
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY; 