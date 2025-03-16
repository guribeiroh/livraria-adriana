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

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Clara Oliveira',
    role: 'Professora de Literatura',
    avatar: '/images/testimonials/avatar-1.jpg',
    content: 'A curadoria de livros da JessyKaroline é impecável! Sempre encontro obras raras e edições especiais que não vejo em outras livrarias. O atendimento é personalizado e as entregas são rápidas.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rafael Mendes',
    role: 'Escritor',
    avatar: '/images/testimonials/avatar-2.jpg',
    content: 'Como escritor, valorizo muito livrarias que valorizam a literatura nacional. A JessyKaroline não só tem uma seleção incrível de autores brasileiros, como também promove eventos e lançamentos que apoiam nossa cultura literária.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mariana Costa',
    role: 'Estudante de Letras',
    avatar: '/images/testimonials/avatar-3.jpg',
    content: 'Os preços são muito competitivos e o programa de fidelidade realmente compensa. Já economizei bastante comprando meus livros acadêmicos aqui, sem falar na qualidade do acervo disponível.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Pedro Almeida',
    role: 'Leitor Ávido',
    avatar: '/images/testimonials/avatar-4.jpg',
    content: 'A experiência de navegação no site é excelente, muito intuitiva. As recomendações são sempre pertinentes ao meu gosto literário, o que mostra atenção aos clientes. Recomendo a todos!',
    rating: 5,
  },
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
        
        <div className="max-w-4xl mx-auto">
          {/* Carrossel de depoimentos */}
          <div className="relative bg-white rounded-2xl shadow-elevated overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600"></div>
            
            <div className="p-8 md:p-12">
              <div className="relative h-[300px]">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === active 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-24'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      {/* Aspas decorativas */}
                      <svg className="text-primary-100 w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      
                      {/* Conteúdo */}
                      <p className="text-lg md:text-xl text-primary-700 leading-relaxed italic mb-8 flex-grow">
                        "{testimonial.content}"
                      </p>
                      
                      {/* Informações do cliente */}
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary-800">{testimonial.name}</h4>
                          <p className="text-primary-500 text-sm">{testimonial.role}</p>
                        </div>
                        <div className="ml-auto flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Indicadores */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === active ? 'bg-primary-600 w-10' : 'bg-primary-300'
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