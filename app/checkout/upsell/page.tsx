'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCarrinho } from '../../context/CarrinhoContext';
import { Book } from '../../lib/supabase';
import { Livro } from '../../types';
import BookCard from '../../components/BookCard';
import Button from '../../components/Button';

export default function UpsellPage() {
  const router = useRouter();
  const { carrinho, adicionarItem } = useCarrinho();
  const [livrosRecomendados, setLivrosRecomendados] = useState<Book[]>([]);
  const [livrosASelecionados, setLivrosASelecionados] = useState<number>(0);
  const [livrosSelecionados, setLivrosSelecionados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [dadosCliente, setDadosCliente] = useState<any>(null);

  // Carregar dados do cliente do localStorage
  useEffect(() => {
    const dadosClienteStr = localStorage.getItem('dadosCliente');
    if (dadosClienteStr) {
      try {
        const dados = JSON.parse(dadosClienteStr);
        setDadosCliente(dados);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      }
    }
  }, []);

  // Calcular quantos livros faltam para completar 4
  useEffect(() => {
    const totalLivros = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
    const faltam = Math.max(0, 4 - totalLivros);
    setLivrosASelecionados(faltam);

    // Se já tiver 4 ou mais livros, pular para a confirmação
    if (faltam === 0) {
      router.push('/checkout/confirmacao');
    }
  }, [carrinho.itens, router]);

  // Gerar recomendações de livros do Supabase
  useEffect(() => {
    // IDs dos livros que já estão no carrinho
    const idsNoCarrinho = carrinho.itens.map(item => item.livro.id);
    
    // Buscar livros recomendados baseados nos bestsellers ou featured
    async function buscarRecomendacoes() {
      try {
        const response = await fetch('/api/books?bestseller=true&limit=10');
        const data = await response.json();
        
        if (data.success) {
          // Filtramos os livros que já estão no carrinho
          const recomendacoes = data.data.filter((livro: Book) => 
            !idsNoCarrinho.includes(livro.id)
          );
          
          setLivrosRecomendados(recomendacoes.slice(0, 8));
        }
      } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
      }
    }
    
    buscarRecomendacoes();
  }, [carrinho.itens]);

  const toggleSelecionarLivro = (livroId: string) => {
    setLivrosSelecionados(prevSelecionados => {
      if (prevSelecionados.includes(livroId)) {
        // Remover o livro da seleção
        return prevSelecionados.filter(id => id !== livroId);
      } else {
        // Adicionar o livro à seleção, mas não permitir mais que o limite
        if (prevSelecionados.length < livrosASelecionados) {
          return [...prevSelecionados, livroId];
        }
        return prevSelecionados;
      }
    });
  };

  const adicionarAoCarrinho = () => {
    setCarregando(true);
    
    // Para cada livro selecionado, adicionar ao carrinho
    livrosSelecionados.forEach(async (livroId) => {
      const livro = livrosRecomendados.find(l => l.id === livroId);
      if (livro) {
        // Converter o formato Book para o formato Livro que o carrinho espera
        const livroAdaptado: Livro = {
          id: livro.id,
          titulo: livro.title,
          autor: livro.author,
          descricao: livro.description || '',
          preco: livro.price,
          precoOriginal: livro.original_price || undefined,
          imagemUrl: livro.cover_image || '',
          paginas: livro.pages || 0,
          categoria: livro.category?.name || '',
          isbn: livro.isbn || '',
          anoPublicacao: livro.publication_year || new Date().getFullYear(),
          disponivel: livro.stock && livro.stock > 0 ? true : false
        };
        
        adicionarItem(livroAdaptado);
      }
    });
    
    // Redirecionar para a tela de confirmação após adicionar os livros
    setTimeout(() => {
      router.push('/checkout/confirmacao');
    }, 500);
  };

  const finalizarPedido = () => {
    router.push('/checkout/confirmacao');
  };

  return (
    <div className="min-h-screen bg-primary-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">Aproveite nossa promoção especial!</h1>
            <p className="text-lg text-primary-600">
              Compre 4 livros e ganhe <span className="font-semibold">15% de desconto</span> no total!
            </p>
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm inline-block">
              <p className="text-primary-700">
                Você já tem <span className="font-bold">{4 - livrosASelecionados}</span> livro(s) no carrinho. 
                {livrosASelecionados > 0 && (
                  <span> Adicione mais <span className="font-bold text-primary-600">{livrosASelecionados}</span> para aproveitar o desconto!</span>
                )}
              </p>
            </div>
          </div>
          
          {livrosASelecionados > 0 ? (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-primary-800 mb-4">
                  Recomendações personalizadas para você
                </h2>
                <p className="text-primary-600 mb-6">
                  Selecione {livrosASelecionados} livro(s) abaixo para completar sua oferta:
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {livrosRecomendados.map((livro) => (
                    <div key={livro.id} className="relative">
                      <div className={`
                        absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center transition-opacity
                        ${livrosSelecionados.includes(livro.id) ? 'opacity-100' : 'opacity-0 hover:opacity-80'}
                      `}>
                        <button 
                          onClick={() => toggleSelecionarLivro(livro.id)}
                          className={`
                            rounded-full p-3
                            ${livrosSelecionados.includes(livro.id) 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-white text-primary-600 border border-primary-600'}
                          `}
                        >
                          {livrosSelecionados.includes(livro.id) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div 
                        className={`border-2 rounded-lg overflow-hidden transition-all ${
                          livrosSelecionados.includes(livro.id) 
                            ? 'border-primary-600 shadow-md transform scale-[1.02]' 
                            : 'border-transparent'
                        }`}
                      >
                        <div className="relative h-56 bg-primary-50">
                          <Image 
                            src={livro.cover_image || '/images/book-placeholder.jpg'} 
                            alt={livro.title} 
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-primary-800 line-clamp-1">{livro.title}</h3>
                          <p className="text-xs text-primary-600 line-clamp-1">{livro.author}</p>
                          <p className="text-sm font-semibold text-primary-700 mt-1">
                            R${livro.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-primary-600">
                    {livrosSelecionados.length} de {livrosASelecionados} livros selecionados
                  </p>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="secondary" 
                      onClick={finalizarPedido}
                    >
                      Pular esta oferta
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={adicionarAoCarrinho}
                      disabled={livrosSelecionados.length === 0 || carregando}
                    >
                      {carregando ? 'Adicionando...' : `Adicionar ${livrosSelecionados.length > 0 ? livrosSelecionados.length : ''} ao carrinho`}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/images/shopping-success.svg"
                  alt="Sucesso"
                  width={150}
                  height={150}
                />
              </div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">
                Parabéns! Você já tem o mínimo de livros para o desconto especial!
              </h2>
              <p className="text-primary-600 mb-6">
                Continue para finalizar seu pedido e aproveitar 15% de desconto no total.
              </p>
              <Button 
                variant="primary" 
                onClick={finalizarPedido}
                size="lg"
              >
                Continuar para finalizar pedido
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 