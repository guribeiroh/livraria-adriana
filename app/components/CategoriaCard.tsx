'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CategoriaCardProps {
  titulo: string;
  descricao: string;
  imagemUrl: string;
  slug: string;
  quantidadeLivros: number;
  index: number;
}

export default function CategoriaCard({
  titulo,
  descricao,
  imagemUrl,
  slug,
  quantidadeLivros,
  index,
}: CategoriaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Delay para animação de entrada
  const animationDelay = `${index * 100}ms`;
  
  return (
    <Link href={`/busca?categoria=${slug}`}>
      <div 
        className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer animate-fade-in"
        style={{ animationDelay }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Imagem de fundo com zoom suave no hover */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={imagemUrl}
            alt={titulo}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Gradiente para melhorar leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Conteúdo do cartão */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex items-center mb-2">
            <span className="bg-primary-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {quantidadeLivros} {quantidadeLivros === 1 ? 'livro' : 'livros'}
            </span>
          </div>
          
          <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-accent-400 transition-colors">
            {titulo}
          </h3>
          
          <p className="text-sm text-white text-opacity-80 mb-4 line-clamp-2 transform transition-all duration-300 max-h-0 group-hover:max-h-20">
            {descricao}
          </p>
          
          <div className="inline-flex items-center font-medium group-hover:text-accent-400 transition-colors">
            Explorar
            <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 