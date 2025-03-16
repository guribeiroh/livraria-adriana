'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCarrinho } from '../context/CarrinhoContext';
import { formatCurrency, calculateDiscount } from '../lib/utils';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  slug: string;
  category: string;
}

export default function BookCard({
  id,
  title,
  author,
  price,
  originalPrice,
  coverImage,
  slug,
  category
}: BookCardProps) {
  const { adicionarItem } = useCarrinho();
  
  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegação
    adicionarItem({
      id,
      titulo: title,
      autor: author,
      preco: price,
      descricao: '', // Adicionando campos obrigatórios que faltavam
      imagemUrl: coverImage,
      paginas: 0,
      categoria: category,
      isbn: '',
      anoPublicacao: 0,
      disponivel: true
    });
  };
  
  return (
    <Link 
      href={`/livro/${slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Imagem de fallback se houver erro
            const target = e.target as HTMLImageElement;
            target.src = '/images/book-placeholder.jpg';
          }}
        />
        
        {discount > 0 && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-accent-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
            -{discount}%
          </div>
        )}
        
        <button
          onClick={handleAddToCart}
          className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-primary-600 hover:bg-primary-700 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Adicionar ao carrinho"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
      </div>
      
      <div className="p-2 sm:p-3 md:p-4 flex-grow flex flex-col">
        <span className="text-xs text-accent-600 mb-0.5 sm:mb-1 line-clamp-1">{category}</span>
        <h3 className="text-primary-900 font-semibold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 md:mb-3 line-clamp-1">{author}</p>
        <div className="mt-auto">
          <div className="flex items-baseline flex-wrap">
            <span className="text-primary-900 font-bold text-sm sm:text-base md:text-lg">
              {formatCurrency(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-gray-400 text-xs sm:text-sm line-through ml-1 sm:ml-2">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 