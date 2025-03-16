'use client';

import { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export default function FeatureCard({ 
  title, 
  description, 
  icon,
  delay = 0
}: FeatureCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <div 
      ref={ref}
      className={`bg-white rounded-2xl p-6 transition-all duration-700 transform shadow-card 
      hover:shadow-elevated border border-primary-100 group ${
        inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-5 bg-primary-50 w-14 h-14 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 group-hover:rotate-3 transform">
        {icon}
      </div>
      
      <h3 className="heading-display text-xl mb-3 text-primary-800 group-hover:text-primary-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-primary-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function FeatureSection() {
  return (
    <section className="py-16 bg-primary-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-display text-3xl md:text-4xl text-primary-800 mb-4">Por que escolher a JessyKaroline?</h2>
          <p className="text-primary-600 text-lg leading-relaxed">
            Oferecemos uma experiência de compra única para os amantes de literatura
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Curadoria Literária"
            description="Nossa equipe de especialistas seleciona cuidadosamente cada título para garantir uma coleção de qualidade."
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            delay={0}
          />
          
          <FeatureCard 
            title="Entrega Rápida"
            description="Enviamos seu pedido com rapidez e segurança, para que você possa começar sua leitura o quanto antes."
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            }
            delay={150}
          />
          
          <FeatureCard 
            title="Atendimento Personalizado"
            description="Nossa equipe está pronta para ajudar com recomendações personalizadas baseadas no seu gosto literário."
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
            delay={300}
          />
          
          <FeatureCard 
            title="Preços Competitivos"
            description="Oferecemos os melhores preços do mercado, com promoções especiais e descontos exclusivos para clientes fiéis."
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            delay={450}
          />
        </div>
      </div>
    </section>
  );
} 