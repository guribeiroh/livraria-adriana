'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

// Dados fictícios de depoimentos de clientes
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marina Silva',
    role: 'Professora',
    avatar: '/images/testimonials/avatar-1.jpg',
    content: 'A Livraria JessyKaroline transformou minha experiência de compra de livros. A curadoria é impecável e sempre encontro exatamente o que procuro, além de descobrir novas joias literárias que nunca teria encontrado sozinha.',
    rating: 5
  },
  {
    id: 2,
    name: 'Ricardo Almeida',
    role: 'Engenheiro',
    avatar: '/images/testimonials/avatar-2.jpg',
    content: 'O atendimento é excepcional. Fiz um pedido especial de um livro que não estava disponível e eles não só conseguiram para mim como entregaram antes do prazo prometido. Cliente fiel daqui para frente!',
    rating: 5
  },
  {
    id: 3,
    name: 'Juliana Costa',
    role: 'Estudante',
    avatar: '/images/testimonials/avatar-3.jpg',
    content: 'Como estudante, o programa de fidelidade e os descontos exclusivos fazem toda a diferença. A qualidade dos livros é excelente e a entrega é sempre rápida. Recomendo a todos os amantes de literatura!',
    rating: 4
  },
  {
    id: 4,
    name: 'Carlos Mendes',
    role: 'Escritor',
    avatar: '/images/testimonials/avatar-4.jpg',
    content: 'Como escritor, valorizo muito o espaço que a Livraria JessyKaroline dá para autores nacionais. O cuidado com cada livro, desde a escolha até a embalagem para entrega, demonstra o amor pela literatura que permeia todo o negócio.',
    rating: 5
  }
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="heading-display text-3xl md:text-4xl text-primary-800 mb-4">O que nossos clientes dizem</h2>
          <p className="text-primary-600 text-lg leading-relaxed">
            A opinião de quem já viveu a experiência JessyKaroline
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Depoimentos em carrossel */}
          <div className="relative h-full">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-all duration-700 transform ${
                  index === active 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : 'opacity-0 absolute inset-0 translate-x-20 scale-95'
                }`}
              >
                <div className="bg-white rounded-3xl shadow-soft p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100 relative">
                        <Image 
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-4 justify-center md:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      
                      <blockquote className="italic text-primary-700 text-center md:text-left leading-relaxed mb-6">
                        "{testimonial.content}"
                      </blockquote>
                      
                      <div className="text-center md:text-left">
                        <p className="font-bold text-primary-800">{testimonial.name}</p>
                        <p className="text-sm text-primary-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicadores do carrossel */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === active ? 'bg-primary-600 w-6' : 'bg-primary-200'
                }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 