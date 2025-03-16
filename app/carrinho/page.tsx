'use client';

import { useCarrinho } from '../context/CarrinhoContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CarrinhoPage() {
  const { carrinho, removerItem, atualizarQuantidade, limparCarrinho } = useCarrinho();

  if (carrinho.itens.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-500 mb-6">Seu carrinho está vazio</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de itens do carrinho */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Produto</th>
                  <th className="py-3 px-4 text-center">Quantidade</th>
                  <th className="py-3 px-4 text-right">Preço</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {carrinho.itens.map((item) => (
                  <tr key={item.livro.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="relative h-16 w-12 mr-4">
                          <Image
                            src={item.livro.imagemUrl}
                            alt={item.livro.titulo}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                            sizes="50px"
                          />
                        </div>
                        <div>
                          <Link href={`/produto/${item.livro.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            {item.livro.titulo}
                          </Link>
                          <p className="text-sm text-gray-500">{item.livro.autor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => atualizarQuantidade(item.livro.id, item.quantidade - 1)}
                          className="border rounded-l p-1 hover:bg-gray-100"
                          disabled={item.quantidade <= 1}
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.livro.id, item.quantidade + 1)}
                          className="border rounded-r p-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      R${item.livro.preco.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      R${(item.livro.preco * item.quantidade).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => removerItem(item.livro.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Link href="/" className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition">
              Continuar Comprando
            </Link>
            <button
              onClick={() => limparCarrinho()}
              className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>
        
        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R${carrinho.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
            </div>
            
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>R${carrinho.total.toFixed(2)}</span>
            </div>
            
            <Link
              href="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition"
            >
              Finalizar Compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 