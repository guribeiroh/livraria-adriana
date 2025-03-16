'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { livros } from '../data/livros';
import { Livro } from '../types';
import LivroCard from '../components/LivroCard';
import SearchBar from '../components/SearchBar';

export default function BuscaPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [resultados, setResultados] = useState<Livro[]>([]);

  useEffect(() => {
    if (query) {
      const termosDeBusca = query.toLowerCase().split(' ');
      
      const resultadosFiltrados = livros.filter(livro => {
        const titulo = livro.titulo.toLowerCase();
        const autor = livro.autor.toLowerCase();
        const descricao = livro.descricao.toLowerCase();
        const categoria = livro.categoria.toLowerCase();
        
        return termosDeBusca.some(termo => 
          titulo.includes(termo) || 
          autor.includes(termo) || 
          descricao.includes(termo) || 
          categoria.includes(termo)
        );
      });
      
      setResultados(resultadosFiltrados);
    } else {
      setResultados([]);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resultados da Busca</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>
      
      {query ? (
        <>
          <p className="mb-4 text-gray-600">
            {resultados.length === 0 
              ? 'Nenhum resultado encontrado para ' 
              : `${resultados.length} resultado(s) encontrado(s) para `}
            <span className="font-semibold">"{query}"</span>
          </p>
          
          {resultados.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resultados.map(livro => (
                <LivroCard key={livro.id} livro={livro} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            Digite algo na barra de busca para encontrar livros
          </p>
        </div>
      )}
    </div>
  );
} 