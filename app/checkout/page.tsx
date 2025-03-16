'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCarrinho } from '../context/CarrinhoContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { carrinho, limparCarrinho } = useCarrinho();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: ''
  });
  
  const [etapa, setEtapa] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarEtapa1 = () => {
    const { nome, email, telefone, endereco, cidade, estado, cep } = formData;
    return nome && email && telefone && endereco && cidade && estado && cep;
  };

  const validarEtapa2 = () => {
    const { numeroCartao, nomeCartao, validade, cvv } = formData;
    return numeroCartao && nomeCartao && validade && cvv;
  };

  const avancarEtapa = () => {
    if (etapa === 1 && validarEtapa1()) {
      setEtapa(2);
    }
  };

  const voltarEtapa = () => {
    if (etapa === 2) {
      setEtapa(1);
    }
  };

  const finalizarCompra = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarEtapa2()) return;
    
    setCarregando(true);
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setCarregando(false);
      // Salvar informação de pedido confirmado
      localStorage.setItem('pedido_confirmado', 'true');
      // Limpar carrinho após a compra
      limparCarrinho();
      // Redirecionar para página de confirmação
      router.push('/checkout/confirmacao');
    }, 2000);
  };

  if (carrinho.itens.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-500 mb-6">Seu carrinho está vazio</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Formulário de checkout */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex mb-8">
              <div className={`flex-1 border-b-2 pb-3 ${etapa === 1 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${etapa === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>1</span>
                Informações Pessoais
              </div>
              <div className={`flex-1 border-b-2 pb-3 ${etapa === 2 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${etapa === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>2</span>
                Pagamento
              </div>
            </div>
            
            <form onSubmit={finalizarCompra}>
              {etapa === 1 && (
                <div className="etapa-1">
                  <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 mt-6">Endereço de Entrega</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <input
                        type="text"
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <input
                        type="text"
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={avancarEtapa}
                      disabled={!validarEtapa1()}
                      className={`px-6 py-2 rounded-md text-white ${validarEtapa1() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
              
              {etapa === 2 && (
                <div className="etapa-2">
                  <h2 className="text-xl font-semibold mb-4">Informações de Pagamento</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="numeroCartao" className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      id="numeroCartao"
                      name="numeroCartao"
                      value={formData.numeroCartao}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="nomeCartao" className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      id="nomeCartao"
                      name="nomeCartao"
                      value={formData.nomeCartao}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="validade" className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                      <input
                        type="text"
                        id="validade"
                        name="validade"
                        value={formData.validade}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={voltarEtapa}
                      className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={!validarEtapa2() || carregando}
                      className={`px-6 py-2 rounded-md text-white ${validarEtapa2() && !carregando ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      {carregando ? 'Processando...' : 'Finalizar Compra'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Resumo do pedido */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            
            <ul className="divide-y divide-gray-200 mb-4">
              {carrinho.itens.map((item) => (
                <li key={item.livro.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{item.livro.titulo}</p>
                    <p className="text-sm text-gray-500">Qtd: {item.quantidade}</p>
                  </div>
                  <span>R${(item.livro.preco * item.quantidade).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R${carrinho.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
            </div>
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>R${carrinho.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 