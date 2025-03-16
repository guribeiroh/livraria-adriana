'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen pb-12">
      {/* Hero section da página Sobre */}
      <section className="relative bg-primary-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* Padrão decorativo */}
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
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-fade-in">
              Nossa História
            </h1>
            <p className="text-lg md:text-xl opacity-90 animate-slide-up">
              Conheça a trajetória, missão e valores da Livraria JessyKaroline
            </p>
          </div>
        </div>
      </section>
      
      {/* Seção de História */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary-800 mb-6">Como Tudo Começou</h2>
              <p className="text-primary-700 mb-4">
                A Livraria JessyKaroline nasceu em 2015, fruto da paixão pela literatura de seus fundadores, Jessy e Karoline. 
                O que começou como uma pequena livraria física na região central da cidade, rapidamente se transformou em um 
                espaço cultural de referência.
              </p>
              <p className="text-primary-700 mb-4">
                Com o crescimento do comércio eletrônico, demos o próximo passo em 2018 e lançamos nossa plataforma online, 
                permitindo que mais pessoas tivessem acesso ao nosso acervo cuidadosamente selecionado.
              </p>
              <p className="text-primary-700">
                Hoje, somos reconhecidos não apenas pelo nosso catálogo diversificado, mas também pelo atendimento personalizado e 
                pelo compromisso com a disseminação da cultura através dos livros.
              </p>
            </div>
            
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <Image 
                  src="/images/sobre/livraria-fundacao.jpg" 
                  alt="Fundação da Livraria JessyKaroline" 
                  width={600} 
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-primary-100 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção de Missão, Visão e Valores */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-12">
            O Que Nos Move
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-800 text-center mb-4">Nossa Missão</h3>
              <p className="text-primary-700 text-center">
                Democratizar o acesso à literatura de qualidade, contribuindo para a formação de 
                leitores críticos e apaixonados através de um acervo diversificado e cuidadosamente selecionado.
              </p>
            </div>
            
            {/* Visão */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-800 text-center mb-4">Nossa Visão</h3>
              <p className="text-primary-700 text-center">
                Ser reconhecida como a principal referência em experiência de compra de livros no Brasil, 
                unindo tradição e inovação para proporcionar momentos únicos de descoberta literária.
              </p>
            </div>
            
            {/* Valores */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-800 text-center mb-4">Nossos Valores</h3>
              <ul className="text-primary-700 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Paixão pela literatura</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Atendimento humanizado</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Diversidade de conteúdo</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Compromisso com a qualidade</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Responsabilidade social</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Equipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-6">
            Nossa Equipe
          </h2>
          <p className="text-primary-700 text-center max-w-3xl mx-auto mb-12">
            Conheça os apaixonados por literatura que trabalham diariamente para proporcionar a melhor experiência para nossos clientes.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Membro da equipe 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80">
                <Image 
                  src="/images/sobre/team-1.jpg" 
                  alt="Jessy Santos" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-800 mb-1">Jessy Santos</h3>
                <p className="text-primary-600 text-sm mb-3">Co-fundadora & CEO</p>
                <p className="text-primary-700">
                  Apaixonada por literatura clássica, Jessy lidera nossa equipe com criatividade e visão estratégica.
                </p>
              </div>
            </div>
            
            {/* Membro da equipe 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80">
                <Image 
                  src="/images/sobre/team-2.jpg" 
                  alt="Karoline Oliveira" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-800 mb-1">Karoline Oliveira</h3>
                <p className="text-primary-600 text-sm mb-3">Co-fundadora & Diretora de Curadoria</p>
                <p className="text-primary-700">
                  Com um olhar atento para novos talentos literários, Karoline é responsável pela nossa seleção única de obras.
                </p>
              </div>
            </div>
            
            {/* Membro da equipe 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80">
                <Image 
                  src="/images/sobre/team-3.jpg" 
                  alt="Rafael Mendes" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-800 mb-1">Rafael Mendes</h3>
                <p className="text-primary-600 text-sm mb-3">Gerente de Experiência do Cliente</p>
                <p className="text-primary-700">
                  Garantir a satisfação dos nossos clientes é a missão diária de Rafael e sua dedicada equipe.
                </p>
              </div>
            </div>
            
            {/* Membro da equipe 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80">
                <Image 
                  src="/images/sobre/team-4.jpg" 
                  alt="Mariana Costa" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-800 mb-1">Mariana Costa</h3>
                <p className="text-primary-600 text-sm mb-3">Diretora de Marketing</p>
                <p className="text-primary-700">
                  Criativa e inovadora, Mariana desenvolve estratégias que conectam os amantes da leitura aos livros perfeitos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Final */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Faça Parte da Nossa História
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Venha conhecer nossa livraria, explorar nosso acervo e descobrir novos mundos através das páginas dos nossos livros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/busca"
              className="bg-white text-primary-800 hover:bg-primary-50 py-3 px-8 rounded-full font-medium transition-colors"
            >
              Explorar Catálogo
            </Link>
            <Link 
              href="/contato"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 py-3 px-8 rounded-full font-medium transition-colors"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 