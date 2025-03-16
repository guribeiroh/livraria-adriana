'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Livro } from '../types';
import { useCarrinho } from '../context/CarrinhoContext';
import Badge from './Badge';
import Button from './Button';

interface LivroCardProps {
  livro: Livro;
}

export default function LivroCard({ livro }: LivroCardProps) {
  const { adicionarItem } = useCarrinho();

  return (
    <div className="card group animate-fade-in">
      <Link href={`/produto/${livro.id}`} className="block">
        <div className="relative h-64 w-full bg-primary-50 overflow-hidden">
          <Image 
            src={livro.imagemUrl || "https://via.placeholder.com/300x400?text=Sem+Imagem"}
            alt={livro.titulo}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="group-hover:scale-105 transition-transform duration-500"
          />
          {livro.precoOriginal && livro.precoOriginal > livro.preco && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 font-bold"
            >
              {Math.round((1 - livro.preco / livro.precoOriginal) * 100)}% OFF
            </Badge>
          )}
        </div>
      </Link>
      <div className="card-body">
        <Link href={`/produto/${livro.id}`} className="block">
          <h3 className="heading-serif text-lg text-primary-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{livro.titulo}</h3>
        </Link>
        <p className="text-sm text-primary-600 mb-3">{livro.autor}</p>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-primary-500">{livro.categoria}</p>
          {livro.disponivel ? (
            <Badge variant="success" size="sm">Em estoque</Badge>
          ) : (
            <Badge variant="error" size="sm">Indisponível</Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-primary-800">R${livro.preco.toFixed(2)}</span>
            {livro.precoOriginal && livro.precoOriginal > livro.preco && (
              <span className="text-sm text-primary-400 line-through ml-2">
                R${livro.precoOriginal.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            variant="primary" 
            size="sm"
            onClick={() => adicionarItem(livro)}
            disabled={!livro.disponivel}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}