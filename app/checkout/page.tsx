'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { carrinho } = useCarrinho();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    rua: '',
    cidade: '',
    estado: '',
    cep: ''
  });
  
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    telefone: '',
    rua: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro ao editar campo
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    // Validar telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
      isValid = false;
    }

    // Validar rua
    if (!formData.rua.trim()) {
      newErrors.rua = 'Rua é obrigatória';
      isValid = false;
    }

    // Validar cidade
    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
      isValid = false;
    }

    // Validar estado
    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
      isValid = false;
    }

    // Validar CEP
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const prosseguirParaUpsell = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    
    // Simular processamento
    setTimeout(() => {
      // Salvar os dados do cliente no localStorage para uso posterior
      localStorage.setItem('dadosCliente', JSON.stringify(formData));
      
      // Redirecionar para a página de upsell
      router.push('/checkout/upsell');
      
      setCarregando(false);
    }, 1000);
  };

  if (carrinho.itens.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="mb-4">Adicione itens ao seu carrinho para continuar.</p>
          <Link href="/" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo do pedido */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          
          <div className="divide-y divide-gray-200">
            {carrinho.itens.map((item) => (
              <div key={item.livro.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">{item.livro.titulo}</p>
                  <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                </div>
                <p className="font-medium">
                  R$ {(item.livro.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>R$ {carrinho.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Formulário de checkout */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dados de Entrega</h2>
          
          <form onSubmit={prosseguirParaUpsell}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
              </div>
              
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.cep ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                  Rua *
                </label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.rua ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.rua && <p className="text-red-500 text-xs mt-1">{errors.rua}</p>}
              </div>
              
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.cidade ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>}
              </div>
              
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Link 
                href="/carrinho"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar para o Carrinho
              </Link>
              
              <button
                type="submit"
                disabled={carregando}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {carregando ? 'Processando...' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 