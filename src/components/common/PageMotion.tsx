import React from 'react';

interface PageMotionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageMotion: React.FC<PageMotionProps> = ({ children, className = '' }) => {
  return (
    <div className={`transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
};
