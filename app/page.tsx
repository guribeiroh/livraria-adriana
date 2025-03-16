'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { livros } from './data/livros';
import LivroCard from './components/LivroCard';

export default function HomePage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const categorias = Array.from(new Set(livros.map(livro => livro.categoria)));

  const livrosFiltrados = livros.filter(livro => {
    // Filtro de categoria
    const matchCategoria = !categoriaSelecionada || livro.categoria === categoriaSelecionada;
    
    // Filtro de busca
    const matchBusca = busca === '' || 
                      livro.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                      livro.autor.toLowerCase().includes(busca.toLowerCase());
    
    return matchCategoria && matchBusca;
  });

  return (
    <main className="min-h-screen">
      {/* Banner principal */}
      <div className="relative w-full h-[400px] mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Livraria Online</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">Descubra novos mundos através dos livros</p>
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              className="w-full px-4 py-3 rounded-lg text-gray-800 pr-12"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Filtro de categorias */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Categorias</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full transition-colors ${!categoriaSelecionada ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'}`}
              onClick={() => setCategoriaSelecionada(null)}
            >
              Todos
            </button>
            {categorias.map((categoria) => (
              <button 
                key={categoria}
                className={`px-4 py-2 rounded-full transition-colors ${categoriaSelecionada === categoria ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'}`}
                onClick={() => setCategoriaSelecionada(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de livros */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{categoriaSelecionada ? `Livros de ${categoriaSelecionada}` : 'Todos os Livros'}</h2>
        
        {livrosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {livrosFiltrados.map((livro) => (
              <LivroCard key={livro.id} livro={livro} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Nenhum livro encontrado</h3>
            <p className="mt-1 text-gray-500">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </div>
    </main>
  );
} 