'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Livro } from '../types';
import { useCarrinho } from '../context/CarrinhoContext';
import Badge from './Badge';
import Button from './Button';

interface LivroCardProps {
  livro: Livro;
  index?: number;
}

export default function LivroCard({ livro, index = 0 }: LivroCardProps) {
  const { adicionarItem } = useCarrinho();
  const [isHovered, setIsHovered] = useState(false);
  
  // Atraso de animação baseado no índice
  const animationDelay = `${index * 100}ms`;
  
  return (
    <div 
      className="book-card-hover card group animate-fade-in"
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Ribbon de desconto */}
        {livro.precoOriginal && livro.precoOriginal > livro.preco && (
          <div className="absolute top-0 right-0 z-10 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-bold py-1.5 px-4 shadow-md transform rotate-45 translate-x-6 -translate-y-1">
            {Math.round((1 - livro.preco / livro.precoOriginal) * 100)}% OFF
          </div>
        )}
        
        <Link href={`/produto/${livro.id}`} className="block">
          <div className="relative aspect-[5/8] w-full bg-primary-50 overflow-hidden">
            <Image 
              src={livro.imagemUrl || "https://via.placeholder.com/625x998?text=Sem+Imagem"}
              alt={livro.titulo}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            
            {/* Overlay de hover */}
            <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white bg-opacity-90 text-primary-800 font-medium py-2 px-4 rounded-full transform transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100">
                  Ver detalhes
                </span>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Indicador de disponibilidade */}
        <div className="absolute top-3 left-3">
          {livro.disponivel ? (
            <Badge variant="success" size="sm" rounded>Em estoque</Badge>
          ) : (
            <Badge variant="error" size="sm" rounded>Indisponível</Badge>
          )}
        </div>
      </div>
      
      <div className="card-body">
        <div className="mb-2">
          <p className="text-xs text-primary-500 font-medium uppercase tracking-wider">{livro.categoria}</p>
        </div>
        
        <Link href={`/produto/${livro.id}`} className="block group">
          <h3 className="heading-display text-lg text-primary-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {livro.titulo}
          </h3>
        </Link>
        
        <p className="text-sm text-primary-600 mb-3 italic">{livro.autor}</p>
        
        <div className="flex flex-wrap items-center justify-between mt-auto pt-3 border-t border-primary-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-xl font-display font-bold text-primary-800">
                R${livro.preco.toFixed(2)}
              </span>
              {livro.precoOriginal && livro.precoOriginal > livro.preco && (
                <span className="text-sm text-primary-400 line-through ml-2">
                  R${livro.precoOriginal.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-primary-400 mt-1">
              {livro.paginas} páginas
            </div>
          </div>
          
          <Button
            variant="primary" 
            size="sm"
            onClick={() => adicionarItem(livro)}
            disabled={!livro.disponivel}
            className="rounded-full"
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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