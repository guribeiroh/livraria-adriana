export default function Footer() {
  const anoAtual = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-800">Livraria JessyKaroline</h3>
            <p className="text-primary-700">
              Sua livraria online com os melhores títulos nacionais e internacionais.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-800">Atendimento</h3>
            <ul className="space-y-2 text-primary-700">
              <li>contato@jessykaroline.com.br</li>
              <li>(11) 5555-5555</li>
              <li>Segunda a Sexta: 9h às 18h</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-800">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-700 hover:text-primary-800">Sobre Nós</a></li>
              <li><a href="#" className="text-primary-700 hover:text-primary-800">Política de Privacidade</a></li>
              <li><a href="#" className="text-primary-700 hover:text-primary-800">Termos de Uso</a></li>
              <li><a href="#" className="text-primary-700 hover:text-primary-800">Fale Conosco</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-800">Newsletter</h3>
            <p className="text-primary-700 mb-2">
              Inscreva-se para receber novidades e ofertas especiais.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="px-3 py-2 border border-primary-200 rounded-l-md w-full"
              />
              <button className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700">
                Enviar
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-200 mt-8 pt-6 text-center text-primary-600">
          <p>&copy; {anoAtual} Livraria JessyKaroline. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 