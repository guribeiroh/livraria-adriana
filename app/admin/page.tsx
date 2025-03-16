'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Componente de Card Estatístico
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  bgColor?: string;
}

const StatCard = ({ title, value, icon, change, bgColor = 'bg-white' }: StatCardProps) => (
  <div className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-2 text-primary-800">{value}</h3>
        {change && (
          <p className={`text-sm mt-2 ${change.positive ? 'text-success-600' : 'text-error-600'} flex items-center`}>
            {change.positive ? (
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {change.value}
          </p>
        )}
      </div>
      <div className="p-3 rounded-full bg-primary-50 text-primary-500">
        {icon}
      </div>
    </div>
  </div>
);

// Componente de Tabela Recente
interface RecentTableProps {
  title: string;
  items: any[];
  columns: {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }[];
  viewAllLink: string;
}

const RecentTable = ({ title, items, columns, viewAllLink }: RecentTableProps) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6 flex items-center justify-between border-b border-gray-200">
      <h3 className="text-lg font-semibold text-primary-800">{title}</h3>
      <Link href={viewAllLink} className="text-sm text-primary-600 hover:text-primary-800 transition-colors">
        Ver todos
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Página Dashboard
export default function AdminDashboardPage() {
  // Dados simulados
  const [stats, setStats] = useState({
    vendas: { total: 0, change: '0%' },
    pedidos: { total: 0, change: '0%' },
    usuarios: { total: 0, change: '0%' },
    livros: { total: 0, change: '0%' }
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // Simular carga de dados
  useEffect(() => {
    // Dados simulados - em um app real, estes dados viriam de uma API
    setStats({
      vendas: { total: 'R$24.532,00', change: '12%' },
      pedidos: { total: 152, change: '8%' },
      usuarios: { total: 320, change: '5%' },
      livros: { total: 84, change: '-2%' }
    });

    // Pedidos recentes simulados
    setRecentOrders([
      { id: '#00123', cliente: 'João Silva', data: '24/06/2023', valor: 'R$125,00', status: 'Entregue' },
      { id: '#00124', cliente: 'Maria Souza', data: '24/06/2023', valor: 'R$210,00', status: 'Em processamento' },
      { id: '#00125', cliente: 'Pedro Santos', data: '23/06/2023', valor: 'R$450,00', status: 'Enviado' },
      { id: '#00126', cliente: 'Ana Oliveira', data: '23/06/2023', valor: 'R$85,00', status: 'Cancelado' },
      { id: '#00127', cliente: 'Carlos Pereira', data: '22/06/2023', valor: 'R$320,00', status: 'Entregue' }
    ]);

    // Produtos mais vendidos simulados
    setTopProducts([
      { id: '1', titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', vendas: 58, valor: 'R$3.480,00' },
      { id: '2', titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', vendas: 45, valor: 'R$2.250,00' },
      { id: '3', titulo: '1984', autor: 'George Orwell', vendas: 36, valor: 'R$1.440,00' },
      { id: '4', titulo: 'Dom Quixote', autor: 'Miguel de Cervantes', vendas: 32, valor: 'R$1.920,00' },
      { id: '5', titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', vendas: 28, valor: 'R$1.400,00' }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-800">Dashboard</h2>
        <div>
          <span className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Vendas" 
          value={stats.vendas.total} 
          change={{ value: stats.vendas.change, positive: true }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Pedidos" 
          value={stats.pedidos.total} 
          change={{ value: stats.pedidos.change, positive: true }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <StatCard 
          title="Usuários" 
          value={stats.usuarios.total} 
          change={{ value: stats.usuarios.change, positive: true }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Livros" 
          value={stats.livros.total} 
          change={{ value: stats.livros.change, positive: false }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      </div>

      {/* Seção de dados recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Pedidos recentes */}
        <RecentTable
          title="Pedidos Recentes"
          items={recentOrders}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'cliente', label: 'Cliente' },
            { key: 'data', label: 'Data' },
            { key: 'valor', label: 'Valor' },
            { 
              key: 'status', 
              label: 'Status',
              render: (item) => {
                const statusColors: Record<string, string> = {
                  'Entregue': 'bg-success-100 text-success-800',
                  'Em processamento': 'bg-blue-100 text-blue-800',
                  'Enviado': 'bg-primary-100 text-primary-800',
                  'Cancelado': 'bg-error-100 text-error-800'
                };
                return (
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[item.status] || 'bg-gray-100 text-gray-800'}`}>
                    {item.status}
                  </span>
                );
              }
            }
          ]}
          viewAllLink="/admin/pedidos"
        />

        {/* Produtos mais vendidos */}
        <RecentTable
          title="Livros Mais Vendidos"
          items={topProducts}
          columns={[
            { key: 'titulo', label: 'Título' },
            { key: 'autor', label: 'Autor' },
            { key: 'vendas', label: 'Vendas' },
            { key: 'valor', label: 'Valor Total' }
          ]}
          viewAllLink="/admin/livros"
        />
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link href="/admin/livros/novo" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Novo Livro
            </Link>
            <Link href="/admin/categorias/nova" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Criar Nova Categoria
            </Link>
            <Link href="/admin/usuarios/novo" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Novo Usuário
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <span className="inline-block h-2 w-2 rounded-full bg-error-500"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Estoque baixo de <span className="font-medium">5 livros</span>.</p>
                <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <span className="inline-block h-2 w-2 rounded-full bg-primary-500"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700"><span className="font-medium">10 novos pedidos</span> precisam ser processados.</p>
                <p className="text-xs text-gray-500 mt-1">Hoje</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <span className="inline-block h-2 w-2 rounded-full bg-success-500"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Meta de vendas do mês <span className="font-medium">alcançada</span>!</p>
                <p className="text-xs text-gray-500 mt-1">Ontem</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Metas Mensais</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Vendas</span>
                <span className="text-primary-600 font-medium">82%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Novos Usuários</span>
                <span className="text-primary-600 font-medium">65%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pedidos</span>
                <span className="text-primary-600 font-medium">90%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 