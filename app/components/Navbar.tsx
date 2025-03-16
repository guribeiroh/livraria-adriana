'use client';

import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';
import { useState } from 'react';

export default function Navbar() {
  const { carrinho } = useCarrinho();
  const [menuAberto, setMenuAberto] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Livraria Adriana
        </Link>

        {/* Menu para dispositivos móveis */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Links para desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-700 transition">
            Início
          </Link>
          <Link href="/categorias" className="text-gray-700 hover:text-blue-700 transition">
            Categorias
          </Link>
          <Link href="/lancamentos" className="text-gray-700 hover:text-blue-700 transition">
            Lançamentos
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-blue-700 transition">
            Sobre
          </Link>
          <div className="relative">
            <button 
              onClick={() => setCarrinhoAberto(!carrinhoAberto)}
              className="flex items-center text-gray-700 hover:text-blue-700 transition"
            >
              <svg className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Carrinho ({carrinho.itens.length})</span>
            </button>

            {/* Mini carrinho */}
            {carrinhoAberto && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl p-4 z-20">
                <h3 className="text-lg font-semibold mb-2">Seu Carrinho</h3>
                {carrinho.itens.length === 0 ? (
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                ) : (
                  <>
                    <ul className="max-h-60 overflow-y-auto">
                      {carrinho.itens.map((item) => (
                        <li key={item.livro.id} className="py-2 border-b">
                          <div className="flex justify-between">
                            <span className="text-sm">{item.livro.titulo}</span>
                            <span className="text-sm">
                              {item.quantidade} x R${item.livro.preco.toFixed(2)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>R${carrinho.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 flex justify-between gap-2">
                      <Link 
                        href="/carrinho" 
                        className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded hover:bg-gray-300 transition"
                      >
                        Ver Carrinho
                      </Link>
                      <Link 
                        href="/checkout" 
                        className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                      >
                        Finalizar
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu móvel expandido */}
      {menuAberto && (
        <div className="md:hidden mt-4 border-t pt-4">
          <Link href="/" className="block py-2 text-gray-700 hover:text-blue-700 transition">
            Início
          </Link>
          <Link href="/categorias" className="block py-2 text-gray-700 hover:text-blue-700 transition">
            Categorias
          </Link>
          <Link href="/lancamentos" className="block py-2 text-gray-700 hover:text-blue-700 transition">
            Lançamentos
          </Link>
          <Link href="/sobre" className="block py-2 text-gray-700 hover:text-blue-700 transition">
            Sobre
          </Link>
          <Link
            href="/carrinho"
            className="flex items-center py-2 text-gray-700 hover:text-blue-700 transition"
          >
            <svg className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Carrinho ({carrinho.itens.length})</span>
          </Link>
        </div>
      )}
    </nav>
  );
} 