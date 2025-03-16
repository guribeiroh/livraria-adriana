'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/app/lib/supabase';

interface UseBooksOptions {
  featured?: boolean;
  bestseller?: boolean;
  categorySlug?: string;
  limit?: number;
  initialOffset?: number;
}

export function useBooks({
  featured = false,
  bestseller = false,
  categorySlug,
  limit = 20,
  initialOffset = 0
}: UseBooksOptions = {}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(true);

  const loadBooks = async (resetBooks = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let url;
      
      if (categorySlug) {
        // Buscar livros por categoria
        url = `/api/books/category/${categorySlug}?limit=${limit}&offset=${resetBooks ? 0 : offset}`;
      } else {
        // Buscar livros normais, em destaque ou mais vendidos
        url = `/api/books?limit=${limit}&offset=${resetBooks ? 0 : offset}`;
        
        if (featured) {
          url += '&featured=true';
        } else if (bestseller) {
          url += '&bestseller=true';
        }
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar livros');
      }

      if (resetBooks) {
        setBooks(data.data);
        setOffset(limit);
      } else {
        setBooks(prev => [...prev, ...data.data]);
        setOffset(prev => prev + limit);
      }

      // Verifica se há mais livros para carregar
      setHasMore(data.data.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar livros');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega livros na inicialização
  useEffect(() => {
    loadBooks(true);
  }, [categorySlug, featured, bestseller, limit]); // Recarregar quando os filtros mudarem

  // Função para carregar mais livros (paginação)
  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadBooks();
    }
  };

  // Função para recarregar os livros
  const refresh = () => {
    setOffset(0);
    loadBooks(true);
  };

  return {
    books,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}

export function useBookDetail(slug: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/books/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar livro');
        }

        setBook(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar livro');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBook();
    }
  }, [slug]);

  return {
    book,
    isLoading,
    error
  };
}

export function useBookSearch(query: string, limit = 20) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        
        // Se não houver query, buscar todos os livros
        if (!query.trim()) {
          response = await fetch(`/api/books?limit=${limit}`);
        } else {
          response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        }
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro na busca');
        }

        setBooks(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro na busca');
      } finally {
        setIsLoading(false);
      }
    };

    // Adiciona um pequeno debounce para não fazer muitas chamadas API
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, limit]);

  return {
    books,
    isLoading,
    error
  };
} 