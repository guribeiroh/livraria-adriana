'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';

interface PageProps {
  params: {
    id: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  book_id: string;
  title: string;
  price: number;
  quantity: number;
  cover_image?: string;
}

export default function DetalhePedidoPage({ params }: PageProps) {
  const router = useRouter();
  const { usuario } = useAuth();
  const [pedido, setPedido] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidoDetalhes = async () => {
      if (!usuario) return;

      try {
        setLoading(true);
        
        // Buscar o pedido específico
        const { data: pedidoData, error: pedidoError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.id)
          .eq('customer_email', usuario.email)
          .single();

        if (pedidoError) {
          if (pedidoError.code === 'PGRST116') {
            throw new Error('Pedido não encontrado ou você não tem acesso a este pedido.');
          }
          throw pedidoError;
        }

        // Buscar os itens do pedido
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', params.id);

        if (itemsError) throw itemsError;

        // Criar o objeto completo do pedido
        const pedidoCompleto: Order = {
          ...pedidoData,
          items: itemsData || [],
        };

        setPedido(pedidoCompleto);
      } catch (error: any) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalhes();
  }, [params.id, usuario]);

  // Funções auxiliares
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const traduzirStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'processing': 'Em processamento',
      'shipping': 'Em transporte',
      'completed': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/cliente/pedidos')}
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Voltar para Meus Pedidos
        </button>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Pedido não encontrado</h2>
        <p className="text-gray-600 mb-6">O pedido que você está procurando não foi encontrado.</p>
        <Link 
          href="/cliente/pedidos" 
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Voltar para Meus Pedidos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            href="/cliente/pedidos" 
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para pedidos
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Pedido #{pedido.id.slice(0, 8)}...
          </h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
          {traduzirStatus(pedido.status)}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Resumo do Pedido</h2>
          <p className="text-sm text-gray-600">
            Data: {formatarData(pedido.created_at)}
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {pedido.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center">
              <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded overflow-hidden relative">
                {item.cover_image ? (
                  <Image
                    src={item.cover_image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-500">Quantidade: {item.quantity}</p>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {formatarValor(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>{formatarValor(pedido.total_amount)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Frete</span>
            <span>Grátis</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-800 mt-2 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatarValor(pedido.total_amount)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações de Entrega</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Nome</h3>
            <p className="text-gray-800">{pedido.customer_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <p className="text-gray-800">{pedido.customer_email}</p>
          </div>
          {pedido.customer_phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone</h3>
              <p className="text-gray-800">{pedido.customer_phone}</p>
            </div>
          )}
          {pedido.shipping_address && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Endereço de Entrega</h3>
              <p className="text-gray-800 whitespace-pre-line">{pedido.shipping_address}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status do Pedido</h2>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-gray-200"></div>
          </div>
          <div className="relative flex justify-between">
            <div className="text-center">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                ['pending', 'processing', 'shipping', 'completed'].includes(pedido.status) 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs mt-2">Confirmado</div>
            </div>
            <div className="text-center">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                ['processing', 'shipping', 'completed'].includes(pedido.status) 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs mt-2">Em processamento</div>
            </div>
            <div className="text-center">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                ['shipping', 'completed'].includes(pedido.status) 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs mt-2">Em transporte</div>
            </div>
            <div className="text-center">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                pedido.status === 'completed' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs mt-2">Entregue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 