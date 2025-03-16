'use client';

import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { carrinho } = useCarrinho();
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);

  const totalItens = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);

  const handleLogout = () => {
    logout();
    setPerfilAberto(false);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors">
          Livraria Adriana
        </Link>

        {/* Menu para dispositivos móveis */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-gray-600 focus:outline-none"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
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
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-700 transition-colors">
            Início
          </Link>
          <Link href="/#categorias" className="text-gray-700 hover:text-blue-700 transition-colors">
            Categorias
          </Link>
          <Link href="/lancamentos" className="text-gray-700 hover:text-blue-700 transition-colors">
            Lançamentos
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-blue-700 transition-colors">
            Sobre
          </Link>
          
          {/* Carrinho */}
          <div className="relative">
            <button 
              onClick={() => setCarrinhoAberto(!carrinhoAberto)}
              className="flex items-center text-gray-700 hover:text-blue-700 transition-colors"
              aria-expanded={carrinhoAberto}
              aria-label="Abrir carrinho"
            >
              <svg className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="mr-1">Carrinho</span>
              {totalItens > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </button>

            {/* Mini carrinho */}
            {carrinhoAberto && (
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-xl p-6 z-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Seu Carrinho</h3>
                  <button 
                    onClick={() => setCarrinhoAberto(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Fechar mini carrinho"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {carrinho.itens.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="mt-2 text-gray-500">Seu carrinho está vazio</p>
                    <Link 
                      href="/" 
                      className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => setCarrinhoAberto(false)}
                    >
                      Comece a adicionar produtos
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                      {carrinho.itens.map((item) => (
                        <li key={item.livro.id} className="py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                              <img 
                                src={item.livro.imagemUrl} 
                                alt={item.livro.titulo}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.livro.titulo}</h4>
                              <p className="text-sm text-gray-500">{item.quantidade} x R${item.livro.preco.toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>Total:</span>
                        <span>R${carrinho.total.toFixed(2)}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Link 
                          href="/carrinho" 
                          className="bg-gray-100 text-gray-800 text-center py-2 px-4 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => setCarrinhoAberto(false)}
                        >
                          Ver Carrinho
                        </Link>
                        <Link 
                          href="/checkout" 
                          className="bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                          onClick={() => setCarrinhoAberto(false)}
                        >
                          Finalizar
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Autenticação */}
          {usuario ? (
            <div className="relative">
              <button 
                onClick={() => setPerfilAberto(!perfilAberto)}
                className="flex items-center text-gray-700 hover:text-blue-700 transition-colors"
                aria-expanded={perfilAberto}
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-2">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <span>{usuario.nome.split(' ')[0]}</span>
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {perfilAberto && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-20">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
                    <p className="text-xs text-gray-500">{usuario.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/pedidos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/registro" 
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Menu móvel expandido */}
      {menuAberto && (
        <div className="md:hidden mt-4 pt-4 border-t">
          <Link 
            href="/" 
            className="block py-2 text-gray-700 hover:text-blue-700"
            onClick={() => setMenuAberto(false)}
          >
            Início
          </Link>
          <Link 
            href="/#categorias" 
            className="block py-2 text-gray-700 hover:text-blue-700"
            onClick={() => setMenuAberto(false)}
          >
            Categorias
          </Link>
          <Link 
            href="/lancamentos" 
            className="block py-2 text-gray-700 hover:text-blue-700"
            onClick={() => setMenuAberto(false)}
          >
            Lançamentos
          </Link>
          <Link 
            href="/sobre" 
            className="block py-2 text-gray-700 hover:text-blue-700"
            onClick={() => setMenuAberto(false)}
          >
            Sobre
          </Link>
          <Link
            href="/carrinho"
            className="flex items-center py-2 text-gray-700 hover:text-blue-700"
            onClick={() => setMenuAberto(false)}
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="mr-1">Carrinho</span>
            {totalItens > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-1">
                {totalItens}
              </span>
            )}
          </Link>
          
          {/* Autenticação para dispositivos móveis */}
          {usuario ? (
            <>
              <div className="py-2 flex items-center border-t mt-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-2">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{usuario.nome}</p>
                  <p className="text-xs text-gray-500">{usuario.email}</p>
                </div>
              </div>
              <Link
                href="/perfil"
                className="block py-2 text-gray-700 hover:text-blue-700"
                onClick={() => setMenuAberto(false)}
              >
                Meu Perfil
              </Link>
              <Link
                href="/pedidos"
                className="block py-2 text-gray-700 hover:text-blue-700"
                onClick={() => setMenuAberto(false)}
              >
                Meus Pedidos
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-red-600 hover:text-red-800"
              >
                Sair
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 mt-2 pt-2 border-t">
              <Link 
                href="/login" 
                className="block py-2 text-gray-700 hover:text-blue-700"
                onClick={() => setMenuAberto(false)}
              >
                Login
              </Link>
              <Link 
                href="/registro" 
                className="block py-2 bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition-colors text-center"
                onClick={() => setMenuAberto(false)}
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
} 