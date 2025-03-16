'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { Livro, Carrinho, ItemCarrinho } from '../types';

interface CarrinhoContextType {
  carrinho: Carrinho;
  adicionarItem: (livro: Livro) => void;
  removerItem: (livroId: string) => void;
  atualizarQuantidade: (livroId: string, quantidade: number) => void;
  limparCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<Carrinho>({
    itens: [],
    total: 0
  });

  function calcularTotal(itens: ItemCarrinho[]): number {
    return itens.reduce((total, item) => total + (item.livro.preco * item.quantidade), 0);
  }

  function adicionarItem(livro: Livro) {
    setCarrinho(prevCarrinho => {
      const itemExistente = prevCarrinho.itens.find(item => item.livro.id === livro.id);
      
      let novosItens;
      
      if (itemExistente) {
        novosItens = prevCarrinho.itens.map(item => 
          item.livro.id === livro.id 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      } else {
        novosItens = [...prevCarrinho.itens, { livro, quantidade: 1 }];
      }
      
      return {
        itens: novosItens,
        total: calcularTotal(novosItens)
      };
    });
  }

  function removerItem(livroId: string) {
    setCarrinho(prevCarrinho => {
      const novosItens = prevCarrinho.itens.filter(item => item.livro.id !== livroId);
      
      return {
        itens: novosItens,
        total: calcularTotal(novosItens)
      };
    });
  }

  function atualizarQuantidade(livroId: string, quantidade: number) {
    if (quantidade < 1) return;
    
    setCarrinho(prevCarrinho => {
      const novosItens = prevCarrinho.itens.map(item => 
        item.livro.id === livroId 
          ? { ...item, quantidade } 
          : item
      );
      
      return {
        itens: novosItens,
        total: calcularTotal(novosItens)
      };
    });
  }

  function limparCarrinho() {
    setCarrinho({
      itens: [],
      total: 0
    });
  }

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
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  
  return context;
} 