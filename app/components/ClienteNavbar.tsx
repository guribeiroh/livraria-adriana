'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { href: '/cliente', label: 'Dashboard', icon: '📊' },
  { href: '/cliente/pedidos', label: 'Meus Pedidos', icon: '📦' },
  { href: '/cliente/perfil', label: 'Meu Perfil', icon: '👤' },
];

export default function ClienteNavbar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Nome */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            Livraria Online
          </Link>

          {/* Links de navegação */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Menu do usuário */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, {usuario?.nome || 'Cliente'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Menu móvel */}
        <div className="md:hidden py-2">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 