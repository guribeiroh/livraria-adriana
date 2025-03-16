'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCarrinho } from '../../context/CarrinhoContext';

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { carrinho, limparCarrinho } = useCarrinho();
  const [dadosCliente, setDadosCliente] = useState<any>(null);
  const [itensNoCarrinho, setItensNoCarrinho] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [numeroPedido, setNumeroPedido] = useState('');

  useEffect(() => {
    // Verificar se tem itens no carrinho, senão redirecionar
    if (carrinho.itens.length === 0) {
      router.push('/');
    }

    // Gerar número de pedido aleatório
    setNumeroPedido(`#${Math.floor(Math.random() * 100000)}`);

    // Salvar os itens antes de limpar o carrinho
    setItensNoCarrinho([...carrinho.itens]);
    setTotal(carrinho.total);

    // Carregar dados do cliente
    const dadosClienteStr = localStorage.getItem('dadosCliente');
    if (dadosClienteStr) {
      try {
        const dados = JSON.parse(dadosClienteStr);
        setDadosCliente(dados);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      }
    }

    // Limpar carrinho após exibir a confirmação
    setTimeout(() => {
      limparCarrinho();
      localStorage.removeItem('dadosCliente');
    }, 500);
  }, [carrinho, limparCarrinho, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 text-success-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600">
            Seu pedido {numeroPedido} foi recebido e está sendo processado.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
          
          <div className="divide-y divide-gray-200">
            {itensNoCarrinho.map(item => (
              <div key={item.livro.id} className="py-4 flex items-start">
                <div className="w-16 h-24 relative flex-shrink-0 mr-4">
                  <Image
                    src={item.livro.imagemUrl}
                    alt={item.livro.titulo}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{item.livro.titulo}</h3>
                  <p className="text-sm text-gray-600">{item.livro.autor}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">Qtd: {item.quantidade}</span>
                    <span className="font-medium">R$ {(item.livro.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between font-bold">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {dadosCliente && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Dados do Cliente</h2>
              <p className="text-gray-800">{dadosCliente.nome}</p>
              <p className="text-gray-600">{dadosCliente.email}</p>
              <p className="text-gray-600">{dadosCliente.telefone}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Endereço de Entrega</h2>
              <p className="text-gray-800">{dadosCliente.rua}</p>
              <p className="text-gray-600">{dadosCliente.cidade}, {dadosCliente.estado}</p>
              <p className="text-gray-600">CEP: {dadosCliente.cep}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Próximos Passos</h2>
          <ol className="ml-4 space-y-2">
            <li className="text-gray-700">Você receberá um email com a confirmação do pedido.</li>
            <li className="text-gray-700">Nossa equipe vai preparar os livros para envio.</li>
            <li className="text-gray-700">Você receberá um email com o código de rastreamento.</li>
            <li className="text-gray-700">Seu pedido chegará em até 10 dias úteis.</li>
          </ol>
        </div>

        <div className="text-center">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Voltar para a Loja
          </Link>
        </div>
      </div>
    </div>
  );
} 