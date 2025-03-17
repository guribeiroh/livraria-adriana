'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Redirect from './Redirect';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { usuario, carregando, isAdmin } = useAuth();
  const pathname = usePathname();
  const [senhaAutenticada, setSenhaAutenticada] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [redirecionarPara, setRedirecionarPara] = useState<string | null>(null);
  const [verificacaoConcluida, setVerificacaoConcluida] = useState(false);

  // Lista de páginas públicas que não requerem autenticação
  const paginasPublicas = ['/', '/login', '/registro', '/diagnose', '/about', '/contato', '/duvidas'];
  const ehPaginaPublica = paginasPublicas.some(p => pathname === p || pathname.startsWith(`${p}/`));

  // Anti-loop: garantir que a verificação não fique rodando indefinidamente
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (verificando && !verificacaoConcluida) {
        console.log('[RouteGuard] Timeout na verificação - continuando para evitar loop');
        setVerificando(false);
        setVerificacaoConcluida(true);
      }
    }, 3000); // 3 segundos máximo

    return () => clearTimeout(timeout);
  }, [verificando, verificacaoConcluida]);

  // Verificação simplificada de autenticação
  useEffect(() => {
    const verificarAcesso = async () => {
      try {
        // Se estamos em uma página pública, não precisamos verificar autenticação
        if (ehPaginaPublica) {
          console.log('[RouteGuard] Página pública - acesso liberado');
          setVerificando(false);
          setVerificacaoConcluida(true);
          return;
        }

        // Se já completamos uma verificação, não verificar novamente
        if (verificacaoConcluida) {
          return;
        }

        // Se o carregamento inicial ainda não foi concluído, aguardar
        if (carregando) {
          return;
        }

        // Se o usuário não está autenticado, preparar redirecionamento
        if (!usuario) {
          console.log('[RouteGuard] Acesso negado para:', pathname);
          
          // Armazenar o caminho atual para redirecionamento após login
          if (typeof window !== 'undefined' && pathname !== '/login') {
            sessionStorage.setItem('redirectAfterLogin', pathname);
          }
          
          // Definir destino de redirecionamento (apenas se não estivermos já no login)
          if (pathname !== '/login') {
            setRedirecionarPara(`/login?next=${encodeURIComponent(pathname)}`);
          }
        } else {
          console.log('[RouteGuard] Acesso permitido para:', pathname);
        }
        
        setVerificando(false);
        setVerificacaoConcluida(true);
      } catch (error) {
        console.error('[RouteGuard] Erro ao verificar autenticação:', error);
        setVerificando(false);
        setVerificacaoConcluida(true);
      }
    };

    if (!verificacaoConcluida) {
      verificarAcesso();
    }
  }, [usuario, carregando, pathname, ehPaginaPublica, verificacaoConcluida]);

  // Verificação para o painel admin
  if (requireAdmin) {
    // Verificar se a senha já foi autenticada nesta sessão
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const adminAutenticado = sessionStorage.getItem('adminAutenticado');
        if (adminAutenticado === 'true') {
          setSenhaAutenticada(true);
        }
      }
    }, []);

    // Se ainda não autenticado, mostrar tela de login admin
    if (!senhaAutenticada) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Painel Administrativo</h1>
            <p className="mb-4 text-gray-600 text-center">Digite a senha para acessar o painel</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const senha = (e.currentTarget.elements.namedItem('senha') as HTMLInputElement).value;
              
              if (senha === 'Lucas2205') {
                // Salvar autenticação na sessão
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('adminAutenticado', 'true');
                }
                setSenhaAutenticada(true);
              } else {
                alert('Senha incorreta!');
              }
            }}>
              <div className="mb-4">
                <input 
                  type="password" 
                  name="senha"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Digite a senha"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Acessar
              </button>
            </form>
          </div>
        </div>
      );
    }
    
    // Se autenticado, mostrar conteúdo do admin
    return <>{children}</>;
  }

  // Se está redirecionando, mostrar componente de redirecionamento
  if (redirecionarPara && verificacaoConcluida) {
    return <Redirect to={redirecionarPara} />;
  }

  // Exibir indicador de carregamento durante a verificação
  if (verificando && !verificacaoConcluida) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-blue-600">Verificando acesso...</p>
      </div>
    );
  }

  // Para páginas públicas ou usuário autenticado, renderizar o conteúdo
  return <>{children}</>;
} 