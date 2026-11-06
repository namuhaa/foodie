import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast, clearToast } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full">
      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center justify-between gap-3 text-slate-800 transition-all duration-300">
        <div className="flex items-center gap-3">
          {icons[toast.type] || icons.success}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
