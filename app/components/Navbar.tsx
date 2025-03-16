'use client';

import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { carrinho } = useCarrinho();
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalItens = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setPerfilAberto(false);
  };

  return (
    <nav className={`py-4 px-6 fixed top-0 w-full z-10 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md" : "bg-primary-50"
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="heading-serif text-2xl text-primary-700 hover:text-primary-800 transition-colors">
          Livraria JessyKaroline
        </Link>

        {/* Menu para dispositivos móveis */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setCarrinhoAberto(!carrinhoAberto)}
            className="text-primary-700 focus:outline-none relative"
            aria-label={carrinhoAberto ? "Fechar carrinho" : "Abrir carrinho"}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItens > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItens}
              </span>
            )}
          </button>

          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-primary-700 focus:outline-none"
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

        {/* Menu principal - visível em desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/busca" className="text-primary-700 font-medium hover:text-primary-800">Livros</Link>
          <Link href="/busca?categoria=mais-vendidos" className="text-primary-700 font-medium hover:text-primary-800">Mais Vendidos</Link>
          <Link href="/busca?categoria=lancamentos" className="text-primary-700 font-medium hover:text-primary-800">Lançamentos</Link>
          <Link href="/busca?categoria=promocoes" className="text-primary-700 font-medium hover:text-primary-800">Promoções</Link>
        </div>

        {/* Área de usuário e carrinho - visível em desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Botão de busca */}
          <div className="relative">
            <button 
              onClick={() => setCarrinhoAberto(!carrinhoAberto)}
              className="flex items-center text-primary-700 hover:text-primary-800 focus:outline-none"
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

            {/* Carrinho dropdown */}
            {carrinhoAberto && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl z-20">
                <div className="px-4 py-3 border-b border-primary-100">
                  <h3 className="text-lg font-medium text-primary-800">Carrinho de Compras</h3>
                  <p className="text-sm text-primary-600">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</p>
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
          
          {/* Botão de perfil */}
          <div className="relative">
            <button
              onClick={() => setPerfilAberto(!perfilAberto)}
              className="flex items-center text-primary-700 hover:text-primary-800 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-2">
                {usuario ? (
                  usuario.nome.charAt(0).toUpperCase()
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a2 2 0 012 2m-4 4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2h10zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <span>{usuario ? usuario.nome.split(' ')[0] : 'Perfil'}</span>
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Menu dropdown do perfil */}
            {perfilAberto && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
                {usuario ? (
                  <>
                    <div className="px-4 py-3 text-sm text-primary-800 border-b">
                      <div className="font-medium">Olá, {usuario.nome}</div>
                      <div className="text-xs">{usuario.email}</div>
                    </div>
                    <Link 
                      href="/perfil" 
                      className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link 
                      href="/perfil/pedidos" 
                      className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Entrar
                    </Link>
                    <Link 
                      href="/registro" 
                      className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Criar Conta
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
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