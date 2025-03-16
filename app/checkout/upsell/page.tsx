'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCarrinho } from '../../context/CarrinhoContext';
import { livros } from '../../data/livros';
import { Livro } from '../../types';

export default function UpsellPage() {
  const router = useRouter();
  const { carrinho, adicionarItem } = useCarrinho();
  const [livrosRecomendados, setLivrosRecomendados] = useState<Livro[]>([]);
  const [livrosaSelecionar, setLivrosASelecionar] = useState<number>(0);
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
    setLivrosASelecionar(faltam);

    // Se já tiver 4 ou mais livros, pular para a confirmação
    if (faltam === 0) {
      router.push('/checkout/confirmacao');
    }
  }, [carrinho.itens, router]);

  // Gerar recomendações de livros
  useEffect(() => {
    // IDs dos livros que já estão no carrinho
    const idsNoCarrinho = carrinho.itens.map(item => item.livro.id);
    
    // Categorias dos livros no carrinho para recomendar livros semelhantes
    const categoriasNoCarrinho = [...new Set(carrinho.itens.map(item => item.livro.categoria))];
    
    // Filtra livros que não estão no carrinho e prioriza os da mesma categoria
    const livrosDisponiveis = livros.filter(livro => 
      !idsNoCarrinho.includes(livro.id) && livro.disponivel
    );
    
    // Ordena por prioridade (primeiro os das mesmas categorias)
    const livrosOrdenados = [...livrosDisponiveis].sort((a, b) => {
      const aTemCategoria = categoriasNoCarrinho.includes(a.categoria) ? 1 : 0;
      const bTemCategoria = categoriasNoCarrinho.includes(b.categoria) ? 1 : 0;
      return bTemCategoria - aTemCategoria;
    });
    
    // Pega os primeiros N livros (onde N é o que falta para 4)
    setLivrosRecomendados(livrosOrdenados.slice(0, livrosaSelecionar + 2)); // +2 para dar mais opções
  }, [livrosaSelecionar, carrinho.itens]);

  // Alternar seleção de livro
  const toggleSelecionarLivro = (livroId: string) => {
    if (livrosSelecionados.includes(livroId)) {
      // Remover da seleção
      setLivrosSelecionados(prev => prev.filter(id => id !== livroId));
    } else {
      // Verificar se já atingiu o máximo
      if (livrosSelecionados.length < livrosaSelecionar) {
        // Adicionar à seleção
        setLivrosSelecionados(prev => [...prev, livroId]);
      }
    }
  };

  // Adicionar todos os livros selecionados ao carrinho
  const adicionarAoCarrinho = () => {
    for (const livroId of livrosSelecionados) {
      const livro = livros.find(l => l.id === livroId);
      if (livro) {
        adicionarItem(livro);
      }
    }
  };

  // Finalizar pedido (adicionar ao carrinho e ir para página de confirmação)
  const finalizarPedido = () => {
    setCarregando(true);
    
    // Adicionar livros selecionados ao carrinho
    adicionarAoCarrinho();
    
    // Simular processamento
    setTimeout(() => {
      router.push('/checkout/confirmacao');
      setCarregando(false);
    }, 1000);
  };

  // Se já tem 4 livros, não exibe esta página
  if (livrosaSelecionar === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Oferta Especial!</h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="bg-primary-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold text-primary-800 mb-2">
            Monte seu combo de 4 livros!
          </h2>
          <p className="text-gray-700">
            {livrosaSelecionar === 1 ? (
              <>Falta apenas <strong>1 livro</strong> para completar seu combo de 4 livros!</>
            ) : (
              <>Faltam <strong>{livrosaSelecionar} livros</strong> para completar seu combo de 4 livros!</>
            )}
          </p>
          <p className="mt-2 text-primary-600 font-medium">
            Selecione {livrosaSelecionar === 1 ? 'o livro' : 'os livros'} que deseja adicionar:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {livrosRecomendados.map(livro => (
            <div 
              key={livro.id} 
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all 
                ${livrosSelecionados.includes(livro.id) 
                  ? 'border-primary-500 shadow-md transform scale-105' 
                  : 'border-gray-200 hover:border-primary-300'}`}
              onClick={() => toggleSelecionarLivro(livro.id)}
            >
              <div className="aspect-[5/8] relative">
                <Image 
                  src={livro.imagemUrl} 
                  alt={livro.titulo}
                  fill
                  className="object-contain"
                />
                {livrosSelecionados.includes(livro.id) && (
                  <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2">{livro.titulo}</h3>
                <p className="text-gray-600 text-sm">{livro.autor}</p>
                <p className="text-primary-600 font-bold mt-2">R$ {livro.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <Link 
            href="/checkout"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-center hover:bg-gray-50 transition-colors"
          >
            Voltar
          </Link>
          
          <div className="flex-1 sm:text-right">
            <p className="text-gray-700 mb-2">
              {livrosSelecionados.length} de {livrosaSelecionar} livros selecionados
            </p>
            
            <button
              type="button"
              onClick={finalizarPedido}
              disabled={carregando || (livrosaSelecionar > 0 && livrosSelecionados.length === 0)}
              className={`px-6 py-3 rounded-md text-white transition-colors ${
                livrosaSelecionar === livrosSelecionados.length || livrosaSelecionar === 0
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : livrosSelecionados.length > 0
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {carregando 
                ? 'Processando...' 
                : livrosSelecionados.length === 0 
                  ? 'Selecione ao menos um livro' 
                  : livrosaSelecionar === livrosSelecionados.length 
                    ? 'Finalizar Pedido' 
                    : 'Continuar sem completar o combo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 