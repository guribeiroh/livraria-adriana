'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { usuario, carregando, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [autorizado, setAutorizado] = useState(false);
  
  useEffect(() => {
    // Verificar autorização quando a autenticação for concluída
    if (!carregando) {
      // Se a rota requer privilégios de administrador
      if (requireAdmin) {
        if (isAdmin) {
          setAutorizado(true);
        } else {
          console.log('[RouteGuard] Acesso negado para rota admin:', pathname);
          router.push('/login?next=' + encodeURIComponent(pathname));
        }
      } else {
        // Para rotas que não requerem administrador, apenas verifica se o usuário está autenticado
        if (usuario) {
          setAutorizado(true);
        } else {
          console.log('[RouteGuard] Acesso negado para rota protegida:', pathname);
          router.push('/login?next=' + encodeURIComponent(pathname));
        }
      }
    }
  }, [carregando, usuario, isAdmin, pathname, requireAdmin, router]);

  // Exibir loader enquanto a verificação de autenticação está em andamento
  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Renderizar o conteúdo apenas se autorizado
  return autorizado ? <>{children}</> : null;
}
