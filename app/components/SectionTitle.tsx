import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  withAccent?: boolean;
}

export default function SectionTitle({
  children,
  subtitle,
  align = 'left',
  className = '',
  withAccent = true,
}: SectionTitleProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`mb-8 max-w-4xl ${alignClasses[align]} ${className}`}>
      <h2 className="heading-serif text-2xl md:text-3xl lg:text-4xl text-primary-800 relative">
        {withAccent && (
          <span className="absolute -left-2 md:-left-4 top-0 w-1 h-full bg-accent-400 rounded-full" />
        )}
        {children}
      </h2>
      {subtitle && (
        <p className="mt-3 text-primary-600 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
} 