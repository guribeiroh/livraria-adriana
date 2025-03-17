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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
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
  const [verificacaoInicial, setVerificacaoInicial] = useState(false);

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
        return false;
      }
      
      // Se não há sessão, usuário não está autenticado
      if (!session) {
        console.log('[AuthContext] Sem sessão ativa');
        setUsuario(null);
        setPerfil(null);
        setIsAdmin(false);
        return false;
      }

      // Obter dados do usuário
      console.log('[AuthContext] Sessão encontrada para:', session.user.email);
      
      // Converter dados para o formato Usuario
      const usuarioEncontrado: Usuario = {
        id: session.user.id,
        email: session.user.email || '',
        nome: session.user.user_metadata?.nome || '',
        admin: session.user.user_metadata?.admin || false,
      };
      
      // Verificar se é admin
      setIsAdmin(!!usuarioEncontrado.admin);
      
      // Obter perfil do usuário do banco de dados
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', usuarioEncontrado.id)
        .single();
        
      if (perfilError && perfilError.code !== 'PGRST116') {
        console.warn('[AuthContext] Erro ao buscar perfil:', perfilError.message);
      } else if (perfilData) {
        setPerfil(perfilData);
        console.log('[AuthContext] Perfil carregado');
      }
      
      // Atualizar estado
      setUsuario(usuarioEncontrado);
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Erro ao verificar autenticação:', error.message);
      setErro('Erro ao verificar sessão: ' + error.message);
      return false;
    }
  };

  // Efeito para verificar autenticação na inicialização
  useEffect(() => {
    const inicializar = async () => {
      try {
        if (verificacaoInicial) return;
        setVerificacaoInicial(true);

        // Defina um timeout para garantir que não ficaremos presos em carregamento
        const timeoutId = setTimeout(() => {
          if (carregando) {
            console.warn('[AuthContext] Timeout de inicialização - finalizando carregamento');
            setCarregando(false);
          }
        }, 5000);

        // Verificar autenticação atual
        await verificarAutenticacao();
        setCarregando(false);
        
        // Configurar listener para mudanças na autenticação
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('[AuthContext] Evento de autenticação:', event);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (session) {
                // Converter dados para o formato Usuario
                const usuarioAtualizado: Usuario = {
                  id: session.user.id,
                  email: session.user.email || '',
                  nome: session.user.user_metadata?.nome || '',
                  admin: session.user.user_metadata?.admin || false,
                };
                
                setUsuario(usuarioAtualizado);
                setIsAdmin(!!usuarioAtualizado.admin);
                
                // Obter perfil atualizado
                const { data: perfilData } = await supabase
                  .from('perfis')
                  .select('*')
                  .eq('id', usuarioAtualizado.id)
                  .single();
                  
                if (perfilData) {
                  setPerfil(perfilData);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              setUsuario(null);
              setPerfil(null);
              setIsAdmin(false);
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        // Cleanup da inscrição
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('[AuthContext] Erro na inicialização:', error.message);
        setCarregando(false);
        setErro('Erro na inicialização: ' + error.message);
      }
    };

    inicializar();
  }, [verificacaoInicial]);

  // Função de login
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setErro(null);
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
      return false;
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      setErro(null);
      console.log('[AuthContext] Realizando logout');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AuthContext] Erro no logout:', error.message);
        setErro('Erro ao fazer logout: ' + error.message);
        return;
      }
      
      // Limpar dados de sessão após logout
      setUsuario(null);
      setPerfil(null);
      setIsAdmin(false);
      console.log('[AuthContext] Logout concluído com sucesso');
      
      // Redirecionar para home após logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error('[AuthContext] Erro inesperado no logout:', error.message);
      setErro('Erro no logout: ' + error.message);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 