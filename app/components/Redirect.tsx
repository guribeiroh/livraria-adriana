'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectProps {
  to: string;
  delay?: number;
}

/**
 * Componente para realizar redirecionamentos de forma confiável
 * Usa window.location diretamente para evitar problemas com router do Next.js
 */
export default function Redirect({ to, delay = 0 }: RedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`[Redirect] Redirecionando para: ${to}`);
      router.push(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [to, delay, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-blue-600">Redirecionando...</p>
    </div>
  );
} 