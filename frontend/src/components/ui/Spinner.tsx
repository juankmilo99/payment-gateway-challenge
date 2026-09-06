import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  subMessage?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', message, subMessage }) => {
  const sizeClass = size === 'lg' ? 'spinner-lg' : size === 'sm' ? 'w-4 h-4 border-2' : 'spinner';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`spinner ${sizeClass}`}></div>
      {message && (
        <p className="mt-4 text-sm font-medium text-white text-center">{message}</p>
      )}
      {subMessage && (
        <p className="mt-2 text-xs text-slate-400 text-center max-w-[250px]">{subMessage}</p>
      )}
    </div>
  );
};
