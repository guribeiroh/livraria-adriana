-- Script para adicionar as novas colunas ao banco de dados
-- Execute este script no SQL Editor do Supabase ou via ferramentas administrativas

-- Adicionar coluna 'publisher' (editora) à tabela 'books'
ALTER TABLE books
ADD COLUMN IF NOT EXISTS publisher TEXT;

-- Adicionar coluna 'language' (idioma) à tabela 'books'
ALTER TABLE books
ADD COLUMN IF NOT EXISTS language TEXT;

-- Adicionar coluna 'format' (formato) à tabela 'books'
ALTER TABLE books
ADD COLUMN IF NOT EXISTS format TEXT;

-- Atualizar políticas de segurança para incluir as novas colunas
-- Nota: Ajuste conforme necessário de acordo com sua política existente
-- Este é um exemplo genérico:

-- Atualizar política de INSERT para incluir novos campos
CREATE OR REPLACE POLICY "Permitir inserção com campos novos" 
ON books FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Atualizar política de UPDATE para incluir novos campos
CREATE OR REPLACE POLICY "Permitir atualização com campos novos" 
ON books FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Comentários sobre os novos campos
COMMENT ON COLUMN books.publisher IS 'Editora do livro';
COMMENT ON COLUMN books.language IS 'Idioma do livro (ex: Português, Inglês)';
COMMENT ON COLUMN books.format IS 'Formato do livro (ex: Capa dura, Brochura, e-Book)';

-- Opcional: definir valores padrão para registros existentes
-- UPDATE books
-- SET publisher = 'Não informado',
--     language = 'Português',
--     format = 'Brochura'
-- WHERE publisher IS NULL AND language IS NULL AND format IS NULL; 