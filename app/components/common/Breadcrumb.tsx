'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const pathname = usePathname();
  
  return (
    <nav className="flex mb-4 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <span className="mx-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          
          {index === items.length - 1 ? (
            <span className="text-gray-600 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-blue-600 hover:text-blue-800 hover:underline">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 