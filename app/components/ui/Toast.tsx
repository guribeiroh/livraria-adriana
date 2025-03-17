'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  isVisible: boolean;
  duration?: number;
  onClose: () => void;
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />
};

const toastColors = {
  success: {
    background: 'bg-emerald-50',
    border: 'border-emerald-400',
    icon: 'text-emerald-500',
    title: 'text-emerald-800',
    message: 'text-emerald-600',
    progress: 'bg-emerald-500'
  },
  error: {
    background: 'bg-rose-50',
    border: 'border-rose-400',
    icon: 'text-rose-500',
    title: 'text-rose-800',
    message: 'text-rose-600',
    progress: 'bg-rose-500'
  },
  warning: {
    background: 'bg-amber-50',
    border: 'border-amber-400',
    icon: 'text-amber-500',
    title: 'text-amber-800',
    message: 'text-amber-600',
    progress: 'bg-amber-500'
  },
  info: {
    background: 'bg-primary-50',
    border: 'border-primary-400',
    icon: 'text-primary-500',
    title: 'text-primary-800',
    message: 'text-primary-600',
    progress: 'bg-primary-500'
  }
};

export default function Toast({
  type = 'success',
  title,
  message,
  isVisible,
  duration = 5000,
  onClose
}: ToastProps) {
  const colors = toastColors[type];

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-6 right-6 z-50 max-w-sm w-full ${colors.background} border ${colors.border} rounded-lg shadow-lg overflow-hidden`}
        >
          <div className="relative p-4">
            {/* Barra de progresso */}
            <div className="absolute bottom-0 left-0 h-1 w-full">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`h-full ${colors.progress}`}
              />
            </div>

            <div className="flex items-start">
              {/* Ícone */}
              <div className={`mr-3 flex-shrink-0 ${colors.icon}`}>
                {toastIcons[type]}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pt-0.5">
                <h3 className={`text-sm font-medium ${colors.title}`}>{title}</h3>
                {message && <p className={`mt-1 text-sm ${colors.message}`}>{message}</p>}
              </div>

              {/* Botão de fechar */}
              <button
                type="button"
                onClick={onClose}
                className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 