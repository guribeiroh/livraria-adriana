'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmacaoPage() {
  const router = useRouter();

  // Redirecionar para a página inicial se alguém acessar esta página diretamente
  useEffect(() => {
    const pedidoConfirmado = localStorage.getItem('pedido_confirmado');
    if (!pedidoConfirmado) {
      router.push('/');
    } else {
      // Limpar a confirmação após a exibição
      localStorage.removeItem('pedido_confirmado');
    }
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pedido Confirmado!</h1>
        
        <p className="text-gray-600 mb-8">
          Obrigado pela sua compra! O seu pedido foi realizado com sucesso e está sendo processado.
          Você receberá um email com os detalhes do seu pedido em breve.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-800 mb-2">Número do Pedido</h2>
          <p className="text-blue-600 text-xl font-mono">{generateRandomOrderNumber()}</p>
        </div>
        
        <p className="text-gray-600 mb-8">
          Os seus livros chegarão em breve! Se tiver alguma dúvida sobre o seu pedido, 
          entre em contato com o nosso suporte.
        </p>
        
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition inline-block">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}

// Função para gerar um número de pedido aleatório
function generateRandomOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PED-${timestamp}-${random}`;
} 