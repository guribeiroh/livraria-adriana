'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '../../lib/supabase';
import { getOrders, deleteOrder, updateOrder } from '../../lib/database';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar pedidos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const pedidosData = await getOrders();
        setPedidos(pedidosData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        setError('Falha ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchesSearch = 
      pedido.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filtroStatus ? pedido.status === filtroStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Atualizar status do pedido
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setIsLoading(true);
      
      const result = await updateOrder(id, { 
        status: newStatus,
        updated_at: new Date().toISOString()
      });
      
      if (result) {
        // Atualizar pedido na lista local
        setPedidos(prev => prev.map(pedido => 
          pedido.id === id ? { ...pedido, status: newStatus as any } : pedido
        ));
        alert('Status do pedido atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar status do pedido. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
      alert('Erro ao atualizar status do pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir pedido
  const handleDeletePedido = async (id: string) => {
    if (confirm(`Tem certeza que deseja excluir o pedido ${id}?`)) {
      try {
        setIsLoading(true);
        
        const success = await deleteOrder(id);
        
        if (success) {
          // Remover pedido da lista local
          setPedidos(prev => prev.filter(pedido => pedido.id !== id));
          alert('Pedido excluído com sucesso!');
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

  // Formatar data
  const formatarData = (dataString?: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  // Formatar valor
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Traduzir status
  const traduzirStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Em processamento';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary-800">Gerenciar Pedidos</h2>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pesquisa */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Buscar por nome, email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtro por Status */}
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Em processamento</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estado de carregamento */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de pedidos */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {pedidosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || filtroStatus 
                ? 'Nenhum pedido encontrado com os filtros aplicados.' 
                : 'Não há pedidos registrados.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {pedido.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{pedido.customer_name}</div>
                        <div className="text-sm text-gray-500">{pedido.customer_email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatarData(pedido.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatarValor(pedido.total_amount)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pedido.status)}`}>
                          {traduzirStatus(pedido.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link 
                          href={`/admin/pedidos/${pedido.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleDeletePedido(pedido.id)}
                          className="text-error-600 hover:text-error-900"
                          disabled={isLoading}
                        >
                          Excluir
                        </button>
                        
                        {/* Dropdown para mudar status */}
                        <select 
                          className="ml-2 text-sm border border-gray-300 rounded p-1"
                          value={pedido.status}
                          onChange={(e) => handleUpdateStatus(pedido.id, e.target.value)}
                          disabled={isLoading}
                        >
                          <option value="pending">Pendente</option>
                          <option value="processing">Em processamento</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 