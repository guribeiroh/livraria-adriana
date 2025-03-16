'use client';

import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { carrinho } = useCarrinho();
  const { usuario, logout, isAdmin } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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

  const handleLogout = async () => {
    await logout();
    setPerfilAberto(false);
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Logo da Livraria" 
              width={40} 
              height={40} 
              className="w-auto h-10"
            />
            <span className="ml-2 text-xl font-bold text-primary-700">Livraria Online</span>
          </Link>

          {/* Botão de menu mobile */}
          <button
            className="md:hidden text-primary-800 hover:text-primary-600"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Menu principal - visível em desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Início
            </Link>
            <Link 
              href="/sobre" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/sobre' 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Sobre
            </Link>
            <Link 
              href="/contato" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/contato' 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              Contato
            </Link>
            <Link href="/busca" className="text-primary-700 font-medium hover:text-primary-800">
              Livros
            </Link>
            <Link href="/busca?categoria=mais-vendidos" className="text-primary-700 font-medium hover:text-primary-800">
              Mais Vendidos
            </Link>
            <Link href="/busca?categoria=lancamentos" className="text-primary-700 font-medium hover:text-primary-800">
              Lançamentos
            </Link>
            <Link href="/busca?categoria=promocoes" className="text-primary-700 font-medium hover:text-primary-800">
              Promoções
            </Link>
          </div>

          {/* Área de usuário e carrinho - visível em desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Botão de busca */}
            <Link href="/busca" className="text-primary-700 hover:text-primary-800">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Botão de carrinho */}
            <div className="relative">
              <button
                className="text-primary-700 hover:text-primary-800 relative"
                onClick={() => setCarrinhoAberto(!carrinhoAberto)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItens > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItens}
                  </span>
                )}
              </button>

              {/* Dropdown do carrinho */}
              {carrinhoAberto && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">Seu Carrinho</h3>
                    {carrinho.itens.length === 0 ? (
                      <p className="text-primary-600">Seu carrinho está vazio.</p>
                    ) : (
                      <>
                        <ul className="max-h-40 overflow-y-auto mb-4">
                          {carrinho.itens.map(item => (
                            <li key={item.livro.id} className="flex items-center py-2 border-b">
                              <span className="flex-1 text-sm">{item.livro.titulo}</span>
                              <span className="text-sm text-primary-600">{item.quantidade}x</span>
                              <span className="text-sm font-medium ml-2">R${item.livro.preco.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between items-center font-semibold mb-4">
                          <span>Total:</span>
                          <span>R${carrinho.total.toFixed(2)}</span>
                        </div>
                        <Link 
                          href="/checkout"
                          className="block w-full bg-primary-600 text-white text-center py-2 rounded-md hover:bg-primary-700 transition"
                        >
                          Finalizar Compra
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Área de usuário */}
            <div className="relative">
              <button
                className="text-primary-700 hover:text-primary-800"
                onClick={() => setPerfilAberto(!perfilAberto)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Dropdown do perfil */}
              {perfilAberto && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="p-2">
                    {usuario ? (
                      <>
                        <div className="px-4 py-2 text-sm text-primary-800 border-b">
                          <div className="font-semibold">Olá, {usuario.nome}</div>
                          <div className="text-primary-600">{usuario.email}</div>
                        </div>
                        <Link href="/perfil" className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50">Meu Perfil</Link>
                        <Link href="/pedidos" className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50">Meus Pedidos</Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50">Entrar</Link>
                        <Link href="/registro" className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50">Criar Conta</Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {menuAberto && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/busca" className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">Livros</Link>
              <Link href="/busca?categoria=mais-vendidos" className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">Mais Vendidos</Link>
              <Link href="/busca?categoria=lancamentos" className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">Lançamentos</Link>
              <Link href="/busca?categoria=promocoes" className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">Promoções</Link>
              <Link href="/sobre" className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">Sobre</Link>
              <Link href="/contato" className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">Contato</Link>
              <div className="border-t pt-2 mt-2 space-y-2">
                <Link href="/busca" className="flex items-center px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar
                </Link>
                <Link href="/checkout" className="flex items-center px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Carrinho
                  {totalItens > 0 && (
                    <span className="ml-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItens}
                    </span>
                  )}
                </Link>
                {usuario ? (
                  <>
                    <Link href="/perfil" className="flex items-center px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Entrar
                    </Link>
                    <Link href="/registro" className="flex items-center px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Criar Conta
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 