import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, ShieldCheck, Truck, Package } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenOrderTrack: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenOrderTrack,
  onSelectCategory,
  settings,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, categoryFilter?: string) => {
    setMobileMenuOpen(false);
    if (categoryFilter) {
      onSelectCategory(categoryFilter);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      {settings.announcementEnabled && settings.announcementText && (
        <div id="top-announcement-bar" className="bg-[#e8b04b] text-[#111111] px-4 py-1.5 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all">
          <span>{settings.announcementText}</span>
        </div>
      )}

      <header id="site-header" className="sticky top-0 z-40 bg-[#111111] text-white px-[7%] py-3 md:py-4 transition-all shadow-md">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <a
            href="#"
            id="logo-brand"
            className="text-2xl md:text-[28px] font-bold tracking-wider hover:opacity-95 transition-opacity"
          >
            {settings.storeName} <span className="text-[#e8b04b]">{settings.logoHighlight}</span>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-[22px]">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[15px] text-white hover:text-[#e8b04b] transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('shop', 'All');
              }}
              className="text-[15px] text-white hover:text-[#e8b04b] transition-colors duration-200"
            >
              Shop
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('categories');
              }}
              className="text-[15px] text-white hover:text-[#e8b04b] transition-colors duration-200"
            >
              Categories
            </a>
            <a
              href="#offers"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('offers');
              }}
              className="text-[15px] text-white hover:text-[#e8b04b] transition-colors duration-200"
            >
              Offers
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
              className="text-[15px] text-white hover:text-[#e8b04b] transition-colors duration-200"
            >
              Contact
            </a>

            {/* ORDER TRACK BUTTON IN NAV */}
            <button
              id="order-track-nav-button"
              type="button"
              onClick={onOpenOrderTrack}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-[#e8b04b] hover:text-[#111111] text-xs font-bold text-neutral-200 rounded-full border border-neutral-700 transition-all cursor-pointer shadow-xs ml-1"
              title="ফোন নম্বর দিয়ে আপনার অর্ডার ট্র্যাক করুন"
            >
              <Truck className="w-3.5 h-3.5 text-[#e8b04b]" />
              <span>অর্ডার ট্র্যাক</span>
            </button>

            {/* ADMIN ACCESS BUTTON IN NAV */}
            <button
              id="admin-nav-button"
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-[#e8b04b] hover:text-[#111111] text-xs font-bold text-neutral-200 rounded-full border border-neutral-700 transition-all cursor-pointer shadow-xs"
              title="ওয়েবসাইট নিয়ন্ত্রণ করতে অ্যাডমিন প্যানেল খুলুন"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#e8b04b]" />
              <span>অ্যাডমিন প্যানেল</span>
            </button>
          </nav>

          {/* ACTION ICONS */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* ORDER TRACK ACTION BUTTON */}
            <button
              id="order-track-icon-button"
              onClick={onOpenOrderTrack}
              aria-label="Track Order"
              className="text-white hover:text-[#e8b04b] transition-colors p-1.5 rounded focus:outline-none flex items-center gap-1 cursor-pointer"
              title="ফোন নম্বর দিয়ে অর্ডার খুঁজুন বা ট্র্যাক করুন"
            >
              <Truck className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-bold text-[#e8b04b]">ট্র্যাক</span>
            </button>

            <button
              id="search-button"
              onClick={onOpenSearch}
              aria-label="Search products"
              className="text-white hover:text-[#e8b04b] transition-colors p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#e8b04b]"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="cart-toggle-button"
              onClick={onOpenCart}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative text-white hover:text-[#e8b04b] transition-colors p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#e8b04b]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  id="cart-counter-badge"
                  className="absolute -top-1 -right-1.5 bg-[#e8b04b] text-[#111] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* MOBILE ADMIN QUICK ICON */}
            <button
              onClick={onOpenAdmin}
              className="md:hidden text-[#e8b04b] p-1.5 rounded hover:bg-neutral-800 transition-colors"
              title="অ্যাডমিন প্যানেল"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden text-white hover:text-[#e8b04b] p-1.5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {mobileMenuOpen && (
          <div id="mobile-menu-dropdown" className="md:hidden pt-4 pb-3 border-t border-white/10 mt-3 space-y-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-base text-white hover:text-[#e8b04b] transition-colors"
            >
              Home
            </a>
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('shop', 'All');
              }}
              className="block py-2 text-base text-white hover:text-[#e8b04b] transition-colors"
            >
              Shop All Products
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('categories');
              }}
              className="block py-2 text-base text-white hover:text-[#e8b04b] transition-colors"
            >
              Categories
            </a>
            <a
              href="#offers"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('offers');
              }}
              className="block py-2 text-base text-white hover:text-[#e8b04b] transition-colors"
            >
              Special Offers (Up to 50% Off)
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
              className="block py-2 text-base text-white hover:text-[#e8b04b] transition-colors"
            >
              Contact & Support
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderTrack();
              }}
              className="w-full text-left py-2.5 text-base text-[#e8b04b] hover:text-white transition-colors flex items-center gap-2 font-bold cursor-pointer"
            >
              <Truck className="w-5 h-5 text-[#e8b04b]" />
              <span>অর্ডার ট্র্যাক করুন (ফোন দিয়ে খুঁজুন)</span>
            </button>

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-[#e8b04b] hover:text-[#111] text-[#e8b04b] font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>অ্যাডমিন প্যানেলে যান (Admin Panel)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
