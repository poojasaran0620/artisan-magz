import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sparkles, Heart, ShoppingBag, Copy, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '../styles/motion';

export type ToastType = 'success' | 'wishlist' | 'cart' | 'copy' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const getIcon = (type?: ToastType) => {
    switch (type) {
      case 'wishlist':
        return <Heart className="w-3.5 h-3.5 text-roseGold fill-roseGold" />;
      case 'cart':
        return <ShoppingBag className="w-3.5 h-3.5 text-roseGold" />;
      case 'copy':
        return <Copy className="w-3.5 h-3.5 text-sage" />;
      case 'info':
        return <Info className="w-3.5 h-3.5 text-roseGold" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-roseGold" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.92, transition: { duration: 0.2 } }}
              transition={springs.bouncy}
              className="bg-charcoal/95 backdrop-blur-md text-[#FDFCF5] px-4 py-2.5 rounded-full shadow-luxury border border-white/15 flex items-center gap-2.5 text-xs font-medium pointer-events-auto"
            >
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                {getIcon(t.type)}
              </span>
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
    };
  }
  return context;
};
