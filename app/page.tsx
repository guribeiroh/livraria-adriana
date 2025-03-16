'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { livros } from './data/livros';
import { Livro } from './types';
import { useCarrinho } from './context/CarrinhoContext';

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const [livro, setLivro] = useState<Livro | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarItem } = useCarrinho();

  useEffect(() => {
    const livroEncontrado = livros.find(l => l.id === params.id);
    if (livroEncontrado) {
      setLivro(livroEncontrado);
    }
  }, [params.id]);

  if (!livro) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <p>O livro que você está procurando não foi encontrado em nosso catálogo.</p>
      </div>
    );
  }

  const handleAdicionarAoCarrinho = () => {
    for (let i = 0; i < quantidade; i++) {
      adicionarItem(livro);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Imagem do livro */}
          <div className="relative h-[400px] md:h-[500px] w-full">
            <Image
              src={livro.imagemUrl}
              alt={livro.titulo}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Detalhes do livro */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{livro.titulo}</h1>
            <p className="text-xl text-gray-600 mb-4">por {livro.autor}</p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <span className="text-2xl font-bold text-blue-800">R${livro.preco.toFixed(2)}</span>
              <p className="text-sm text-blue-600 mt-1">
                {livro.disponivel ? 'Em estoque' : 'Indisponível'}
              </p>
            </div>

            <p className="text-gray-700 mb-6">{livro.descricao}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-8">
              <div>
                <p><span className="font-semibold">Categoria:</span> {livro.categoria}</p>
                <p><span className="font-semibold">Ano:</span> {livro.anoPublicacao}</p>
              </div>
              <div>
                <p><span className="font-semibold">Páginas:</span> {livro.paginas}</p>
                <p><span className="font-semibold">ISBN:</span> {livro.isbn}</p>
              </div>
            </div>

            {livro.disponivel && (
              <div className="mt-auto">
                <div className="flex items-center mb-4">
                  <label htmlFor="quantidade" className="mr-3 text-gray-700">Quantidade:</label>
                  <div className="flex items-center border rounded">
                    <button 
                      className="px-3 py-1 border-r"
                      onClick={() => setQuantidade(prev => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantidade}</span>
                    <button 
                      className="px-3 py-1 border-l"
                      onClick={() => setQuantidade(prev => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAdicionarAoCarrinho}
                  className="w-full bg-blue-600 text-white py-3 rounded-md text-lg hover:bg-blue-700 transition"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 