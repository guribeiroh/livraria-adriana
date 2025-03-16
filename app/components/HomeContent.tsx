'use client';

import React from 'react';
import BookCard from './BookCard';
import { useBooks } from '../hooks/useBooks';
import { Skeleton } from './ui/Skeleton';

export default function HomeContent() {
  const { books: featuredBooks, isLoading: isFeaturedLoading, error: featuredError } = useBooks({ featured: true, limit: 8 });
  const { books: bestsellerBooks, isLoading: isBestsellerLoading, error: bestsellerError } = useBooks({ bestseller: true, limit: 8 });
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Seção de livros em destaque */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-merriweather text-primary-900">Livros em Destaque</h2>
          <a href="/livros?destaque=true" className="text-accent-500 hover:text-accent-700 font-medium transition-colors">
            Ver todos
          </a>
        </div>
        
        {featuredError && (
          <div className="bg-error-50 text-error-700 p-4 rounded-lg mb-4">
            <p>Erro ao carregar livros em destaque: {featuredError}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isFeaturedLoading ? (
            // Exibir esqueletos de carregamento enquanto busca os dados
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))
          ) : featuredBooks.length > 0 ? (
            featuredBooks.map(book => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                originalPrice={book.original_price || undefined}
                coverImage={book.cover_image || '/images/book-placeholder.jpg'}
                slug={book.slug}
                category={book.category?.name || 'Sem categoria'}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Nenhum livro em destaque encontrado.</p>
          )}
        </div>
      </section>

      {/* Seção de mais vendidos */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-merriweather text-primary-900">Mais Vendidos</h2>
          <a href="/livros?bestseller=true" className="text-accent-500 hover:text-accent-700 font-medium transition-colors">
            Ver todos
          </a>
        </div>
        
        {bestsellerError && (
          <div className="bg-error-50 text-error-700 p-4 rounded-lg mb-4">
            <p>Erro ao carregar livros mais vendidos: {bestsellerError}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isBestsellerLoading ? (
            // Exibir esqueletos de carregamento enquanto busca os dados
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))
          ) : bestsellerBooks.length > 0 ? (
            bestsellerBooks.map(book => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                originalPrice={book.original_price || undefined}
                coverImage={book.cover_image || '/images/book-placeholder.jpg'}
                slug={book.slug}
                category={book.category?.name || 'Sem categoria'}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Nenhum bestseller encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
} 