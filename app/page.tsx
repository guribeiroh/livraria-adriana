'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { livros } from './data/livros';
import LivroCard from './components/LivroCard';
import Hero from './components/Hero';
import { FeatureSection } from './components/FeatureCard';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';
import SectionTitle from './components/SectionTitle';

export default function HomePage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [livrosDestaque, setLivrosDestaque] = useState<typeof livros>([]);
  const [livrosLancamentos, setLivrosLancamentos] = useState<typeof livros>([]);
  const [categoriasFeatured, setCategoriasFeatured] = useState<string[]>([]);
  
  // Simulando obtenção de dados
  useEffect(() => {
    // Livros em destaque (4 livros aleatórios)
    const shuffled = [...livros].sort(() => 0.5 - Math.random());
    setLivrosDestaque(shuffled.slice(0, 8));
    
    // Lançamentos (4 livros mais recentes)
    const sortedByDate = [...livros].sort((a, b) => b.anoPublicacao - a.anoPublicacao);
    setLivrosLancamentos(sortedByDate.slice(0, 4));
    
    // Categorias em destaque
    const allCategorias = Array.from(new Set(livros.map(livro => livro.categoria)));
    setCategoriasFeatured(allCategorias.slice(0, 4));
  }, []);

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
            {livrosDestaque.map((livro, index) => (
              <LivroCard key={livro.id} livro={livro} index={index} />
            ))}
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
            title="Novos Lançamentos"
            align="center"
          >
            <p className="text-primary-600 max-w-2xl mx-auto text-center">
              Fique por dentro das últimas novidades literárias. Novas histórias e aventuras para explorar.
            </p>
          </SectionTitle>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-10">
            {livrosLancamentos.map((livro, index) => (
              <LivroCard key={livro.id} livro={livro} index={index} />
            ))}
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