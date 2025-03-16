'use client';

import { Navbar } from '@/app/components/admin/Navbar';
import { Sidebar } from '@/app/components/admin/Sidebar';
import { MobileMenu } from '@/app/components/admin/MobileMenu';
import RouteGuard from '@/app/components/RouteGuard';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'Chart' },
  { href: '/admin/livros', label: 'Livros', icon: 'Book' },
  { href: '/admin/categorias', label: 'Categorias', icon: 'Category' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: 'Order' },
  { href: '/admin/diagnostico', label: 'Diagnóstico', icon: 'Tool' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAuth={false} requireAdmin={true}>
      <div className="flex min-h-screen">
        <Sidebar navItems={navItems} />
        <div className="flex-1 lg:ml-64">
          <MobileMenu navItems={navItems} />
          <main className="p-6 bg-gray-50 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
} 