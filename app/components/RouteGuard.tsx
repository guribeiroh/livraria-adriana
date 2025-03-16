'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // Verificar autenticação somente após o carregamento inicial
    if (!carregando) {
      // Se não há usuário, redirecionar para login
      if (!usuario) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      
      // Verificar se rota requer admin e usuário tem permissão
      if (requireAdmin && !isAdmin()) {
        router.push('/');
        return;
      }
    }
  }, [usuario, carregando, pathname, router, requireAdmin, isAdmin]);

  // Exibir nada enquanto a verificação de autenticação está em andamento
  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, não renderizar nada
  if (!usuario) {
    return null;
  }
  
  // Verificar permissão se necessário
  if (requireAdmin && !isAdmin()) {
    return null;
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>;
} 