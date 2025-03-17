'use client';

import { ReactNode } from 'react';
import ClienteNavbar from '../components/ClienteNavbar';
import RouteGuard from '../components/RouteGuard';

interface ClienteLayoutProps {
  children: ReactNode;
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
  return (
    <RouteGuard>
      <div className="min-h-screen flex flex-col">
        <ClienteNavbar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
} 