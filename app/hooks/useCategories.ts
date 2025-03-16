'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/app/lib/supabase';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar categorias');
        }

        setCategories(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar categorias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error
  };
} 