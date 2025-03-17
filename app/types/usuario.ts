/**
 * Definição do tipo Usuario para autenticação
 */
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  admin?: boolean;
  role?: string;
  metadata?: {
    nome?: string;
    admin?: boolean;
    role?: string;
  };
}

/**
 * Dados do perfil do usuário armazenados no banco de dados
 */
export interface PerfilUsuario {
  id: string;
  user_id: string;
  nome_completo?: string;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  created_at?: string;
  updated_at?: string;
} 