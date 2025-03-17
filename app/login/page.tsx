'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Redirect from '../components/Redirect';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { login, erro, carregando, usuario } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [redirecionando, setRedirecionando] = useState(false);
  const [destino, setDestino] = useState<string | null>(null);

  // Verificar se já está autenticado para redirecionar
  useEffect(() => {
    // Determinar o destino de redirecionamento
    const nextParam = searchParams.get('next');
    const storedNext = typeof window !== 'undefined' ? sessionStorage.getItem('redirectAfterLogin') : null;
    const redirectUrl = nextParam || storedNext || '/cliente';

    // Se o usuário já está autenticado, preparar para redirecionar
    if (usuario && !carregando) {
      console.log('[LoginPage] Usuário já autenticado:', usuario.email);
      console.log('[LoginPage] Redirecionando para:', redirectUrl);
      
      // Limpar redirecionamentos salvos
      if (storedNext && typeof window !== 'undefined') {
        sessionStorage.removeItem('redirectAfterLogin');
      }

      // Definir o destino para acionar o componente Redirect
      setDestino(redirectUrl);
    }
  }, [usuario, carregando, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (carregando || redirecionando) return;
    
    const { email, senha } = formData;
    setRedirecionando(true);
    console.log('[LoginPage] Tentando fazer login com:', email);
    
    const sucesso = await login(email, senha);
    
    if (sucesso) {
      // Determinar destino após login bem-sucedido
      const nextParam = searchParams.get('next');
      const storedNext = typeof window !== 'undefined' ? sessionStorage.getItem('redirectAfterLogin') : null;
      const redirectUrl = nextParam || storedNext || '/cliente';
      
      console.log('[LoginPage] Login bem-sucedido, redirecionando para:', redirectUrl);
      
      // Limpar redirecionamentos salvos
      if (storedNext && typeof window !== 'undefined') {
        sessionStorage.removeItem('redirectAfterLogin');
      }
      
      // Definir o destino para acionar o componente Redirect
      setDestino(redirectUrl);
    } else {
      console.log('[LoginPage] Falha no login');
      setRedirecionando(false);
    }
  };

  // Se tiver um destino definido, renderizar o componente de redirecionamento
  if (destino) {
    return <Redirect to={destino} />;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={carregando || redirecionando}
              required
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                (carregando || redirecionando) ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              disabled={carregando || redirecionando}
              required
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                (carregando || redirecionando) ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <button
            type="submit"
            disabled={carregando || redirecionando}
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
              (carregando || redirecionando) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {redirecionando ? 'Redirecionando...' : carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/registro" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 