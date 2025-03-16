'use client';

import { Navbar } from '@/app/components/admin/Navbar';
import { Sidebar } from '@/app/components/admin/Sidebar';
import RouteGuard from '@/app/components/RouteGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAdmin={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
} 