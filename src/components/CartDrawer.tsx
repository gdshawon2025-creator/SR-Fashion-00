import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemoveItem: (productId: string, size?: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'SR2026' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoMessage('Promo applied! 10% discount added.');
    } else if (code === 'SR50') {
      setDiscountPercent(20);
      setPromoMessage('VIP Promo applied! 20% discount added.');
    } else {
      setPromoMessage('Invalid coupon code. Try SR2026 for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* DRAWER HEADER */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#111111] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e8b04b]" />
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <span className="text-xs bg-[#e8b04b] text-[#111111] font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS */}
          <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 text-xs">
            {neededForFreeShipping > 0 ? (
              <p className="text-neutral-600 mb-1.5">
                Add <span className="font-bold text-neutral-900">৳{neededForFreeShipping.toLocaleString()}</span> more for <span className="text-emerald-600 font-bold">FREE Delivery</span>
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                You've unlocked FREE Delivery across Bangladesh!
              </p>
            )}
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e8b04b] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* CART ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-neutral-500 mb-6 max-w-xs">
                  Looks like you haven't added anything to your cart yet. Explore our latest fashion collections!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {cartItems.map((item) => {
                  const key = `${item.product.id}-${item.selectedSize || 'default'}`;
                  return (
                    <div key={key} className="flex gap-4 pt-3 first:pt-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded bg-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        {item.selectedSize && (
                          <p className="text-xs text-neutral-500 mt-0.5">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-sm font-bold text-neutral-900 mt-1">
                          ৳{item.product.price.toLocaleString()}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-neutral-300 rounded">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1),
                                  item.selectedSize
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedSize
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DRAWER FOOTER / TOTALS */}
          {cartItems.length > 0 && (
            <div className="border-t border-neutral-200 p-5 bg-neutral-50 space-y-4">
              {/* PROMO CODE */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. SR2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-neutral-300 bg-white rounded uppercase outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#111111] text-white text-xs font-bold rounded hover:bg-[#e8b04b] hover:text-[#111111] transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p
                  className={`text-xs ${
                    discountPercent > 0 ? 'text-emerald-600 font-medium' : 'text-neutral-500'
                  }`}
                >
                  {promoMessage}
                </p>
              )}

              {/* TOTALS */}
              <div className="space-y-1.5 text-sm pt-2 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">৳{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>Estimated Delivery</span>
                  <span>{subtotal >= freeShippingThreshold ? 'FREE' : '৳60 inside Dhaka'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span className="text-[#111111]">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
