import React from 'react';
import { cn } from '@/app/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gray-200/80 dark:bg-gray-700/40",
        className
      )}
      {...props}
    />
  );
} 