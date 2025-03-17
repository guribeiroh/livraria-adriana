'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Usuario } from '../types/usuario';

interface AuthContextType {
  usuario: Usuario | null;
  perfil: any | null;
  carregando: boolean;
  isAdmin: boolean;
  erro: string | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verificarAutenticacao: () => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Verificar autenticação - pode ser chamado de qualquer componente
  const verificarAutenticacao = async (): Promise<boolean> => {
    try {
      console.log('[AuthContext] Verificando autenticação...');

      // Obter sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[AuthContext] Erro ao obter sessão:', sessionError.message);
        setErro('Erro ao verificar sessão. Por favor, tente novamente.');
        setUsuario(null);
        setPerfil(null);
        setIsAdmin(false);
        setCarregando(false);
        return false;
      }
      
      // Se não há sessão, usuário não está autenticado
      if (!session) {
        console.log('[AuthContext] Sem sessão ativa');
        setUsuario(null);
        setPerfil(null);
        setIsAdmin(false);
        setCarregando(false);
        return false;
      }

      // Obter dados do usuário
      console.log('[AuthContext] Sessão encontrada para:', session.user.email);
      
      // Converter dados para o formato Usuario
      const usuarioEncontrado: Usuario = {
        id: session.user.id,
        email: session.user.email || '',
        nome: session.user.user_metadata?.nome || session.user.email?.split('@')[0] || '',
        admin: session.user.user_metadata?.admin || false,
      };
      
      // Verificar se o usuário é admin
      const isUserAdmin = session.user.user_metadata?.admin === true;
      
      // Buscar perfil adicional do usuário se necessário
      const { data: perfilData, error: perfilError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (perfilError && perfilError.code !== 'PGRST116') {
        console.error('[AuthContext] Erro ao buscar perfil do usuário:', perfilError.message);
      } else if (perfilData) {
        console.log('[AuthContext] Perfil encontrado:', perfilData);
        setPerfil(perfilData);
        
        // Atualizar nome do usuário se disponível no perfil
        if (perfilData.name && !usuarioEncontrado.nome) {
          usuarioEncontrado.nome = perfilData.name;
        }
        
        // Verificar se é admin também pelo perfil
        if (perfilData.role === 'admin') {
          usuarioEncontrado.admin = true;
        }
      }
      
      // Atualizar estado
      setUsuario(usuarioEncontrado);
      setIsAdmin(usuarioEncontrado.admin);
      setCarregando(false);
      
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Erro ao verificar autenticação:', error.message);
      setErro('Erro ao verificar autenticação: ' + error.message);
      setUsuario(null);
      setPerfil(null);
      setIsAdmin(false);
      setCarregando(false);
      return false;
    }
  };

  // Verificar autenticação ao carregar
  useEffect(() => {
    verificarAutenticacao();
    
    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        verificarAutenticacao();
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null);
        setPerfil(null);
        setIsAdmin(false);
      }
    });
    
    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setErro(null);
      setCarregando(true);
      console.log('[AuthContext] Tentando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error('[AuthContext] Erro no login:', error.message);
        setErro(
          error.message === 'Invalid login credentials'
            ? 'Email ou senha inválidos'
            : error.message
        );
        setCarregando(false);
        return false;
      }

      // Login bem-sucedido
      console.log('[AuthContext] Login bem-sucedido para:', email);
      
      // Verificar autenticação para obter dados completos
      await verificarAutenticacao();
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Erro inesperado no login:', error.message);
      setErro('Erro no login: ' + error.message);
      setCarregando(false);
      return false;
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      setCarregando(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Limpar dados do usuário
      setUsuario(null);
      setPerfil(null);
      setIsAdmin(false);
      console.log('[AuthContext] Logout realizado com sucesso');
    } catch (error: any) {
      console.error('[AuthContext] Erro ao fazer logout:', error.message);
      setErro('Erro ao fazer logout: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  // Função de registro
  const registrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      setErro(null);
      setCarregando(true);
      
      // Registrar usuário com Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome: nome,
            admin: false,
          },
        },
      });

      if (error) {
        console.error('[AuthContext] Erro ao registrar:', error.message);
        setErro('Erro ao registrar: ' + error.message);
        return false;
      }

      // Criar perfil do usuário se o registro foi bem-sucedido
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: nome,
            email: email,
            role: 'customer',
          });

        if (profileError) {
          console.error('[AuthContext] Erro ao criar perfil:', profileError.message);
        }
      }

      console.log('[AuthContext] Registro bem-sucedido');
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Erro inesperado no registro:', error.message);
      setErro('Erro no registro: ' + error.message);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const value = {
    usuario,
    perfil,
    carregando,
    isAdmin,
    erro,
    login,
    logout,
    verificarAutenticacao,
    registrar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 