'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useBookDetail } from '../../hooks/useBooks';
import { Livro } from '../../types';
import { useCarrinho } from '../../context/CarrinhoContext';
import Link from 'next/link';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import BookCard from '../../components/BookCard';
import { Book } from '../../lib/supabase';

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const { book, isLoading, error } = useBookDetail(params.id);
  const [quantidade, setQuantidade] = useState(1);
  const [tabAtiva, setTabAtiva] = useState<'descricao' | 'detalhes'>('descricao');
  const { adicionarItem } = useCarrinho();
  const [botaoAnimado, setBotaoAnimado] = useState(false);
  const [livrosRelacionados, setLivrosRelacionados] = useState<Book[]>([]);

  // Buscar livros relacionados quando o livro carrega
  useEffect(() => {
    if (book && book.category?.id) {
      // Podemos utilizar a API para buscar livros da mesma categoria
      fetch(`/api/books/category/${book.category.slug}?limit=4`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Filtrar o livro atual dos relacionados
            const relacionados = data.data.filter((l: Book) => l.id !== book.id);
            setLivrosRelacionados(relacionados.slice(0, 4));
          }
        })
        .catch(err => console.error('Erro ao buscar livros relacionados:', err));
    }
  }, [book]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50">
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-md p-10">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 aspect-[3/4] bg-gray-200 rounded"></div>
                <div className="md:w-2/3 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/3 mt-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
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
    // Converter do formato Book para o formato que o carrinho espera (Livro)
    const livroAdaptado: Livro = {
      id: book.id,
      titulo: book.title,
      autor: book.author,
      descricao: book.description || '',
      preco: book.price,
      precoOriginal: book.original_price || undefined,
      imagemUrl: book.cover_image || '',
      paginas: book.pages || 0,
      categoria: book.category?.name || '',
      isbn: book.isbn || '',
      anoPublicacao: book.publication_year || new Date().getFullYear(),
      disponivel: book.stock && book.stock > 0 ? true : false
    };
    
    for (let i = 0; i < quantidade; i++) {
      adicionarItem(livroAdaptado);
    }
    
    // Ativar animação do botão
    setBotaoAnimado(true);
    setTimeout(() => {
      setBotaoAnimado(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-primary-50 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-primary-600 flex items-center">
          <Link href="/" className="hover:text-primary-800 transition-colors">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/categoria/${book.category?.slug}`} className="hover:text-primary-800 transition-colors">
            {book.category?.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary-400">{book.title}</span>
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
                  src={book.cover_image || '/placeholder.jpg'}
                  alt={book.title}
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
              <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">{book.title}</h1>
              <p className="text-xl text-primary-600 mb-4">por <span className="font-medium">{book.author}</span></p>
              
              <div className="flex space-x-2 mb-4">
                <Badge>{book.category?.name}</Badge>
                {book.stock && book.stock > 0 ? (
                  <Badge variant="success">Em estoque</Badge>
                ) : (
                  <Badge variant="error">Indisponível</Badge>
                )}
              </div>

              <div className="bg-primary-50 p-5 rounded-lg mb-6 border border-primary-100">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary-800">R${book.price.toFixed(2)}</span>
                  {book.original_price && book.original_price > book.price && (
                    <span className="ml-2 text-lg text-primary-400 line-through">
                      R${book.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-primary-600 mt-1">
                  {book.stock && book.stock > 0 ? 'Pronta entrega' : 'Indisponível'}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-primary-700 line-clamp-3">{book.description}</p>
                <button 
                  onClick={() => setTabAtiva('descricao')}
                  className="text-sm text-primary-600 hover:text-primary-800 hover:underline mt-2"
                >
                  Ler mais
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <p><span className="font-semibold">Categoria:</span> {book.category?.name}</p>
                {book.publication_year && <p><span className="font-semibold">Ano:</span> {book.publication_year}</p>}
                {book.pages && <p><span className="font-semibold">Páginas:</span> {book.pages}</p>}
                {book.isbn && <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>}
                {book.publisher && <p><span className="font-semibold">Editora:</span> {book.publisher}</p>}
                {book.language && <p><span className="font-semibold">Idioma:</span> {book.language}</p>}
                {book.format && <p><span className="font-semibold">Formato:</span> {book.format}</p>}
              </div>

              {book.stock && book.stock > 0 && (
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
                <p className="text-primary-700">{book.description}</p>
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
                        <td className="py-2">{book.title}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Autor</td>
                        <td className="py-2">{book.author}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Categoria</td>
                        <td className="py-2">{book.category?.name}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Ano de Publicação</td>
                        <td className="py-2">{book.publication_year}</td>
                      </tr>
                      <tr className="border-b border-primary-100">
                        <td className="py-2 font-medium">Páginas</td>
                        <td className="py-2">{book.pages}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">ISBN</td>
                        <td className="py-2">{book.isbn}</td>
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
        <section className="container mx-auto px-4 pt-16">
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">Livros relacionados</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
            {livrosRelacionados.map((livroRelacionado, index) => (
              <BookCard key={livroRelacionado.id} book={livroRelacionado} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 