'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  carregando: boolean;
  erro: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar usuário do localStorage quando o componente montar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        const usuarioParseado = JSON.parse(usuarioSalvo);
        setUsuario(usuarioParseado);
      } catch (error) {
        console.error('Erro ao carregar o usuário:', error);
        localStorage.removeItem('usuario');
      }
    }
    setCarregando(false);
  }, []);

  // Simulação de uma API de autenticação
  const login = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Em uma aplicação real, isso seria uma chamada API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular usuários (em uma aplicação real, isso viria do backend)
          const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          
          const usuarioEncontrado = usuarios.find(
            (u: { email: string; senha: string }) => 
              u.email === email && u.senha === senha
          );
          
          if (usuarioEncontrado) {
            // Não enviar a senha para o estado
            const { senha, ...usuarioSemSenha } = usuarioEncontrado;
            setUsuario(usuarioSemSenha);
            localStorage.setItem('usuario', JSON.stringify(usuarioSemSenha));
            setCarregando(false);
            resolve(true);
          } else {
            setErro('Email ou senha incorretos');
            setCarregando(false);
            resolve(false);
          }
        }, 1000); // Simulação de delay de rede
      });
    } catch (error) {
      setErro('Ocorreu um erro durante o login. Tente novamente.');
      setCarregando(false);
      return false;
    }
  };

  const registrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Em uma aplicação real, isso seria uma chamada API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular usuários (em uma aplicação real, isso viria do backend)
          const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          
          // Verificar se o email já está em uso
          const emailExistente = usuarios.some(
            (u: { email: string }) => u.email === email
          );
          
          if (emailExistente) {
            setErro('Este email já está em uso');
            setCarregando(false);
            resolve(false);
            return;
          }
          
          // Criar novo usuário
          const novoUsuario = {
            id: Date.now().toString(),
            nome,
            email,
            senha // Em uma aplicação real, a senha seria hash
          };
          
          // Adicionar à lista de usuários
          usuarios.push(novoUsuario);
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
          
          // Não enviar a senha para o estado
          const { senha: _, ...usuarioSemSenha } = novoUsuario;
          setUsuario(usuarioSemSenha);
          localStorage.setItem('usuario', JSON.stringify(usuarioSemSenha));
          
          setCarregando(false);
          resolve(true);
        }, 1000); // Simulação de delay de rede
      });
    } catch (error) {
      setErro('Ocorreu um erro durante o registro. Tente novamente.');
      setCarregando(false);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        registrar,
        logout,
        carregando,
        erro
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 