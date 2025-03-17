'use client';

import { Sidebar } from '../components/cliente/Sidebar';
import { Navbar } from '../components/cliente/Navbar';
import { MobileMenu } from '../components/cliente/MobileMenu';
import RouteGuard from '../components/RouteGuard';

const navItems = [
  { href: '/cliente', label: 'Dashboard', icon: 'Home' },
  { href: '/cliente/pedidos', label: 'Meus Pedidos', icon: 'Package' },
  { href: '/cliente/perfil', label: 'Meu Perfil', icon: 'User' },
];

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="flex min-h-screen">
        <Sidebar navItems={navItems} />
        <div className="flex-1 lg:ml-64">
          <Navbar />
          <MobileMenu navItems={navItems} />
          <main className="p-6 bg-gray-50 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
} 