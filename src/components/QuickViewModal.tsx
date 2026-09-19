import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, quantity?: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const defaultSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState<string>(defaultSizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl z-10 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-neutral-900 hover:text-white flex items-center justify-center text-neutral-600 transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* IMAGE */}
          <div className="relative h-[280px] md:h-full min-h-[320px] bg-neutral-100">
            {product.isSale && (
              <span className="absolute top-3 left-3 bg-[#111111] text-white text-xs font-semibold px-2.5 py-1 uppercase tracking-wider z-10">
                SALE
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#e8b04b] font-bold uppercase tracking-wider">
                {product.category}
              </span>

              <h3 className="text-xl font-bold text-neutral-900 mt-1 mb-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#e8b04b] tracking-widest text-sm">★★★★★</span>
                <span className="text-xs text-neutral-500">
                  {product.rating}.0 ({product.reviewCount} verified reviews)
                </span>
              </div>

              <div className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span>৳{product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-neutral-400 line-through text-base font-normal">
                    ৳{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* SIZES */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-medium text-neutral-700 mb-2">
                  <span>SELECT SIZE</span>
                  <span className="text-neutral-400">Standard Fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {defaultSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[42px] h-9 px-3 rounded border text-xs font-bold transition-colors ${
                        selectedSize === size
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY PICKER */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  QUANTITY
                </label>
                <div className="flex items-center w-28 border border-neutral-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div>
              <button
                onClick={handleAdd}
                className={`w-full py-3.5 px-4 font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#111111] text-white hover:bg-[#e8b04b] hover:text-[#111111]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO CART!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART • ৳{(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#e8b04b]" />
                  <span>Cash on Delivery available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e8b04b]" />
                  <span>100% Authentic Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
