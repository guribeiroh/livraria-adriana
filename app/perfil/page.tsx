'use client';

import { useEffect, useState } from 'react';
import Redirect from '../components/Redirect';
import { useAuth } from '../context/AuthContext';

export default function PerfilPage() {
  const { usuario, carregando } = useAuth();
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [verificando, setVerificando] = useState(true);

  // Verificar autenticação
  useEffect(() => {
    // Se o usuário estiver carregando, aguardar
    if (carregando) return;
    
    // Definir status de autenticação
    setAutenticado(!!usuario);
    setVerificando(false);
    
    // Log para depuração
    console.log('[PerfilRedirect] Usuario:', usuario ? 'Autenticado' : 'Não autenticado');
  }, [usuario, carregando]);

  // Se estiver carregando ou verificando, mostrar tela de carregamento
  if (carregando || verificando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-blue-600">Redirecionando...</p>
      </div>
    );
  }

  // Se o usuário estiver autenticado, redirecionar para a página de perfil na área do cliente
  if (autenticado) {
    console.log('[PerfilRedirect] Redirecionando para /cliente/perfil');
    return <Redirect to="/cliente/perfil" />;
  }

  // Se o usuário não estiver autenticado, redirecionar para login
  console.log('[PerfilRedirect] Redirecionando para login');
  
  // Salvar caminho para redirecionamento após login
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('redirectAfterLogin', '/cliente/perfil');
  }
  
  return <Redirect to="/login?next=/cliente/perfil" />;
} 