'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { livros } from '../../data/livros';
import { Livro } from '../../types';
import { useCarrinho } from '../../context/CarrinhoContext';
import Link from 'next/link';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const [livro, setLivro] = useState<Livro | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [tabAtiva, setTabAtiva] = useState<'descricao' | 'detalhes'>('descricao');
  const { adicionarItem } = useCarrinho();
  const [botaoAnimado, setBotaoAnimado] = useState(false);

  useEffect(() => {
    const livroEncontrado = livros.find(l => l.id === params.id);
    if (livroEncontrado) {
      setLivro(livroEncontrado);
    }
  }, [params.id]);

  if (!livro) {
    return (
      <div className="min-h-screen bg-primary-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-xl shadow-md p-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-primary-800">Produto não encontrado</h2>
            <p className="text-primary-600 mb-6">O livro que você está procurando não foi encontrado em nosso catálogo.</p>
            <Link href="/">
              <Button variant="primary">Voltar para a página inicial</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAdicionarAoCarrinho = () => {
    for (let i = 0; i < quantidade; i++) {
      adicionarItem(livro);
    }
    
    // Ativar animação do botão
    setBotaoAnimado(true);
    setTimeout(() => {
      setBotaoAnimado(false);
    }, 600);
  };

  // Livros relacionados - mesma categoria
  const livrosRelacionados = livros
    .filter(l => l.categoria === livro.categoria && l.id !== livro.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-primary-50 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-primary-600 flex items-center">
          <Link href="/" className="hover:text-primary-800 transition-colors">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/categoria/${livro.categoria.toLowerCase()}`} className="hover:text-primary-800 transition-colors">
            {livro.categoria}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary-400">{livro.titulo}</span>
        </div>
      </div>

      {/* Detalhe do produto */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Imagem do livro */}
            <div className="flex flex-col space-y-4">
              <div className="relative w-full aspect-[5/8] max-w-md mx-auto bg-primary-50 rounded-lg overflow-hidden border border-primary-100">
                <Image
                  src={livro.imagemUrl}
                  alt={livro.titulo}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Detalhes do livro */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">{livro.titulo}</h1>
              <p className="text-xl text-primary-600 mb-4">por <span className="font-medium">{livro.autor}</span></p>
              
              <div className="flex space-x-2 mb-4">
                <Badge>{livro.categoria}</Badge>
                {livro.disponivel ? (
                  <Badge variant="success">Em estoque</Badge>
                ) : (
                  <Badge variant="error">Indisponível</Badge>
                )}
              </div>

              <div className="bg-primary-50 p-5 rounded-lg mb-6 border border-primary-100">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary-800">R${livro.preco.toFixed(2)}</span>
                  {livro.precoOriginal && livro.precoOriginal > livro.preco && (
                    <span className="ml-2 text-lg text-primary-400 line-through">
                      R${livro.precoOriginal.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-primary-600 mt-1">
                  {livro.disponivel ? 'Pronta entrega' : 'Indisponível'}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-primary-700 line-clamp-3">{livro.descricao}</p>
                <button 
                  onClick={() => setTabAtiva('descricao')}
                  className="text-sm text-primary-600 hover:text-primary-800 hover:underline mt-2"
                >
                  Ler mais
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-primary-600 mb-8 bg-primary-50 p-4 rounded-lg border border-primary-100">
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
                <div className="mt-auto space-y-4">
                  <div className="flex items-center">
                    <label htmlFor="quantidade" className="mr-3 text-primary-800 font-medium">Quantidade:</label>
                    <div className="flex items-center border border-primary-200 rounded-md overflow-hidden">
                      <button 
                        className="w-10 h-10 flex items-center justify-center text-primary-700 hover:bg-primary-50 active:bg-primary-100 transition-colors"
                        onClick={() => setQuantidade(prev => Math.max(1, prev - 1))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center text-primary-800 font-medium border-x border-primary-200">{quantidade}</span>
                      <button 
                        className="w-10 h-10 flex items-center justify-center text-primary-700 hover:bg-primary-50 active:bg-primary-100 transition-colors"
                        onClick={() => setQuantidade(prev => prev + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleAdicionarAoCarrinho}
                    variant="primary"
                    fullWidth
                    size="lg"
                    className={botaoAnimado ? 'animate-cart-pulse' : ''}
                    leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs de informações */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="border-b border-primary-100">
            <div className="flex">
              <button
                onClick={() => setTabAtiva('descricao')}
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  tabAtiva === 'descricao' 
                    ? 'text-primary-800 border-b-2 border-primary-600' 
                    : 'text-primary-500 hover:text-primary-700'
                }`}
              >
                Descrição
              </button>
              <button
                onClick={() => setTabAtiva('detalhes')}
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  tabAtiva === 'detalhes' 
                    ? 'text-primary-800 border-b-2 border-primary-600' 
                    : 'text-primary-500 hover:text-primary-700'
                }`}
              >
                Detalhes do livro
              </button>
            </div>
          </div>
          <div className="p-8">
            {tabAtiva === 'descricao' && (
              <div className="prose prose-primary max-w-none">
                <p className="text-primary-700">{livro.descricao}</p>
                <p className="text-primary-700 mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, 
                  nisi nisl aliquam nunc, vitae aliquam nisl nunc sit amet nunc. Sed euismod, nunc sit amet ultricies lacinia,
                  nisi nisl aliquam nunc, vitae aliquam nisl nunc sit amet nunc.
                </p>
              </div>
            )}
            {tabAtiva === 'detalhes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-primary-800 mb-3">Informações do Livro</h3>
                  <table className="w-full text-sm text-primary-700">
                    <tbody>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Título</td>
                        <td className="py-2">{livro.titulo}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Autor</td>
                        <td className="py-2">{livro.autor}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Categoria</td>
                        <td className="py-2">{livro.categoria}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Ano de Publicação</td>
                        <td className="py-2">{livro.anoPublicacao}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Páginas</td>
                        <td className="py-2">{livro.paginas}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">ISBN</td>
                        <td className="py-2">{livro.isbn}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary-800 mb-3">Especificações</h3>
                  <table className="w-full text-sm text-primary-700">
                    <tbody>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Idioma</td>
                        <td className="py-2">Português</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Acabamento</td>
                        <td className="py-2">Capa comum</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Dimensões</td>
                        <td className="py-2">23 x 16 x 2 cm</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Peso</td>
                        <td className="py-2">400g</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Editora</td>
                        <td className="py-2">Editora Fictícia</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Edição</td>
                        <td className="py-2">1ª Edição</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Livros relacionados */}
        {livrosRelacionados.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">Você também pode gostar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {livrosRelacionados.map(livroRel => (
                <Link href={`/produto/${livroRel.id}`} key={livroRel.id} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
                    <div className="relative aspect-[5/8] w-full bg-primary-50">
                      <Image 
                        src={livroRel.imagemUrl} 
                        alt={livroRel.titulo}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary-800 line-clamp-1 group-hover:text-primary-600 transition-colors">{livroRel.titulo}</h3>
                      <p className="text-primary-600 text-sm">{livroRel.autor}</p>
                      <p className="text-primary-800 font-bold mt-2">R${livroRel.preco.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 