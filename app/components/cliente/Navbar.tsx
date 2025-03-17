'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-600">
          Minha Conta
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Link href="/carrinho" className="text-gray-700 hover:text-primary-600 flex items-center" title="Meu Carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                {usuario?.nome?.charAt(0) || 'U'}
              </div>
              <span className="text-gray-700 hidden md:inline-block">
                {usuario?.nome || 'Usuário'}
              </span>
              <button 
                onClick={handleLogout}
                className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 