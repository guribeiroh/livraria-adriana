'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { carregando } = useAuth();
  const pathname = usePathname();

  // Para o painel admin, não exigir nenhuma autenticação
  if (requireAdmin) {
    // Renderizar o conteúdo do admin sem verificações
    return <>{children}</>;
  }

  // Exibir loader enquanto a verificação de autenticação está em andamento
  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Renderizar o conteúdo para qualquer outro caso
  return <>{children}</>;
}
