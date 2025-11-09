// components/Alert.tsx
import React, { useEffect } from 'react';

type AlertType = 'success' | 'error';

interface AlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
}

const alertStyles = {
  success: {
    bg: 'bg-green-500',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-500',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Fecha o alerta após 5 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  const style = alertStyles[type];

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${style.bg}`}>
        <div className="mr-3">{style.icon}</div>
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
