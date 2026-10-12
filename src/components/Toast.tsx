import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Bookmark, Copy, Share2, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'bookmark' | 'copy' | 'share' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (title: string, description?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, description?: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-[#F5D76E]" />;
      case 'copy':
        return <Copy className="w-4 h-4 text-[#F5D76E]" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-[#F5D76E]" />;
      case 'info':
        return <AlertCircle className="w-4 h-4 text-[#F5D76E]" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#F5D76E]" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-md bg-[#121214] border border-[#D4AF37]/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] text-white animate-in fade-in slide-in-from-bottom-3 duration-300 backdrop-blur-xl"
          >
            <div className="mt-0.5 p-1 rounded bg-[#D4AF37]/10 flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F5D76E]">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs text-zinc-400 mt-0.5 font-normal leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
