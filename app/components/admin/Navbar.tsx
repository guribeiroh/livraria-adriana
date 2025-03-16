'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export function Navbar() {
  const { usuario, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-800">
          Painel Administrativo
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                {usuario?.nome?.charAt(0) || 'A'}
              </div>
              <span className="text-gray-700 hidden md:inline-block">
                {usuario?.nome || 'Admin'}
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