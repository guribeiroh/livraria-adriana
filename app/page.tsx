'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from './lib/supabase';
import { getFeaturedBooks, getBestsellerBooks, getNewBooks } from './lib/database';
import BookCard from './components/BookCard';
import Hero from './components/Hero';
import { FeatureSection } from './components/FeatureCard';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';
import SectionTitle from './components/SectionTitle';

export default function HomePage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [livrosDestaque, setLivrosDestaque] = useState<Book[]>([]);
  const [livrosLancamentos, setLivrosLancamentos] = useState<Book[]>([]);
  const [categoriasFeatured, setCategoriasFeatured] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Buscar dados dos livros do Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar livros em destaque
        const featuredBooks = await getFeaturedBooks(8);
        setLivrosDestaque(featuredBooks);
        
        // Buscar lançamentos
        const newBooks = await getNewBooks(4);
        setLivrosLancamentos(newBooks);
        
        // Extrair categorias únicas dos livros
        const categorias = new Set<string>();
        featuredBooks.forEach(book => {
          if (book.category?.name) {
            categorias.add(book.category.name);
          }
        });
        
        setCategoriasFeatured(Array.from(categorias).slice(0, 4));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Renderização condicional durante carregamento
  const renderSkeletonCard = () => (
    <div className="bg-gray-100 animate-pulse rounded-lg overflow-hidden">
      <div className="aspect-[5/8] w-full bg-gray-200"></div>
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      {/* Hero Section com Carrossel */}
      <Hero />
      
      {/* Seção de Características */}
      <FeatureSection />
      
      {/* Seção de Livros em Destaque */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionTitle align="center" withAccent={false}>
            Livros em Destaque
          </SectionTitle>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-10">
            {isLoading ? (
              Array(8).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`}>{renderSkeletonCard()}</div>
              ))
            ) : livrosDestaque.length > 0 ? (
              livrosDestaque.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">Nenhum livro em destaque encontrado.</p>
            )}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <Link href="/busca?categoria=mais-vendidos" className="btn-primary">
              Ver Mais Vendidos
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Banner Promocional */}
      <section className="relative py-16 bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-white">
            <h2 className="heading-display text-3xl md:text-4xl mb-4">Promoção de Lançamentos</h2>
            <p className="text-lg opacity-90 mb-6">
              Adquira os melhores lançamentos literários com até 30% de desconto por tempo limitado.
            </p>
            <Link 
              href="/busca?categoria=promocoes" 
              className="inline-block bg-white text-primary-800 font-medium py-3 px-6 rounded-full hover:bg-primary-50 transition-colors"
            >
              Ver Promoções
            </Link>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="relative aspect-[3/4] w-full max-w-xs mx-auto">
              <div className="absolute inset-0 rotate-6 transform transition-transform hover:rotate-0 duration-300">
                <div className="w-full h-full shadow-xl rounded-lg overflow-hidden">
                  <Image 
                    src="/images/promocao-livros.jpg" 
                    alt="Promoção de livros" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção de Lançamentos */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Acabaram de chegar"
            align="center"
          >
            Novos Lançamentos
          </SectionTitle>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-10">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={`skeleton-launch-${index}`}>{renderSkeletonCard()}</div>
              ))
            ) : livrosLancamentos.length > 0 ? (
              livrosLancamentos.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">Nenhum lançamento encontrado.</p>
            )}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <Link href="/busca?categoria=lancamentos" className="btn-primary">
              Ver Lançamentos
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Seção de Depoimentos */}
      <Testimonials />
      
      {/* CTA Section */}
      <CtaSection />
    </main>
  );
} 