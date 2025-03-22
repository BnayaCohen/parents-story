
import React from 'react';
import { cn } from '@/lib/utils';

interface StoryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const StoryButton: React.FC<StoryButtonProps> = ({ 
  children, 
  onClick, 
  active = false,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-5 py-3 rounded-full font-bold text-sm transition-all duration-300",
        "shadow-md hover:shadow-lg transform hover:-translate-y-1",
        disabled && "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-md",
        active 
          ? "bg-green-100 dark:bg-green-800/40 border-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300" 
          : "bg-green-50 dark:bg-green-900/40 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/60"
      )}
    >
      {children}
    </button>
  );
};

export default StoryButton;
