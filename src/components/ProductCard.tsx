import React, { useState } from 'react';
import { Eye, Heart, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [addedRecently, setAddedRecently] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1600);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-[6px] overflow-hidden shadow-[0_3px_15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
    >
      {/* PRODUCT IMAGE & BADGES */}
      <div className="relative h-[290px] sm:h-[300px] overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => onQuickView(product)}>
        {product.isSale && (
          <span className="absolute top-3 left-3 z-10 bg-[#111111] text-white text-xs font-semibold px-2.5 py-1 tracking-wider uppercase">
            SALE
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* HOVER QUICK ACTION OVERLAY */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-neutral-700 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            title="Quick View Details"
            className="w-9 h-9 rounded-full bg-white text-neutral-700 hover:text-[#111] hover:bg-[#e8b04b] shadow-md flex items-center justify-center transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-[18px] flex flex-col flex-1 justify-between">
        <div>
          <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">
            {product.category}
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-semibold text-neutral-900 mb-2 cursor-pointer hover:text-[#e8b04b] transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-[#e8b04b] mb-2.5 select-none" aria-label="5 out of 5 stars">
            <span className="text-sm font-semibold tracking-widest">★★★★★</span>
            <span className="text-xs text-neutral-400">({product.reviewCount})</span>
          </div>

          <div className="text-[18px] font-bold text-neutral-900 mb-[15px] flex items-center">
            <span>৳{product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-[#999999] line-through text-sm ml-2 font-normal">
                ৳{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAdd}
          className={`w-full py-3 px-4 font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            addedRecently
              ? 'bg-[#e8b04b] text-[#111111]'
              : 'bg-[#111111] text-white hover:bg-[#e8b04b] hover:text-[#111111]'
          }`}
        >
          {addedRecently ? (
            <>
              <Check className="w-4 h-4" />
              <span>ADDED TO CART</span>
            </>
          ) : (
            <span>ADD TO CART</span>
          )}
        </button>
      </div>
    </div>
  );
};
