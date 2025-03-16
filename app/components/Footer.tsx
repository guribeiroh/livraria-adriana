import Button from './Button';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const anoAtual = new Date().getFullYear();
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de inscrição na newsletter
    alert(`Email ${email} inscrito com sucesso!`);
    setEmail('');
  };
  
  return (
    <footer className="relative overflow-hidden">
      {/* Faixa decorativa superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-accent-500 to-secondary-400"></div>
      
      {/* Fundo com ondas decorativas */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#b08c69" fillOpacity="1" d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,213.3C672,213,768,171,864,144C960,117,1056,107,1152,128C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Conteúdo principal */}
      <div className="bg-primary-50 pt-16 pb-10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Logo e informações */}
            <div className="md:col-span-4 animate-fade-in" style={{ animationDelay: '0ms' }}>
              <h3 className="heading-display text-2xl text-primary-800 mb-6">Livraria JessyKaroline</h3>
              <p className="text-primary-700 leading-relaxed mb-6 opacity-90">
                Sua jornada literária começa aqui. Descubra uma seleção cuidadosa dos melhores títulos nacionais e internacionais.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-primary-700 hover:bg-primary-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-primary-700 hover:bg-primary-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://twitter.com" className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-primary-700 hover:bg-primary-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Links rápidos */}
            <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="heading-display text-lg text-primary-800 mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/busca" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Todos os Livros
                  </Link>
                </li>
                <li>
                  <Link href="/busca?categoria=lancamentos" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Lançamentos
                  </Link>
                </li>
                <li>
                  <Link href="/busca?categoria=mais-vendidos" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Mais Vendidos
                  </Link>
                </li>
                <li>
                  <Link href="/busca?categoria=promocoes" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Promoções
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Informações */}
            <div className="md:col-span-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="heading-display text-lg text-primary-800 mb-6">Informações</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/sobre" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-privacidade" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos-de-uso" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/fale-conosco" className="text-primary-700 hover:text-primary-900 transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="md:col-span-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="heading-display text-lg text-primary-800 mb-6">Newsletter</h3>
              <p className="text-primary-700 mb-4 leading-relaxed opacity-90">
                Inscreva-se para receber novidades, lançamentos e ofertas exclusivas diretamente no seu email.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Seu e-mail" 
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
                <Button variant="primary" type="submit" fullWidth>
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-primary-100 py-4 text-center text-primary-600 relative z-10">
        <div className="container mx-auto px-4">
          <p className="text-sm">&copy; {anoAtual} Livraria JessyKaroline. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}