'use client';

import Link from 'next/link';

export default function AcessoNegado() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 text-red-500 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Acesso Negado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Esta área é restrita a usuários com privilégios específicos.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Voltar para a Página Inicial
          </Link>
          
          <Link 
            href="/cliente" 
            className="inline-block text-blue-600 hover:underline"
          >
            Ir para sua Área do Cliente
          </Link>
        </div>
      </div>
    </div>
  );
} 