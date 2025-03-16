'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Livro } from '../types';
import { useCarrinho } from '../context/CarrinhoContext';

interface LivroCardProps {
  livro: Livro;
}

export default function LivroCard({ livro }: LivroCardProps) {
  const { adicionarItem } = useCarrinho();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link href={`/produto/${livro.id}`}>
        <div className="relative h-60 w-full">
          <Image 
            src={livro.imagemUrl} 
            alt={livro.titulo}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/produto/${livro.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-700 transition">{livro.titulo}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{livro.autor}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">R${livro.preco.toFixed(2)}</span>
          <button
            onClick={() => adicionarItem(livro)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
} 