'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Livro, ItemCarrinho, Carrinho } from '../types';

interface CarrinhoContextType {
  carrinho: Carrinho;
  adicionarItem: (livro: Livro) => void;
  removerItem: (livroId: string) => void;
  atualizarQuantidade: (livroId: string, quantidade: number) => void;
  limparCarrinho: () => void;
  ultimoItemAdicionado: ItemCarrinho | null;
  itemAdicionadoRecentemente: boolean;
  fecharNotificacao: () => void;
  valorTotal: number;
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
  
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [ultimoItemAdicionado, setUltimoItemAdicionado] = useState<ItemCarrinho | null>(null);
  const [itemAdicionadoRecentemente, setItemAdicionadoRecentemente] = useState(false);

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      try {
        const carrinhoParseado = JSON.parse(carrinhoSalvo);
        setCarrinho(carrinhoParseado);
        
        // Calcular o valor total inicial
        if (carrinhoParseado.itens && Array.isArray(carrinhoParseado.itens)) {
          const total = carrinhoParseado.itens.reduce(
            (acc: number, item: ItemCarrinho) => acc + (item.livro.preco || 0) * (item.quantidade || 0),
            0
          );
          setValorTotal(total);
        }
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
    if (!carrinho.itens || !Array.isArray(carrinho.itens)) {
      setValorTotal(0);
      setCarrinho(prev => ({
        ...prev,
        total: 0
      }));
      return;
    }
    
    const novoTotal = carrinho.itens.reduce(
      (acc: number, item: ItemCarrinho) => {
        const preco = item.livro?.preco || 0;
        const quantidade = item.quantidade || 0;
        return acc + preco * quantidade;
      },
      0
    );
    
    setValorTotal(novoTotal);
    setCarrinho(prevCarrinho => ({
      ...prevCarrinho,
      total: novoTotal
    }));
  }, [carrinho.itens]);
  
  // Limpar notificação após alguns segundos
  useEffect(() => {
    if (itemAdicionadoRecentemente) {
      const timeout = setTimeout(() => {
        setItemAdicionadoRecentemente(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [itemAdicionadoRecentemente]);

  const adicionarItem = (livro: Livro) => {
    setCarrinho(prevCarrinho => {
      const itemExistente = prevCarrinho.itens.find(
        item => item.livro.id === livro.id
      );

      let novosItens: ItemCarrinho[];
      let itemAtualizado: ItemCarrinho;

      if (itemExistente) {
        // Se o item já existe, incrementa a quantidade
        itemAtualizado = { ...itemExistente, quantidade: itemExistente.quantidade + 1 };
        novosItens = prevCarrinho.itens.map(item =>
          item.livro.id === livro.id ? itemAtualizado : item
        );
      } else {
        // Se o item não existe, adiciona ao carrinho
        itemAtualizado = { livro, quantidade: 1 };
        novosItens = [...prevCarrinho.itens, itemAtualizado];
      }
      
      // Atualizar último item adicionado e ativar a notificação
      setUltimoItemAdicionado(itemAtualizado);
      setItemAdicionadoRecentemente(true);
      
      return {
        ...prevCarrinho,
        itens: novosItens
      };
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
  
  const fecharNotificacao = () => {
    setItemAdicionadoRecentemente(false);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        ultimoItemAdicionado,
        itemAdicionadoRecentemente,
        fecharNotificacao,
        valorTotal
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}; 