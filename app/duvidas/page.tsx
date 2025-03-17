'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

// Tipo para as perguntas frequentes
type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

// Categorias de perguntas
const categories = [
  'Pedidos e Entrega',
  'Produtos',
  'Pagamento',
  'Conta e Privacidade',
  'Devolução e Troca'
];

// Lista de perguntas frequentes
const faqList: FAQ[] = [
  {
    id: '1',
    question: 'Qual o prazo para entrega dos livros?',
    answer: 'O prazo para entrega varia de acordo com a sua localização e a disponibilidade do produto. Para capitais e regiões metropolitanas, o prazo médio é de 3 a 5 dias úteis. Para cidades do interior e regiões mais afastadas, o prazo pode ser de 5 a 10 dias úteis. Você pode consultar o prazo estimado específico para seu CEP durante o processo de compra.',
    category: 'Pedidos e Entrega'
  },
  {
    id: '2',
    question: 'Como posso rastrear meu pedido?',
    answer: 'Após a confirmação do envio do seu pedido, você receberá um e-mail com o código de rastreamento. Você pode acompanhar a entrega acessando sua conta no site, na seção "Meus Pedidos", ou diretamente no site dos Correios utilizando o código fornecido.',
    category: 'Pedidos e Entrega'
  },
  {
    id: '3',
    question: 'Os livros têm garantia?',
    answer: 'Sim, todos os livros vendidos em nossa livraria possuem garantia contra defeitos de fabricação, como páginas faltantes, impressão defeituosa ou problemas de encadernação. Caso identifique algum defeito, entre em contato conosco em até 7 dias após o recebimento do produto.',
    category: 'Produtos'
  },
  {
    id: '4',
    question: 'Como sei se um livro está disponível em estoque?',
    answer: 'Na página de cada produto, você encontrará a informação de disponibilidade. Se o livro estiver em estoque, haverá a indicação "Em estoque" e a opção de compra estará ativa. Caso o produto esteja temporariamente indisponível, você poderá cadastrar seu e-mail para ser notificado quando o livro voltar ao estoque.',
    category: 'Produtos'
  },
  {
    id: '5',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos diversas formas de pagamento, incluindo cartões de crédito (Visa, Mastercard, American Express, Elo), cartões de débito, boleto bancário, PIX e pagamento via PayPal. Em compras com cartão de crédito, oferecemos a opção de parcelamento em até 10x sem juros, dependendo do valor da compra.',
    category: 'Pagamento'
  },
  {
    id: '6',
    question: 'O pagamento no site é seguro?',
    answer: 'Sim, utilizamos tecnologia de criptografia SSL para garantir a segurança de todas as transações. Além disso, não armazenamos dados de cartão de crédito em nossos servidores. Os pagamentos são processados por gateways de pagamento renomados e seguros.',
    category: 'Pagamento'
  },
  {
    id: '7',
    question: 'Como posso alterar minha senha?',
    answer: 'Para alterar sua senha, acesse sua conta no site e vá até a seção "Minha Conta" ou "Perfil". Lá você encontrará a opção "Alterar Senha". Caso tenha esquecido sua senha atual, utilize a opção "Esqueci minha senha" na página de login para receber instruções de redefinição por e-mail.',
    category: 'Conta e Privacidade'
  },
  {
    id: '8',
    question: 'É possível comprar sem criar uma conta?',
    answer: 'Sim, oferecemos a opção de compra como visitante. No entanto, recomendamos a criação de uma conta para facilitar o acompanhamento de pedidos, o acesso ao histórico de compras e para aproveitar promoções exclusivas para clientes cadastrados.',
    category: 'Conta e Privacidade'
  },
  {
    id: '9',
    question: 'Qual é a política de devolução?',
    answer: 'Você pode solicitar a devolução de produtos em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor. Para livros com defeito, o prazo é estendido para 30 dias. A devolução deve ser solicitada através da nossa Central de Atendimento, e o produto deve ser devolvido em sua embalagem original, sem sinais de uso.',
    category: 'Devolução e Troca'
  },
  {
    id: '10',
    question: 'Como faço para trocar um livro?',
    answer: 'Para solicitar uma troca, entre em contato com nossa Central de Atendimento em até 7 dias após o recebimento do produto. Explique o motivo da troca (tamanho, cor, defeito, etc.). Após a aprovação da solicitação, enviaremos instruções sobre como proceder com o envio do produto e o recebimento da nova mercadoria.',
    category: 'Devolução e Troca'
  }
];

export default function DuvidasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  
  // Filtrar perguntas com base na pesquisa e categoria selecionada
  const filteredFAQs = faqList.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === null || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Agrupar perguntas por categoria
  const faqsByCategory: Record<string, FAQ[]> = {};
  
  filteredFAQs.forEach(faq => {
    if (!faqsByCategory[faq.category]) {
      faqsByCategory[faq.category] = [];
    }
    faqsByCategory[faq.category].push(faq);
  });
  
  // Toggle para abrir/fechar perguntas
  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  return (
    <main className="bg-primary-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">Perguntas Frequentes</h1>
          <p className="text-lg text-primary-600 mb-10">Encontre respostas para as dúvidas mais comuns sobre nossa livraria, pedidos e produtos.</p>
          
          {/* Barra de pesquisa */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar pergunta ou resposta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Filtros por categoria */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-primary-700 hover:bg-primary-100'
              }`}
            >
              Todas
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-700 hover:bg-primary-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Lista de perguntas frequentes */}
          <div className="space-y-8">
            {Object.keys(faqsByCategory).length > 0 ? (
              Object.entries(faqsByCategory).map(([category, faqs]) => (
                <div key={category} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <h2 className="text-lg font-semibold text-primary-800 p-6 border-b border-primary-100">
                    {category}
                  </h2>
                  
                  <div className="divide-y divide-primary-100">
                    {faqs.map(faq => (
                      <div key={faq.id} className="cursor-pointer">
                        <button
                          onClick={() => toggleQuestion(faq.id)}
                          className="w-full flex justify-between items-center p-6 text-left"
                        >
                          <h3 className="text-primary-800 font-medium">{faq.question}</h3>
                          <span className="ml-4 flex-shrink-0 text-primary-500">
                            {openQuestions.includes(faq.id) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </span>
                        </button>
                        
                        {openQuestions.includes(faq.id) && (
                          <div className="px-6 pb-6 pt-0">
                            <p className="text-primary-600 whitespace-pre-line">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <p className="text-primary-600 mb-4">Nenhuma pergunta encontrada para sua busca.</p>
                <button
                  onClick={() => {setSearchQuery(''); setActiveCategory(null);}}
                  className="text-primary-700 font-medium hover:underline"
                >
                  Limpar filtros e mostrar todas as perguntas
                </button>
              </div>
            )}
          </div>
          
          {/* Seção de contato adicional */}
          <div className="mt-12 bg-white p-8 rounded-xl shadow-sm text-center">
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Não encontrou o que procurava?</h2>
            <p className="text-primary-600 mb-6">
              Entre em contato com nossa equipe de atendimento ao cliente para obter ajuda personalizada.
            </p>
            <a
              href="/contato"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 