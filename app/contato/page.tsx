'use client';

import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContatoPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!nome || !email || !mensagem) {
      showToast('warning', 'Formulário incompleto', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Email inválido', 'Por favor, informe um email válido.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulando envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Limpar formulário
      setNome('');
      setEmail('');
      setAssunto('');
      setMensagem('');
      
      showToast('success', 'Mensagem enviada!', 'Entraremos em contato o mais breve possível.');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      showToast('error', 'Erro ao enviar mensagem', 'Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="bg-primary-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">Entre em Contato</h1>
          <p className="text-lg text-primary-600 mb-10">Estamos aqui para ajudar! Preencha o formulário abaixo ou utilize um de nossos canais de atendimento.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Informações de contato */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm h-full">
                <h2 className="text-xl font-semibold text-primary-800 mb-6">Informações</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <Mail className="text-primary-600 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-800">E-mail</h3>
                      <p className="text-primary-600">contato@livraria.com</p>
                      <p className="text-primary-600">atendimento@livraria.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <Phone className="text-primary-600 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-800">Telefone</h3>
                      <p className="text-primary-600">(11) 3456-7890</p>
                      <p className="text-primary-600">(11) 98765-4321</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <MapPin className="text-primary-600 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-800">Endereço</h3>
                      <p className="text-primary-600">Rua dos Livros, 123</p>
                      <p className="text-primary-600">São Paulo, SP - 01234-567</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-primary-100">
                  <h3 className="font-medium text-primary-800 mb-3">Horário de Atendimento</h3>
                  <p className="text-primary-600">Segunda a Sexta: 9h às 18h</p>
                  <p className="text-primary-600">Sábado: 9h às 13h</p>
                </div>
              </div>
            </div>
            
            {/* Formulário de contato */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-primary-800 mb-6">Envie uma mensagem</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-primary-700 mb-1">Nome completo *</label>
                      <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">E-mail *</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="seu.email@exemplo.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-primary-700 mb-1">Assunto</label>
                    <input
                      type="text"
                      id="assunto"
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-primary-700 mb-1">Mensagem *</label>
                    <textarea
                      id="mensagem"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Sua mensagem..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar mensagem
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Mapa */}
          <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Nossa Localização</h2>
            <div className="rounded-lg overflow-hidden h-96 bg-primary-100">
              <div className="w-full h-full flex items-center justify-center text-primary-500">
                <span className="text-lg font-medium">Mapa da localização será exibido aqui</span>
                {/* Aqui você pode incorporar um mapa do Google, por exemplo */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 