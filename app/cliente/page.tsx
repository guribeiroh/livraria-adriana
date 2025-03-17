'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { Card } from '../components/ui/Card';
import { formatarPreco } from '../utils/formatters';

type DashboardData = {
  totalPedidos: number;
  totalGasto: number;
  pedidosPendentes: number;
  pedidosEntregues: number;
  pedidosRecentes: any[];
};

export default function ClienteDashboardPage() {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    totalPedidos: 0,
    totalGasto: 0,
    pedidosPendentes: 0,
    pedidosEntregues: 0,
    pedidosRecentes: [],
  });

  // Evitar atualizações em componente desmontado
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!usuario?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Buscar pedidos do usuário
        const { data: pedidos, error: pedidosError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('user_id', usuario.id);

        if (pedidosError) throw pedidosError;

        // Calcular estatísticas
        const totalPedidos = pedidos?.length || 0;
        const totalGasto = pedidos?.reduce((total, pedido) => total + (pedido.valor_total || 0), 0) || 0;
        const pedidosPendentes = pedidos?.filter(p => p.status !== 'entregue').length || 0;
        const pedidosEntregues = pedidos?.filter(p => p.status === 'entregue').length || 0;

        // Buscar pedidos recentes
        const { data: recentes, error: recentesError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('user_id', usuario.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentesError) throw recentesError;

        // Atualizar estado apenas se o componente estiver montado
        if (isMounted.current) {
          setData({
            totalPedidos,
            totalGasto,
            pedidosPendentes,
            pedidosEntregues,
            pedidosRecentes: recentes || [],
          });
        }
      } catch (err: any) {
        console.error('Erro ao carregar dados do dashboard:', err);
        if (isMounted.current) {
          setError(err.message || 'Erro ao carregar dados do dashboard');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [usuario?.id]); // Dependência apenas no ID do usuário

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-blue-600">Carregando informações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <h3 className="font-semibold mb-2">Ocorreu um erro</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-gray-500 text-sm font-medium">Total de Pedidos</h3>
            <p className="text-3xl font-bold">{data.totalPedidos}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Gasto</h3>
            <p className="text-3xl font-bold">{formatarPreco(data.totalGasto)}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-gray-500 text-sm font-medium">Pedidos Pendentes</h3>
            <p className="text-3xl font-bold">{data.pedidosPendentes}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-gray-500 text-sm font-medium">Pedidos Entregues</h3>
            <p className="text-3xl font-bold">{data.pedidosEntregues}</p>
          </div>
        </Card>
      </div>

      {/* Pedidos recentes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.pedidosRecentes.length > 0 ? (
                  data.pedidosRecentes.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{pedido.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pedido.status === 'entregue'
                              ? 'bg-green-100 text-green-800'
                              : pedido.status === 'em_processamento'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {pedido.status === 'entregue'
                            ? 'Entregue'
                            : pedido.status === 'em_processamento'
                            ? 'Em Processamento'
                            : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarPreco(pedido.valor_total || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/cliente/pedidos/${pedido.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Você ainda não realizou nenhum pedido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {data.pedidosRecentes.length > 0 && (
        <div className="text-right">
          <Link href="/cliente/pedidos" className="text-blue-600 hover:underline">
            Ver todos os pedidos →
          </Link>
        </div>
      )}
    </div>
  );
} 