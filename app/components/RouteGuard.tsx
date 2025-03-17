'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

type RouteGuardProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export default function RouteGuard({ children, adminOnly = false }: RouteGuardProps) {
  const { usuario, carregando, isAdmin, verificarAutenticacao } = useAuth();
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar autenticação ao montar o componente
    const checkAuth = async () => {
      // Se ainda estiver carregando, não fazer nada
      if (carregando) return;

      try {
        // Verificar autenticação
        const autenticado = await verificarAutenticacao();

        if (!autenticado) {
          console.log('[RouteGuard] Usuário não autenticado. Redirecionando para login');
          // Salvar a URL atual para redirecionar de volta após o login
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirectAfterLogin', pathname);
          }
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        // Para rotas que exigem privilégios de admin
        if (adminOnly && !isAdmin) {
          console.log('[RouteGuard] Acesso negado: Requer admin');
          router.push('/acesso-negado');
          return;
        }

        // Se passou por todas as verificações, está autorizado
        setAutorizado(true);
      } catch (error) {
        console.error('[RouteGuard] Erro ao verificar autenticação:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [carregando, usuario, isAdmin, router, pathname, adminOnly, verificarAutenticacao]);

  // Mostrar indicador de carregamento enquanto verifica a autenticação
  if (carregando || !autorizado) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-blue-600">Verificando acesso...</p>
      </div>
    );
  }

  // Se autorizado, renderizar o conteúdo
  return <>{children}</>;
}
