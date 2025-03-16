'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from './Button';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para inscrição na newsletter
    alert(`Email ${email} inscrito com sucesso!`);
    setEmail('');
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Fundo com gradiente e padrão */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bookPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M30 10h8v80h-8V10zm32 0h8v80h-8V10zM0 30h100v8H0v-8zm0 32h100v8H0v-8z" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#bookPattern)" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-elevated p-8 md:p-12 overflow-hidden relative">
          {/* Elemento decorativo */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent-400 opacity-20 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary-400 opacity-20 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h2 className="heading-display text-3xl text-primary-800 mb-4">
                Comece Sua Jornada Literária Hoje
              </h2>
              <p className="text-primary-600 mb-8 leading-relaxed">
                Inscreva-se em nossa newsletter e ganhe 10% de desconto na primeira compra, além de receber novidades, recomendações personalizadas e ofertas exclusivas.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="input w-full pr-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                    fullWidth
                    className="group"
                  >
                    <span>Inscrever-se</span>
                    <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                  
                  <Link href="/busca" className="hidden sm:block">
                    <Button 
                      variant="outline"
                      fullWidth
                      className="group"
                    >
                      <span>Explorar Catálogo</span>
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
            
            <div className="relative md:pl-8 z-10">
              <div className="p-6 bg-primary-50 rounded-xl border border-primary-100">
                <h3 className="heading-serif text-xl text-primary-800 mb-4">
                  Benefícios da assinatura
                </h3>
                <ul className="space-y-3">
                  {[
                    'Desconto de 10% na primeira compra',
                    'Acesso antecipado a lançamentos',
                    'Ofertas exclusivas para assinantes',
                    'Curadoria literária personalizada',
                    'Frete grátis em compras acima de R$100',
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-primary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 