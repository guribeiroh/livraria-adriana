'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ClienteNavbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const navItems = [
    { href: '/cliente', label: 'Dashboard' },
    { href: '/cliente/pedidos', label: 'Meus Pedidos' },
    { href: '/cliente/favoritos', label: 'Favoritos' },
    { href: '/cliente/perfil', label: 'Meu Perfil' }
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo e nome */}
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              Livraria Online
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded hover:bg-blue-600 ${
                  pathname === item.href ? 'bg-blue-800' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Menu usuário */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="px-3 py-2">
              Olá, {usuario?.nome || 'Cliente'}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded bg-red-600 hover:bg-red-700"
            >
              Sair
            </button>
          </div>

          {/* Botão menu mobile */}
          <div className="md:hidden">
            <button
              className="p-2 rounded hover:bg-blue-600"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                {menuAberto ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="md:hidden bg-blue-800">
          <div className="container mx-auto px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded hover:bg-blue-600 ${
                  pathname === item.href ? 'bg-blue-700' : ''
                }`}
                onClick={() => setMenuAberto(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-blue-600 my-2 py-2">
              <div className="px-3 py-2">
                Olá, {usuario?.nome || 'Cliente'}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700 mt-2"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 