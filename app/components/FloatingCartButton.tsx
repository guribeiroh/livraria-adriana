'use client';

import { useState, useEffect } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import Link from 'next/link';

export default function FloatingCartButton() {
  const { carrinho } = useCarrinho();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [totalItens, setTotalItens] = useState(0);

  // Atualiza a contagem de itens sempre que o carrinho mudar
  useEffect(() => {
    const novoTotal = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
    
    // Se o total aumentou, adiciona uma animação
    if (novoTotal > totalItens && totalItens > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    
    setTotalItens(novoTotal);
  }, [carrinho.itens, totalItens]);

  // Esconde o botão quando estiver na página do carrinho
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/carrinho' || pathname === '/checkout') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible || totalItens === 0) return null;

  return (
    <Link href="/carrinho">
      <button
        className={`fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20 ${
          isAnimating ? 'animate-cart-pulse' : 'animate-fade-in'
        }`}
        aria-label="Ver carrinho"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        
        {totalItens > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalItens > 99 ? '99+' : totalItens}
          </span>
        )}
      </button>
    </Link>
  );
} 