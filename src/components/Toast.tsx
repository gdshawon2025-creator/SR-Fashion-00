import React from 'react';
import { Check, ShoppingBag, X } from 'lucide-react';

interface ToastProps {
  message: string;
  cartCount: number;
  isOpen: boolean;
  onClose: () => void;
  onViewCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  cartCount,
  isOpen,
  onClose,
  onViewCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#111111] text-white p-4 rounded-lg shadow-2xl border border-neutral-700 flex items-center justify-between gap-3 animate-slide-up">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#e8b04b] text-[#111111] flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{message}</p>
          <p className="text-xs text-[#e8b04b] flex items-center gap-1 font-medium mt-0.5">
            <ShoppingBag className="w-3 h-3" />
            <span>Total in Cart: {cartCount} items</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onViewCart}
          className="px-2.5 py-1.5 bg-[#e8b04b] hover:bg-white text-[#111111] text-xs font-bold rounded transition-colors uppercase"
        >
          View
        </button>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
