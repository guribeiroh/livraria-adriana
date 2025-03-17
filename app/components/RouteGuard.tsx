'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { usuario, carregando, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [senhaAutenticada, setSenhaAutenticada] = useState(false);

  // Verificar se estamos em uma rota admin
  const isAdminRoute = pathname.startsWith('/admin');

  // Verificação para o painel admin
  if (requireAdmin || isAdminRoute) {
    // Verificar se o usuário já é admin no sistema
    if (isAdmin) {
      return <>{children}</>;
    }
    
    // Verificar se a senha já foi autenticada nesta sessão
    useEffect(() => {
      try {
        const adminAutenticado = sessionStorage.getItem('adminAutenticado');
        if (adminAutenticado === 'true') {
          setSenhaAutenticada(true);
        } 
        // Se não estiver autenticado e tentar acessar uma subrota de admin, redirecionar para o admin principal
        else if (isAdminRoute && pathname !== '/admin') {
          router.push('/admin');
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação admin:", error);
      }
    }, [pathname, router, isAdminRoute]);

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
                sessionStorage.setItem('adminAutenticado', 'true');
                setSenhaAutenticada(true);
                
                // Se estiver tentando acessar uma subrota específica, redirecionar para ela
                if (pathname !== '/admin' && pathname.startsWith('/admin')) {
                  // Manter na rota atual
                } else if (sessionStorage.getItem('adminRedirectUrl')) {
                  // Redirecionar para a URL salva anteriormente
                  const redirectUrl = sessionStorage.getItem('adminRedirectUrl');
                  sessionStorage.removeItem('adminRedirectUrl');
                  router.push(redirectUrl || '/admin');
                }
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
    
    // Se autenticado com senha, mostrar conteúdo do admin
    return <>{children}</>;
  }

  // Para rotas não-admin, manter o comportamento normal de autenticação
  useEffect(() => {
    // Verificar autenticação somente após o carregamento inicial e apenas para rotas não-admin
    if (!carregando) {
      // Se não há usuário, redirecionar para login (apenas para rotas protegidas que não são admin)
      if (!usuario && !pathname.startsWith('/admin')) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
    }
  }, [usuario, carregando, pathname, router]);

  // Exibir nada enquanto a verificação de autenticação está em andamento
  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, não renderizar nada (apenas para rotas não-admin)
  if (!usuario && !pathname.startsWith('/admin')) {
    return null;
  }
  
  // Renderizar o conteúdo protegido
  return <>{children}</>;
}
