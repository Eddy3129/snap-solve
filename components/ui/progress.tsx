import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value, className, ...props }) => {
  return (
    <div
      className={cn('relative h-4 bg-darkBg rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-neonPink via-neonPurple to-neonBlue animate-cyber-progress shadow-cyber"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
