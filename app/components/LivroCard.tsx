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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
      <Link href={`/produto/${livro.id}`} className="block">
        <div className="relative h-64 w-full bg-gray-200">
          <Image 
            src={livro.imagemUrl || "https://via.placeholder.com/300x400?text=Sem+Imagem"}
            alt={livro.titulo}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/produto/${livro.id}`} className="block">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">{livro.titulo}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3">{livro.autor}</p>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-500">{livro.categoria}</p>
          {livro.disponivel ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Em estoque</span>
          ) : (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Indisponível</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">R${livro.preco.toFixed(2)}</span>
          <button
            onClick={() => adicionarItem(livro)}
            disabled={!livro.disponivel}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              livro.disponivel
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
} 