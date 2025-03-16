'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { livros } from '../data/livros';
import { Livro } from '../types';
import LivroCard from '../components/LivroCard';
import Button from '../components/Button';

export default function BuscaPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  const categoriaParam = searchParams.get('categoria');
  
  const [resultados, setResultados] = useState<Livro[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(categoriaParam);
  const [filtroAutor, setFiltroAutor] = useState<string | null>(null);
  const [filtroPrecoMin, setFiltroPrecoMin] = useState<number | null>(null);
  const [filtroPrecoMax, setFiltroPrecoMax] = useState<number | null>(null);
  const [busca, setBusca] = useState(queryParam || '');
  const [ordenacao, setOrdenacao] = useState<'recentes' | 'populares' | 'precoAsc' | 'precoDesc'>('recentes');
  
  // Extrair categorias e autores únicos para os filtros
  const categoriasUnicas = Array.from(new Set(livros.map(livro => livro.categoria)));
  const autoresUnicos = Array.from(new Set(livros.map(livro => livro.autor)));
  
  // Filtrar e ordenar livros com base nos critérios de busca e filtros
  useEffect(() => {
    let resultadosFiltrados = [...livros];
    
    // Filtrar por termo de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      resultadosFiltrados = resultadosFiltrados.filter(livro => 
        livro.titulo.toLowerCase().includes(termoBusca) || 
        livro.autor.toLowerCase().includes(termoBusca) ||
        livro.descricao.toLowerCase().includes(termoBusca)
      );
    }
    
    // Filtrar por categoria
    if (filtroCategoria) {
      resultadosFiltrados = resultadosFiltrados.filter(livro => 
        livro.categoria === filtroCategoria
      );
    }
    
    // Filtrar por autor
    if (filtroAutor) {
      resultadosFiltrados = resultadosFiltrados.filter(livro => 
        livro.autor === filtroAutor
      );
    }
    
    // Filtrar por preço mínimo
    if (filtroPrecoMin !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(livro => 
        livro.preco >= filtroPrecoMin
      );
    }
    
    // Filtrar por preço máximo
    if (filtroPrecoMax !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(livro => 
        livro.preco <= filtroPrecoMax
      );
    }
    
    // Ordenar resultados
    switch (ordenacao) {
      case 'recentes':
        resultadosFiltrados.sort((a, b) => b.anoPublicacao - a.anoPublicacao);
        break;
      case 'populares':
        // Aqui poderia ser ordenado por vendas ou avaliações, mas usaremos ID como exemplo
        resultadosFiltrados.sort((a, b) => Number(a.id) - Number(b.id));
        break;
      case 'precoAsc':
        resultadosFiltrados.sort((a, b) => a.preco - b.preco);
        break;
      case 'precoDesc':
        resultadosFiltrados.sort((a, b) => b.preco - a.preco);
        break;
    }
    
    setResultados(resultadosFiltrados);
  }, [busca, filtroCategoria, filtroAutor, filtroPrecoMin, filtroPrecoMax, ordenacao]);
  
  // Atualizar estado de busca ao carregar a página com parâmetros de URL
  useEffect(() => {
    if (queryParam) {
      setBusca(queryParam);
    }
    
    if (categoriaParam) {
      setFiltroCategoria(categoriaParam);
    }
  }, [queryParam, categoriaParam]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já é realizada pelo useEffect
  };
  
  const limparFiltros = () => {
    setFiltroCategoria(null);
    setFiltroAutor(null);
    setFiltroPrecoMin(null);
    setFiltroPrecoMax(null);
    setOrdenacao('recentes');
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-800 mb-2">
          {filtroCategoria 
            ? `Livros de ${filtroCategoria}` 
            : busca 
              ? `Resultados para "${busca}"` 
              : 'Catálogo Completo'
          }
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-primary-600">
            {resultados.length} {resultados.length === 1 ? 'livro encontrado' : 'livros encontrados'}
          </p>
          
          {/* Campo de busca */}
          <form onSubmit={handleSubmit} className="flex w-full sm:w-auto">
            <input
              type="text"
              placeholder="Pesquisar livros..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
            />
            <button 
              type="submit" 
              className="bg-primary-600 text-white p-2 rounded-r-md hover:bg-primary-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar com filtros */}
        <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary-800">Filtros</h2>
            
            <button 
              onClick={limparFiltros} 
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Limpar Filtros
            </button>
          </div>
          
          {/* Filtro de Categoria */}
          <div className="mb-6">
            <h3 className="text-primary-700 font-medium mb-2">Categoria</h3>
            <div className="space-y-2">
              {categoriasUnicas.map(categoria => (
                <div key={categoria} className="flex items-center">
                  <input
                    type="radio"
                    id={`categoria-${categoria}`}
                    name="categoria"
                    checked={filtroCategoria === categoria}
                    onChange={() => setFiltroCategoria(categoria)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor={`categoria-${categoria}`} className="ml-2 text-sm text-gray-700">
                    {categoria}
                  </label>
                </div>
              ))}
              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  id="categoria-todas"
                  name="categoria"
                  checked={filtroCategoria === null}
                  onChange={() => setFiltroCategoria(null)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="categoria-todas" className="ml-2 text-sm text-gray-700">
                  Todas as categorias
                </label>
              </div>
            </div>
          </div>
          
          {/* Filtro de Autor */}
          <div className="mb-6">
            <h3 className="text-primary-700 font-medium mb-2">Autor</h3>
            <select
              value={filtroAutor || ''}
              onChange={(e) => setFiltroAutor(e.target.value || null)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos os autores</option>
              {autoresUnicos.map(autor => (
                <option key={autor} value={autor}>{autor}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro de Preço */}
          <div className="mb-6">
            <h3 className="text-primary-700 font-medium mb-2">Faixa de Preço</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="preco-min" className="text-xs text-gray-600">Mínimo</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="number"
                    id="preco-min"
                    value={filtroPrecoMin || ''}
                    onChange={(e) => setFiltroPrecoMin(e.target.value ? Number(e.target.value) : null)}
                    min="0"
                    className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="preco-max" className="text-xs text-gray-600">Máximo</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="number"
                    id="preco-max"
                    value={filtroPrecoMax || ''}
                    onChange={(e) => setFiltroPrecoMax(e.target.value ? Number(e.target.value) : null)}
                    min="0"
                    className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Ordenação */}
          <div>
            <h3 className="text-primary-700 font-medium mb-2">Ordenar Por</h3>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="recentes">Mais recentes</option>
              <option value="populares">Mais populares</option>
              <option value="precoAsc">Menor preço</option>
              <option value="precoDesc">Maior preço</option>
            </select>
          </div>
        </aside>
        
        {/* Grid de resultados */}
        <div className="lg:w-3/4">
          {resultados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultados.map((livro, index) => (
                <LivroCard key={livro.id} livro={livro} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="mx-auto w-24 h-24 text-primary-300 mb-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Nenhum livro encontrado</h3>
              <p className="text-primary-600 mb-6">
                Não encontramos resultados para sua busca. Tente outros termos ou remova alguns filtros.
              </p>
              <Button variant="primary" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 