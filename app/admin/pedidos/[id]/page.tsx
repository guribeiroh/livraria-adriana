'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order, OrderItem } from '../../../lib/supabase';
import { getOrderById, updateOrder, deleteOrder } from '../../../lib/database';

interface PageProps {
  params: {
    id: string;
  };
}

export default function DetalhesPedidoPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [pedido, setPedido] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    payment_status: '',
    notes: ''
  });

  // Carregar dados do pedido
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const pedidoData = await getOrderById(id);
        
        if (!pedidoData) {
          setError('Pedido não encontrado.');
          return;
        }
        
        setPedido(pedidoData);
        setFormData({
          status: pedidoData.status,
          payment_status: pedidoData.payment_status || 'pending',
          notes: pedidoData.notes || ''
        });
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar detalhes do pedido:', err);
        setError('Falha ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Atualizar pedido
  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      
      const result = await updateOrder(id, {
        ...formData,
        updated_at: new Date().toISOString()
      });
      
      if (result) {
        setPedido(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
        alert('Pedido atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar pedido. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao atualizar pedido:', err);
      alert('Erro ao atualizar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir pedido
  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      try {
        setIsLoading(true);
        
        const success = await deleteOrder(id);
        
        if (success) {
          alert('Pedido excluído com sucesso!');
          router.push('/admin/pedidos');
        } else {
          alert('Não foi possível excluir este pedido. Tente novamente.');
        }
      } catch (err) {
        console.error('Erro ao excluir pedido:', err);
        alert('Erro ao excluir pedido. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Formatações
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(data);
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Traduzir status
  const traduzirStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'processing': 'Em processamento',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado',
      'paid': 'Pago',
      'failed': 'Falhou'
    };
    
    return statusMap[status] || status;
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <p className="font-medium">{error}</p>
        <Link href="/admin/pedidos" className="mt-4 inline-block text-primary-600 hover:text-primary-800">
          ← Voltar para a lista de pedidos
        </Link>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
        <p className="font-medium">Pedido não encontrado.</p>
        <Link href="/admin/pedidos" className="mt-4 inline-block text-primary-600 hover:text-primary-800">
          ← Voltar para a lista de pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/pedidos" className="text-primary-600 hover:text-primary-800">
              ← Voltar para pedidos
            </Link>
            <h2 className="text-2xl font-bold text-primary-800">
              Pedido #{pedido.id.slice(0, 8)}...
            </h2>
            <span className={`px-2 py-1 ml-2 text-xs rounded-full ${getStatusColor(pedido.status)}`}>
              {traduzirStatus(pedido.status)}
            </span>
          </div>
          <p className="text-gray-500">Realizado em {formatarData(pedido.created_at)}</p>
        </div>
        
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Cliente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Cliente</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{pedido.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{pedido.customer_email}</p>
            </div>
            {pedido.customer_phone && (
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{pedido.customer_phone}</p>
              </div>
            )}
            {pedido.shipping_address && (
              <div>
                <p className="text-sm text-gray-500">Endereço de Entrega</p>
                <p className="font-medium whitespace-pre-line">{pedido.shipping_address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Pedido */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Pedido</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status do Pedido</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Em processamento</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status do Pagamento</label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="failed">Falhou</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">ID do Pedido</p>
                <p className="font-medium">{pedido.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status do Pedido</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pedido.status)}`}>
                    {traduzirStatus(pedido.status)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status do Pagamento</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pedido.payment_status || 'pending')}`}>
                    {traduzirStatus(pedido.payment_status || 'pending')}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Método de Pagamento</p>
                <p className="font-medium">{pedido.payment_method || 'Não informado'}</p>
              </div>
              {pedido.notes && (
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p className="font-medium whitespace-pre-line">{pedido.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h3>
        
        {pedido.order_items && pedido.order_items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Unitário
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedido.order_items.map((item: OrderItem) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.book?.image_url && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img className="h-10 w-10 object-cover rounded-md" src={item.book.image_url} alt={item.book.title} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.book ? item.book.title : `Livro #${item.book_id}`}
                          </div>
                          {item.book && (
                            <div className="text-sm text-gray-500">
                              {item.book.author}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatarValor(item.unit_price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatarValor(item.unit_price * item.quantity)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-primary-700">
                      {formatarValor(pedido.total_amount)}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
            Não há itens neste pedido.
          </div>
        )}
      </div>
    </div>
  );
} 