import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product, CategoryItem } from '../types';
import { Filter, Sparkles, PackagePlus } from 'lucide-react';

interface ProductsSectionProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  categories?: CategoryItem[];
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
  searchQuery,
  onClearSearch,
  categories,
}) => {
  // Dynamic category tabs based on categories or fallback
  const categoryTabs = useMemo(() => {
    const list = ['All'];
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        if (c.title && !list.includes(c.title)) list.push(c.title);
      });
    }
    // Also include categories from products if any exist
    products.forEach((p) => {
      if (p.category && !list.some((item) => item.toLowerCase() === p.category.toLowerCase())) {
        list.push(p.category);
      }
    });
    if (list.length === 1) {
      list.push("Men's Fashion", "Women's Fashion", 'T-Shirts', 'Pants');
    }
    if (!list.includes('Sale Deals')) list.push('Sale Deals');
    return list;
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      let matchesCategory = true;
      if (activeCategory === 'Sale Deals') {
        matchesCategory = Boolean(item.isSale);
      } else if (activeCategory !== 'All') {
        matchesCategory =
          item.category.trim().toLowerCase() === activeCategory.trim().toLowerCase();
      }

      // Search match
      let matchesSearch = true;
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch =
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
      }

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section id="shop" className="px-[7%] py-16 md:py-[70px] bg-[#f8f8f8]">
      {/* SECTION HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-[35px] font-bold text-neutral-900 mb-2.5">
          Featured Products
        </h2>
        <p className="text-[#777777] text-base">Our most popular products</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab;
          return (
            <button
              key={tab}
              onClick={() => onSelectCategory(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-[#e8b04b] shadow-sm ring-2 ring-[#e8b04b]'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200'
              }`}
            >
              {tab === 'Sale Deals' && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#e8b04b]" />}
              {tab}
            </button>
          );
        })}
      </div>

      {/* ACTIVE SEARCH NOTICE */}
      {searchQuery && (
        <div className="mb-6 bg-white p-3.5 rounded-lg border border-neutral-200 flex items-center justify-between max-w-xl mx-auto shadow-xs">
          <p className="text-sm text-neutral-700">
            Showing results for <span className="font-semibold text-neutral-900">"{searchQuery}"</span> ({filteredProducts.length} items)
          </p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 md:p-14 text-center max-w-lg mx-auto shadow-xs border border-neutral-200">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <PackagePlus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">কোনো প্রোডাক্ট পাওয়া যায়নি</h3>
          <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
            স্টোরে বর্তমানে কোনো প্রোডাক্ট যুক্ত নেই। আপনি অ্যাডমিন প্যানেল থেকে আপনার নিজস্ব পণ্য, দাম ও ছবি সহ নতুন প্রোডাক্ট যোগ করতে পারেন।
          </p>
          <a
            href="#admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            অ্যাডমিন প্যানেল থেকে প্রোডাক্ট যোগ করুন
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 text-center max-w-md mx-auto shadow-xs">
          <Filter className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-900 mb-1">No products found</h3>
          <p className="text-neutral-500 text-sm mb-4">
            Try adjusting your search or category filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              if (onClearSearch) onClearSearch();
            }}
            className="px-5 py-2.5 bg-[#111111] text-white hover:bg-[#e8b04b] hover:text-[#111] text-sm font-bold rounded transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
