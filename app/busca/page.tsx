'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useBookSearch, useBooks } from '../hooks/useBooks';
import { Book } from '../lib/supabase';
import BookCard from '../components/BookCard';
import Button from '../components/Button';
import { Skeleton } from '../components/ui/Skeleton';

export default function BuscaPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  const categoriaParam = searchParams.get('categoria');
  
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(categoriaParam);
  const [filtroAutor, setFiltroAutor] = useState<string | null>(null);
  const [filtroPrecoMin, setFiltroPrecoMin] = useState<number | null>(null);
  const [filtroPrecoMax, setFiltroPrecoMax] = useState<number | null>(null);
  const [busca, setBusca] = useState(queryParam || '');
  const [ordenacao, setOrdenacao] = useState<'recentes' | 'populares' | 'precoAsc' | 'precoDesc'>('recentes');
  const [categorias, setCategorias] = useState<{ name: string; slug: string }[]>([]);
  const [autores, setAutores] = useState<string[]>([]);
  
  // Usar hook de busca para livros
  const { books: resultadosBusca, isLoading: isLoadingBusca } = 
    useBookSearch(searchQuery);
  
  // Buscar categorias para filtros
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategorias(data.data);
        }
      })
      .catch(err => console.error('Erro ao buscar categorias:', err));
      
    // Buscar autores únicos
    fetch('/api/authors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAutores(data.data);
        }
      })
      .catch(err => console.error('Erro ao buscar autores:', err));
  }, []);
  
  // Filtrar e ordenar livros com base nos critérios
  const livrosFiltrados = resultadosBusca
    .filter(livro => {
      // Filtrar por categoria se definida
      if (filtroCategoria && livro.category?.slug !== filtroCategoria) {
        return false;
      }
      
      // Filtrar por autor se definido
      if (filtroAutor && livro.author !== filtroAutor) {
        return false;
      }
      
      // Filtrar por preço mínimo
      if (filtroPrecoMin !== null && livro.price < filtroPrecoMin) {
        return false;
      }
      
      // Filtrar por preço máximo
      if (filtroPrecoMax !== null && livro.price > filtroPrecoMax) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenar com base na seleção
      switch (ordenacao) {
        case 'recentes':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'populares':
          return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
        case 'precoAsc':
          return a.price - b.price;
        case 'precoDesc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(busca);
  };
  
  const limparFiltros = () => {
    setFiltroCategoria(null);
    setFiltroAutor(null);
    setFiltroPrecoMin(null);
    setFiltroPrecoMax(null);
    setOrdenacao('recentes');
  };
  
  return (
    <main className="bg-primary-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary-800 mb-8">Buscar Livros</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros - Coluna lateral */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Filtros</h2>
            
            {/* Busca */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar livros..."
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white p-1 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            {/* Categorias */}
            <div className="mb-6">
              <h3 className="font-medium text-primary-700 mb-2">Categorias</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                {categorias.map((categoria) => (
                  <div key={categoria.slug} className="flex items-center">
                    <input
                      type="radio"
                      id={`cat-${categoria.slug}`}
                      name="categoria"
                      checked={filtroCategoria === categoria.slug}
                      onChange={() => setFiltroCategoria(categoria.slug)}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <label htmlFor={`cat-${categoria.slug}`} className="ml-2 text-sm text-primary-600">
                      {categoria.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Autores */}
            <div className="mb-6">
              <h3 className="font-medium text-primary-700 mb-2">Autores</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                {autores.map((autor) => (
                  <div key={autor} className="flex items-center">
                    <input
                      type="radio"
                      id={`autor-${autor.replace(/\s+/g, '-').toLowerCase()}`}
                      name="autor"
                      checked={filtroAutor === autor}
                      onChange={() => setFiltroAutor(autor)}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <label htmlFor={`autor-${autor.replace(/\s+/g, '-').toLowerCase()}`} className="ml-2 text-sm text-primary-600">
                      {autor}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Faixa de Preço */}
            <div className="mb-6">
              <h3 className="font-medium text-primary-700 mb-2">Faixa de Preço</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="preco-min" className="text-xs text-primary-600">Min (R$)</label>
                  <input
                    type="number"
                    id="preco-min"
                    min="0"
                    step="0.01"
                    value={filtroPrecoMin || ''}
                    onChange={(e) => setFiltroPrecoMin(e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-2 py-1 text-sm border border-primary-200 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="preco-max" className="text-xs text-primary-600">Max (R$)</label>
                  <input
                    type="number"
                    id="preco-max"
                    min="0"
                    step="0.01"
                    value={filtroPrecoMax || ''}
                    onChange={(e) => setFiltroPrecoMax(e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-2 py-1 text-sm border border-primary-200 rounded"
                  />
                </div>
              </div>
            </div>
            
            {/* Ordenação */}
            <div className="mb-6">
              <h3 className="font-medium text-primary-700 mb-2">Ordenar por</h3>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
                className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="recentes">Mais recentes</option>
                <option value="populares">Mais populares</option>
                <option value="precoAsc">Menor preço</option>
                <option value="precoDesc">Maior preço</option>
              </select>
            </div>
            
            {/* Botão de limpar filtros */}
            <Button 
              variant="secondary" 
              onClick={limparFiltros} 
              className="w-full"
            >
              Limpar filtros
            </Button>
          </div>
          
          {/* Resultados - Área principal */}
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary-800">
                  {isLoadingBusca 
                    ? 'Buscando livros...' 
                    : `${livrosFiltrados.length} ${livrosFiltrados.length === 1 ? 'resultado' : 'resultados'} encontrados`
                  }
                </h2>
              </div>
            </div>
            
            {isLoadingBusca ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="w-full h-64" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : livrosFiltrados.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {livrosFiltrados.map((livro, index) => (
                  <BookCard 
                    key={livro.id} 
                    book={livro}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  <Image 
                    src="/images/empty-results.svg" 
                    alt="Nenhum resultado" 
                    width={150} 
                    height={150} 
                  />
                </div>
                <h3 className="text-xl font-bold text-primary-800 mb-2">Nenhum livro encontrado</h3>
                <p className="text-primary-600 mb-6">
                  Não encontramos livros que correspondam aos seus critérios de busca.
                </p>
                <Button onClick={limparFiltros}>Limpar filtros</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 