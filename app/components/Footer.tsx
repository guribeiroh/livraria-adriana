import Button from './Button';

export default function Footer() {
  const anoAtual = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-100 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
            <h3 className="heading-serif text-xl mb-6 text-primary-800">Livraria JessyKaroline</h3>
            <p className="text-primary-700 leading-relaxed">
              Sua livraria online com os melhores títulos nacionais e internacionais.
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="heading-serif text-xl mb-6 text-primary-800">Atendimento</h3>
            <ul className="space-y-3 text-primary-700">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contato@jessykaroline.com.br
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (11) 5555-5555
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Segunda a Sexta: 9h às 18h
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="heading-serif text-xl mb-6 text-primary-800">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-700 hover:text-primary-800 transition-colors hover:translate-x-1 inline-block">Sobre Nós</a></li>
              <li><a href="#" className="text-primary-700 hover:text-primary-800 transition-colors hover:translate-x-1 inline-block">Política de Privacidade</a></li>
              <li><a href="#" className="text-primary-700 hover:text-primary-800 transition-colors hover:translate-x-1 inline-block">Termos de Uso</a></li>
              <li><a href="#" className="text-primary-700 hover:text-primary-800 transition-colors hover:translate-x-1 inline-block">Fale Conosco</a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="heading-serif text-xl mb-6 text-primary-800">Newsletter</h3>
            <p className="text-primary-700 mb-4 leading-relaxed">
              Inscreva-se para receber novidades e ofertas especiais.
            </p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="input"
              />
              <Button variant="primary">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-200 mt-12 pt-8 text-center text-primary-600">
          <p>&copy; {anoAtual} Livraria JessyKaroline. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}