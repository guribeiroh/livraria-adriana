'use client';

import { useEffect } from 'react';

interface RedirectProps {
  to: string;
  replace?: boolean;
}

/**
 * Componente para realizar redirecionamentos de forma confiável
 * Usa window.location diretamente para evitar problemas com router do Next.js
 */
export default function Redirect({ to, replace = false }: RedirectProps) {
  useEffect(() => {
    // Pequeno timeout para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      console.log(`[Redirect] Redirecionando para: ${to}`);
      if (replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [to, replace]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin mx-auto rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Redirecionando...</h2>
        <p className="text-gray-500">Aguarde um momento, por favor.</p>
      </div>
    </div>
  );
} 