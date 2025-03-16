'use client';

import { useState } from 'react';
import Image from 'next/image';
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
    const matchBusca = livro.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                      livro.autor.toLowerCase().includes(busca.toLowerCase());
    
    return matchCategoria && matchBusca;
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Banner principal */}
      <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image 
          src="/images/banner.jpg" 
          alt="Livraria Online"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Livraria Online</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl">Descubra novos mundos através dos livros</p>
          <div className="mt-6 w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              className="w-full px-4 py-3 rounded-lg text-black"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filtro de categorias */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categorias</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-full border ${!categoriaSelecionada ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setCategoriaSelecionada(null)}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button 
              key={categoria}
              className={`px-4 py-2 rounded-full border ${categoriaSelecionada === categoria ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de livros */}
      <h2 className="text-2xl font-semibold mb-4">{categoriaSelecionada ? `Livros de ${categoriaSelecionada}` : 'Todos os Livros'}</h2>
      
      {livrosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {livrosFiltrados.map((livro) => (
            <LivroCard key={livro.id} livro={livro} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Nenhum livro encontrado.</p>
        </div>
      )}
    </main>
  );
} 