-- Execute este script no SQL Editor do Supabase para atribuir papel de admin

-- Substitua o email pelo seu email de login
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'SEU_EMAIL';

-- Verifique se a atualização funcionou
SELECT id, email, name, role 
FROM profiles 
WHERE email = 'SEU_EMAIL';

-- Se você não souber o email, pode listar todos os usuários
-- SELECT id, email, name, role FROM profiles;

-- Se a tabela profiles não existir ou não tiver a coluna role, execute:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'; 