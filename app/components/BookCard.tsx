'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Book } from '../lib/supabase';
import { useCarrinho } from '../context/CarrinhoContext';
import Badge from './Badge';
import Button from './Button';

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { adicionarItem } = useCarrinho();
  const [isHovered, setIsHovered] = useState(false);
  const [botaoAnimado, setBotaoAnimado] = useState(false);
  
  // Atraso de animação baseado no índice
  const animationDelay = `${index * 100}ms`;
  
  // Adaptar o livro para o formato esperado pelo carrinho
  const handleAdicionarAoCarrinho = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    // Converter Book para o formato que o carrinho espera
    const livroAdaptado = {
      id: book.id,
      titulo: book.title,
      autor: book.author,
      descricao: book.description || '',
      preco: book.price,
      precoOriginal: book.original_price || undefined,
      imagemUrl: book.cover_image || '',
      disponivel: book.stock !== undefined && book.stock !== null && book.stock > 0 ? true : false,
      categoria: book.category?.name || '',
      paginas: book.pages || 0,
      isbn: book.isbn || '',
      anoPublicacao: book.publication_year || new Date().getFullYear(),
      slug: book.slug
    };
    
    adicionarItem(livroAdaptado);
    
    // Ativar animação do botão
    setBotaoAnimado(true);
    setTimeout(() => {
      setBotaoAnimado(false);
    }, 600);
  };
  
  // Verificar se o livro está disponível
  const isAvailable = book.stock !== undefined && book.stock !== null && book.stock > 0;
  const categoryName = book.category?.name || 'Sem categoria';
  
  return (
    <div 
      className="book-card-hover card group animate-fade-in"
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Ribbon de desconto */}
        {book.original_price && book.original_price > book.price && 
          Math.round((1 - book.price / book.original_price) * 100) > 0 && (
          <div className="absolute top-0 right-0 z-10 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-bold py-1 px-2 shadow-md">
            {Math.round((1 - book.price / book.original_price) * 100)}% OFF
          </div>
        )}
        
        <Link href={`/produto/${book.slug}`} className="block">
          <div className="relative aspect-[5/7] w-full bg-primary-50 overflow-hidden">
            <Image 
              src={book.cover_image || "/images/book-placeholder.jpg"}
              alt={book.title}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            
            {/* Overlay de hover */}
            <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white bg-opacity-90 text-primary-800 font-medium py-1 px-3 rounded-full transform transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 text-sm">
                  Ver detalhes
                </span>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Indicador de disponibilidade */}
        <div className="absolute top-2 left-2">
          {isAvailable ? (
            <Badge variant="success" size="sm" rounded>Em estoque</Badge>
          ) : (
            <Badge variant="error" size="sm" rounded>Indisponível</Badge>
          )}
        </div>
      </div>
      
      <div className="card-body p-3">
        <div className="mb-1">
          <p className="text-xs text-primary-500 font-medium uppercase tracking-wider">{categoryName}</p>
        </div>
        
        <Link href={`/produto/${book.slug}`} className="block group">
          <h3 className="heading-display text-base text-primary-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-xs text-primary-600 mb-2 italic">{book.author}</p>
        
        <div className="flex flex-wrap items-center justify-between mt-auto pt-2 border-t border-primary-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-lg font-display font-bold text-primary-800">
                R${book.price.toFixed(2)}
              </span>
              {book.original_price && book.original_price > book.price && (
                <span className="text-xs text-primary-400 line-through ml-2">
                  R${book.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-primary-400 mt-0.5">
              {book.pages || 0} páginas
            </div>
          </div>
          
          <Button
            variant="primary" 
            size="sm"
            onClick={handleAdicionarAoCarrinho}
            disabled={!isAvailable}
            className={`rounded-full ${botaoAnimado ? 'animate-cart-pulse' : ''}`}
            leftIcon={
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
} 