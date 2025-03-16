'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '../lib/supabase';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  carregando: boolean;
  erro: string | null;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Verificar se o usuário já está autenticado ao carregar
  useEffect(() => {
    const checkUser = async () => {
      setCarregando(true);
      try {
        // Verificar se há um usuário na sessão do Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('Verificando sessão:', session ? 'Sessão ativa' : 'Sem sessão');
        
        if (session?.user) {
          console.log('Usuário autenticado:', session.user.id, session.user.email);
          
          // Buscar dados adicionais do usuário da tabela 'profiles'
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Erro ao buscar perfil:', profileError.message);
            
            // Se o perfil não existir, crie-o automaticamente
            if (profileError.code === 'PGRST116') {
              console.log('Perfil não encontrado. Criando perfil para:', session.user.email);
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.email?.split('@')[0] || 'Usuário',
                  role: session.user.email === 'agenciatdx@gmail.com' ? 'admin' : 'customer'
                });
                
              if (insertError) {
                console.error('Erro ao criar perfil:', insertError);
                throw insertError;
              }
              
              console.log('Perfil criado com sucesso');
              
              // Buscar o perfil recém-criado
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (newProfile) {
                setUsuario({
                  id: session.user.id,
                  nome: newProfile.name || session.user.email?.split('@')[0] || 'Usuário',
                  email: session.user.email || '',
                  role: newProfile.role || 'customer'
                });
              }
            } else {
              throw profileError;
            }
          } else {
            console.log('Perfil encontrado:', profile);
            
            setUsuario({
              id: session.user.id,
              nome: profile?.name || session.user.email?.split('@')[0] || 'Usuário',
              email: session.user.email || '',
              role: profile?.role || 'customer'
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar sessão do usuário:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Buscar dados adicionais do usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        setUsuario({
          id: session.user.id,
          nome: profile?.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          role: profile?.role || 'customer'
        });
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null);
      }
    });

    checkUser();
    
    // Limpar o listener quando o componente for desmontado
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login com Supabase
  const login = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    
    try {
      console.log('Tentando login com:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });
      
      if (error) {
        console.error('Erro de autenticação:', error.message);
        throw error;
      }
      
      console.log('Login bem-sucedido. Usuário:', data?.user?.id);
      
      // Verificar se o usuário tem um perfil na tabela profiles
      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError.message);
          
          // Se o perfil não existir, tente criá-lo
          if (profileError.code === 'PGRST116') { // Código para registro não encontrado
            console.log('Perfil não encontrado. Tentando criar...');
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: email,
                name: email.split('@')[0],
                role: 'customer' // Role padrão para novos usuários
              });
              
            if (insertError) {
              console.error('Erro ao criar perfil:', insertError.message);
            } else {
              console.log('Perfil criado com sucesso');
            }
          }
        } else {
          console.log('Perfil encontrado:', profileData);
        }
      }
      
      return true;
    } catch (error: any) {
      console.error('Erro completo no login:', error);
      setErro(error.message || 'Erro ao fazer login');
      return false;
    } finally {
      setCarregando(false);
    }
  };

  // Registro com Supabase
  const registrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Criar usuário no Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            name: nome
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Criar perfil na tabela 'profiles'
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: nome,
            email: email,
            role: 'customer'
          });
          
        if (profileError) throw profileError;
      }
      
      return true;
    } catch (error: any) {
      setErro(error.message || 'Erro ao registrar usuário');
      return false;
    } finally {
      setCarregando(false);
    }
  };

  // Logout com Supabase
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUsuario(null);
    } catch (error: any) {
      setErro(error.message || 'Erro ao fazer logout');
    }
  };

  // Verificar se o usuário é admin
  const isAdmin = (): boolean => {
    console.log('Verificando privilégios de admin:', { 
      usuario: usuario?.nome,
      email: usuario?.email,
      role: usuario?.role
    });
    
    const result = usuario?.role === 'admin';
    console.log('Resultado da verificação admin:', result);
    
    return result;
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout, carregando, erro, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
} 