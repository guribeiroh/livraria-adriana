'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type FormData = {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
  form?: string;
};

export default function ContatoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.assunto.trim()) {
      newErrors.assunto = 'Assunto é obrigatório';
    }
    
    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setEnviando(true);
    
    // Simular envio para uma API
    try {
      // Aqui você substituiria por uma chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMensagemSucesso('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErrors({
        ...errors,
        form: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.'
      });
    } finally {
      setEnviando(false);
    }
  };
  
  return (
    <main className="min-h-screen pb-16">
      {/* Header da página */}
      <section className="relative bg-primary-700 text-white py-16 md:py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-fade-in">
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl opacity-90 animate-slide-up">
              Estamos aqui para responder suas dúvidas, ouvir suas sugestões e atender suas necessidades
            </p>
          </div>
        </div>
      </section>
      
      {/* Conteúdo principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulário de contato */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-primary-800 mb-6">Envie-nos uma mensagem</h2>
              
              {mensagemSucesso ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">Mensagem enviada!</span>
                  </div>
                  <p>{mensagemSucesso}</p>
                  <button 
                    onClick={() => setMensagemSucesso(null)}
                    className="mt-4 w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Enviar nova mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errors.form && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                      {errors.form}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="nome" className="block text-sm font-medium text-primary-700 mb-1">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Seu nome completo"
                    />
                    {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="seu.email@exemplo.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="assunto" className="block text-sm font-medium text-primary-700 mb-1">
                      Assunto <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${errors.assunto ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Dúvida sobre produto">Dúvida sobre produto</option>
                      <option value="Informações sobre pedido">Informações sobre pedido</option>
                      <option value="Reclamação">Reclamação</option>
                      <option value="Sugestão">Sugestão</option>
                      <option value="Outros">Outros</option>
                    </select>
                    {errors.assunto && <p className="mt-1 text-sm text-red-600">{errors.assunto}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="mensagem" className="block text-sm font-medium text-primary-700 mb-1">
                      Mensagem <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full p-3 border rounded-md ${errors.mensagem ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Escreva sua mensagem aqui..."
                    ></textarea>
                    {errors.mensagem && <p className="mt-1 text-sm text-red-600">{errors.mensagem}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full bg-primary-600 text-white py-3 rounded-md font-medium hover:bg-primary-700 transition ${
                      enviando ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </form>
              )}
            </div>
            
            {/* Informações de contato */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-6">Informações de Contato</h2>
              
              <div className="bg-primary-50 p-8 rounded-xl mb-8">
                <div className="space-y-6">
                  {/* Endereço */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-1">Endereço</h3>
                      <p className="text-primary-700">
                        Av. Paulista, 1500, Bela Vista<br />
                        São Paulo - SP, 01310-200<br />
                        Brasil
                      </p>
                    </div>
                  </div>
                  
                  {/* Telefone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-1">Telefone</h3>
                      <p className="text-primary-700">
                        +55 (11) 3456-7890<br />
                        +55 (11) 98765-4321
                      </p>
                      <p className="text-primary-600 text-sm mt-1">
                        Seg - Sex, 9:00 - 18:00
                      </p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-1">Email</h3>
                      <p className="text-primary-700">
                        contato@livrariajessy.com.br<br />
                        suporte@livrariajessy.com.br
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Redes sociais */}
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-primary-800 mb-4">Redes Sociais</h3>
                <p className="text-primary-700 mb-4">
                  Siga-nos e fique por dentro das novidades, promoções e dicas de leitura.
                </p>
                
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mapa (imagem representativa) */}
          <div className="mt-16 relative rounded-xl overflow-hidden shadow-lg h-[400px]">
            <div className="absolute inset-0 bg-primary-200 flex items-center justify-center">
              <p className="text-primary-600 text-lg">
                Mapa será carregado aqui (integração com Google Maps)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 