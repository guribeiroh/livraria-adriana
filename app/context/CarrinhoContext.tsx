'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Livro, ItemCarrinho, Carrinho } from '../types';

interface CarrinhoContextType {
  carrinho: Carrinho;
  adicionarItem: (livro: Livro) => void;
  removerItem: (livroId: string) => void;
  atualizarQuantidade: (livroId: string, quantidade: number) => void;
  limparCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider: React.FC<CarrinhoProviderProps> = ({ children }) => {
  const [carrinho, setCarrinho] = useState<Carrinho>({
    itens: [],
    total: 0
  });

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      try {
        const carrinhoParseado = JSON.parse(carrinhoSalvo);
        setCarrinho(carrinhoParseado);
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
        localStorage.removeItem('carrinho');
      }
    }
  }, []);

  // Salvar carrinho no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  // Calcular total sempre que os itens forem alterados
  useEffect(() => {
    const novoTotal = carrinho.itens.reduce(
      (acc, item) => acc + item.livro.preco * item.quantidade,
      0
    );
    setCarrinho(prevCarrinho => ({
      ...prevCarrinho,
      total: novoTotal
    }));
  }, [carrinho.itens]);

  const adicionarItem = (livro: Livro) => {
    setCarrinho(prevCarrinho => {
      const itemExistente = prevCarrinho.itens.find(
        item => item.livro.id === livro.id
      );

      if (itemExistente) {
        // Se o item já existe, incrementa a quantidade
        return {
          ...prevCarrinho,
          itens: prevCarrinho.itens.map(item =>
            item.livro.id === livro.id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          )
        };
      } else {
        // Se o item não existe, adiciona ao carrinho
        return {
          ...prevCarrinho,
          itens: [...prevCarrinho.itens, { livro, quantidade: 1 }]
        };
      }
    });
  };

  const removerItem = (livroId: string) => {
    setCarrinho(prevCarrinho => ({
      ...prevCarrinho,
      itens: prevCarrinho.itens.filter(item => item.livro.id !== livroId)
    }));
  };

  const atualizarQuantidade = (livroId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(livroId);
      return;
    }

    setCarrinho(prevCarrinho => ({
      ...prevCarrinho,
      itens: prevCarrinho.itens.map(item =>
        item.livro.id === livroId ? { ...item, quantidade } : item
      )
    }));
  };

  const limparCarrinho = () => {
    setCarrinho({ itens: [], total: 0 });
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}; 