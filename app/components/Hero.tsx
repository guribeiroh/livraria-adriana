'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeroImageProps {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const HERO_IMAGES: HeroImageProps[] = [
  {
    src: '/images/hero/hero-1.jpg',
    alt: 'Coleção de livros clássicos',
    title: 'Descubra Novos Mundos',
    subtitle: 'Explore nossa coleção de clássicos da literatura mundial',
    buttonText: 'Ver Coleção',
    buttonLink: '/busca?categoria=classicos',
  },
  {
    src: '/images/hero/hero-2.jpg',
    alt: 'Lançamentos literários',
    title: 'Novidades Literárias',
    subtitle: 'Fique por dentro dos melhores lançamentos do mercado editorial',
    buttonText: 'Ver Lançamentos',
    buttonLink: '/busca?categoria=lancamentos',
  },
  {
    src: '/images/hero/hero-3.jpg',
    alt: 'Livros em promoção',
    title: 'Promoções Especiais',
    subtitle: 'Encontre os melhores preços em livros selecionados para você',
    buttonText: 'Ver Promoções',
    buttonLink: '/busca?categoria=promocoes',
  },
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const currentImage = HERO_IMAGES[currentImageIndex];
  
  return (
    <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* Imagens em carrossel com transição suave */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      
      {/* Conteúdo do Hero */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 animate-fade-in">
          {currentImage.title}
        </h1>
        
        <p className="text-lg md:text-xl max-w-3xl mb-8 animate-slide-up">
          {currentImage.subtitle}
        </p>
        
        {/* Campo de busca */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-2xl mb-8 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="relative flex glass rounded-full overflow-hidden p-1">
            <input
              type="text"
              placeholder="O que você está procurando?"
              className="w-full py-3 px-6 bg-transparent border-none outline-none text-white placeholder-white placeholder-opacity-75"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-white text-primary-800 px-6 py-3 rounded-full font-medium hover:bg-primary-50 transition"
            >
              Buscar
            </button>
          </div>
        </form>
        
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Link 
            href={currentImage.buttonLink}
            className="btn bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-full text-lg"
          >
            {currentImage.buttonText}
          </Link>
        </div>
      </div>
      
      {/* Indicadores do slider */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? 'bg-white w-10' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
} 