'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useCarrinho } from '../../context/CarrinhoContext';
import { supabase } from '../../lib/supabase';
import { formatarPreco } from '@/app/utils/formatters';
import Breadcrumb from '@/app/components/common/Breadcrumb';

// Função para gerar número do pedido baseado no timestamp
const gerarNumeroPedido = () => {
  const timestamp = new Date().getTime();
  const numero = `PED${timestamp}`;
  return numero;
};

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { carrinho, valorTotal, limparCarrinho } = useCarrinho();
  const { usuario } = useAuth();
  
  // Estados para armazenar dados da confirmação
  const [dadosCliente, setDadosCliente] = useState<any>(null);
  const [numeroPedido, setNumeroPedido] = useState<string>('');
  const [ordemSalva, setOrdemSalva] = useState<boolean>(false);
  const [salvandoPedido, setSalvandoPedido] = useState<boolean>(false);
  const [erroPedido, setErroPedido] = useState<string | null>(null);
  
  useEffect(() => {
    // Se o carrinho estiver vazio, redireciona para o carrinho
    const carrinhoVazio = Array.isArray(carrinho) 
      ? carrinho.length === 0 
      : carrinho.itens && carrinho.itens.length === 0;
      
    if (carrinhoVazio) {
      router.push('/carrinho');
      return;
    }
    
    // Carrega dados do cliente armazenados no checkout
    const dadosClienteStr = localStorage.getItem('dadosCliente');
    if (!dadosClienteStr) {
      router.push('/checkout');
      return;
    }
    
    try {
      const dados = JSON.parse(dadosClienteStr);
      setDadosCliente(dados);
      
      // Gera um número de pedido único
      const numero = gerarNumeroPedido();
      setNumeroPedido(numero);
      
      // Se o usuário estiver logado, salva o pedido no banco de dados
      if (usuario && usuario.id) {
        salvarPedido(dados, numero);
      }
      
      // Limpa o carrinho após 2 segundos para uma melhor experiência do usuário
      setTimeout(() => {
        limparCarrinho();
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao processar dados do cliente:', err);
      router.push('/checkout');
    }
  }, [usuario, carrinho, router, limparCarrinho]);
  
  // Função para salvar o pedido no banco de dados
  const salvarPedido = async (dados: any, numeroPed: string) => {
    if (salvandoPedido || ordemSalva || !usuario?.id) return;
    
    try {
      setSalvandoPedido(true);
      setErroPedido(null);
      
      console.log('[Confirmação] Salvando pedido no banco de dados');
      
      // Cria o pedido no banco de dados
      const { data: pedido, error: erroPedido } = await supabase
        .from('pedidos')
        .insert({
          usuario_id: usuario.id,
          numero: numeroPed,
          status: 'pendente',
          total: valorTotal,
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          email: dados.email,
          telefone: dados.telefone,
          endereco: `${dados.rua}, ${dados.numero}`,
          complemento: dados.complemento || '',
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
          cep: dados.cep,
          data_pedido: new Date().toISOString()
        })
        .select()
        .single();
        
      if (erroPedido) {
        throw new Error(`Erro ao criar pedido: ${erroPedido.message}`);
      }
      
      console.log('[Confirmação] Pedido criado com sucesso, ID:', pedido.id);
      
      // Adiciona os itens do pedido
      const itensPedido = Array.isArray(carrinho) ? (
        carrinho.map(item => ({
          pedido_id: pedido.id,
          livro_id: item.id,
          quantidade: item.quantidade,
          preco_unitario: item.preco,
          subtotal: item.preco * item.quantidade,
          titulo: item.titulo,
          autor: item.autor
        }))
      ) : carrinho.itens && Array.isArray(carrinho.itens) ? (
        carrinho.itens.map(item => ({
          pedido_id: pedido.id,
          livro_id: item.livro.id,
          quantidade: item.quantidade,
          preco_unitario: item.livro.preco,
          subtotal: item.livro.preco * item.quantidade,
          titulo: item.livro.titulo,
          autor: item.livro.autor
        }))
      ) : [];
      
      const { error: erroItens } = await supabase
        .from('itens_pedido')
        .insert(itensPedido);
        
      if (erroItens) {
        throw new Error(`Erro ao criar itens do pedido: ${erroItens.message}`);
      }
      
      console.log('[Confirmação] Itens do pedido salvos com sucesso');
      setOrdemSalva(true);
      
    } catch (error: any) {
      console.error('[Confirmação] Erro ao salvar pedido:', error.message);
      setErroPedido(error.message);
    } finally {
      setSalvandoPedido(false);
    }
  };
  
  if (!dadosCliente || !numeroPedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">Processando seu pedido...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Carrinho', href: '/carrinho' },
          { label: 'Checkout', href: '/checkout' },
          { label: 'Confirmação', href: '/checkout/confirmacao' },
        ]}
      />
      
      {/* Mensagem de confirmação */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Pedido Confirmado!</h1>
        <p className="text-green-700 text-lg mb-2">
          Seu pedido #{numeroPedido} foi recebido com sucesso.
        </p>
        <p className="text-green-600">
          {usuario ? 
            'Você pode acompanhar o status do seu pedido na seção "Meus Pedidos" da sua conta.' : 
            'Um email de confirmação será enviado com os detalhes do seu pedido.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo do pedido */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Detalhes do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {Array.isArray(carrinho) ? (
                // Se carrinho for um array
                carrinho.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.imagem}
                        alt={item.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.titulo}</h3>
                      <p className="text-gray-500 text-sm">Autor: {item.autor}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-500 text-sm">Qtd: {item.quantidade}</p>
                        <p className="font-medium">{formatarPreco(item.preco * item.quantidade)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : carrinho.itens && Array.isArray(carrinho.itens) ? (
                // Se carrinho for um objeto com propriedade itens
                carrinho.itens.map((item) => (
                  <div key={item.livro.id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.livro.imagemUrl}
                        alt={item.livro.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.livro.titulo}</h3>
                      <p className="text-gray-500 text-sm">Autor: {item.livro.autor}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-500 text-sm">Qtd: {item.quantidade}</p>
                        <p className="font-medium">{formatarPreco(item.livro.preco * item.quantidade)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum item no carrinho</p>
              )}
            </div>
            
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatarPreco(valorTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium">Grátis</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatarPreco(valorTotal)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Informações do cliente */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Informações do Cliente</h2>
            
            <div className="space-y-3">
              <p><span className="font-medium">Nome:</span> {dadosCliente.nome} {dadosCliente.sobrenome}</p>
              <p><span className="font-medium">Email:</span> {dadosCliente.email}</p>
              <p><span className="font-medium">Telefone:</span> {dadosCliente.telefone}</p>
              
              <div className="pt-3 mt-3 border-t border-gray-100">
                <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                <p>{dadosCliente.rua}, {dadosCliente.numero}</p>
                {dadosCliente.complemento && <p>{dadosCliente.complemento}</p>}
                <p>{dadosCliente.bairro}</p>
                <p>{dadosCliente.cidade} - {dadosCliente.estado}</p>
                <p>CEP: {dadosCliente.cep}</p>
              </div>
            </div>
          </div>
          
          {/* Próximos passos */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">E agora?</h2>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Um email de confirmação foi enviado para {dadosCliente.email}</span>
              </li>
              {usuario ? (
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Você pode acompanhar seu pedido na <Link href="/cliente/pedidos" className="underline">área do cliente</Link></span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Crie uma <Link href="/cadastro" className="underline">conta</Link> para acompanhar seus pedidos futuros!</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Nossa equipe está preparando seu pedido para envio</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <Link href="/" className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 