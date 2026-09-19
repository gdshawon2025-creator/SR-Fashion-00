import React, { useState } from 'react';
import { Search, X, ArrowRight, Truck } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterCategory: (category: string) => void;
  onOpenOrderTrack?: (phone?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onFilterCategory,
  onOpenOrderTrack,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const isNumericSearch = /^[0-9+ ]{3,}$/.test(query.trim());

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const suggestedTags = ['Cotton T-Shirt', 'Denim Jeans', 'Casual Dress', 'Jacket', 'Sale'];

  const handleSuggestedClick = (tag: string) => {
    if (tag === 'Sale') {
      onFilterCategory('Sale Deals');
      onClose();
      const shop = document.getElementById('shop');
      if (shop) shop.scrollIntoView({ behavior: 'smooth' });
    } else {
      setQuery(tag);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-xl max-w-xl w-full shadow-2xl overflow-hidden z-10 animate-scale-in">
        {/* SEARCH INPUT BAR */}
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, t-shirts, jeans, jackets..."
            className="flex-1 text-base outline-none text-neutral-900 placeholder:text-neutral-400 bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold uppercase text-neutral-500 hover:text-neutral-900 px-2 py-1"
          >
            ESC
          </button>
        </div>

        {/* SUGGESTED CHIPS */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-neutral-500 font-medium whitespace-nowrap">Popular:</span>
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSuggestedClick(tag)}
              className="px-2.5 py-1 bg-white border border-neutral-200 rounded-full text-neutral-700 hover:border-[#111111] hover:text-[#111111] transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* PHONE NUMBER ORDER TRACK BANNER */}
        {onOpenOrderTrack && (
          <div className="p-3 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-950 min-w-0">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">
                {isNumericSearch
                  ? `নম্বর "${query}" দিয়ে কোনো অর্ডার ট্র্যাক করতে চান?`
                  : 'ফোন নম্বর দিয়ে আপনার পূর্ববর্তী যেকোনো অর্ডার খুঁজুন:'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrderTrack(isNumericSearch ? query.trim() : undefined);
              }}
              className="px-3 py-1.5 bg-[#111111] hover:bg-[#e8b04b] text-white hover:text-[#111111] rounded-lg font-bold shrink-0 transition-all cursor-pointer text-[11px] shadow-xs"
            >
              অর্ডার খুঁজুন →
            </button>
          </div>
        )}

        {/* RESULTS */}
        <div className="max-h-[350px] overflow-y-auto p-2 divide-y divide-neutral-100">
          {query.trim() && filtered.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              No products found matching "{query}"
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="p-3 flex items-center gap-3 hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover bg-neutral-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-900 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-900">৳{item.price.toLocaleString()}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
              </div>
            ))
          ) : (
            <div className="p-4 text-xs text-neutral-400 text-center">
              Type keywords above to search products across SR Fashion
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
