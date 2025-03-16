'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificacaoCarrinho() {
  const { 
    ultimoItemAdicionado, 
    itemAdicionadoRecentemente, 
    fecharNotificacao,
    carrinho 
  } = useCarrinho();
  
  const [totalItens, setTotalItens] = useState(0);

  useEffect(() => {
    if (carrinho.itens.length > 0) {
      setTotalItens(carrinho.itens.reduce((total, item) => total + item.quantidade, 0));
    } else {
      setTotalItens(0);
    }
  }, [carrinho.itens]);

  return (
    <AnimatePresence>
      {itemAdicionadoRecentemente && ultimoItemAdicionado && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed top-24 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative">
            {/* Barra de progresso para indicar que a notificação irá desaparecer */}
            <div className="absolute bottom-0 left-0 h-1 bg-primary-600 animate-progress"></div>
            
            {/* Botão de fechar */}
            <button 
              onClick={fecharNotificacao}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Fechar notificação"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-800">Produto adicionado ao carrinho!</h3>
            </div>
            
            <div className="flex items-start mt-4">
              <div className="relative w-16 h-24 bg-primary-50 rounded overflow-hidden shrink-0 mr-3">
                <Image 
                  src={ultimoItemAdicionado.livro.imagemUrl} 
                  alt={ultimoItemAdicionado.livro.titulo}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-800">{ultimoItemAdicionado.livro.titulo}</p>
                <p className="text-xs text-primary-600">{ultimoItemAdicionado.livro.autor}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-primary-700">
                    {ultimoItemAdicionado.quantidade} {ultimoItemAdicionado.quantidade > 1 ? 'itens' : 'item'}
                  </span>
                  <span className="text-sm font-medium text-primary-800">
                    R$ {(ultimoItemAdicionado.livro.preco * ultimoItemAdicionado.quantidade).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-primary-600">
                  <span className="font-medium">{totalItens}</span> {totalItens === 1 ? 'item' : 'itens'} no carrinho
                </div>
                <div className="text-sm font-medium text-primary-800">
                  Total: R$ {carrinho.total.toFixed(2)}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  href="/carrinho" 
                  className="flex-1 py-2 px-3 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors text-center"
                >
                  Ver carrinho
                </Link>
                <Link 
                  href="/checkout" 
                  className="flex-1 py-2 px-3 border border-primary-600 text-primary-600 text-sm font-medium rounded-md hover:bg-primary-50 transition-colors text-center"
                >
                  Finalizar compra
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 