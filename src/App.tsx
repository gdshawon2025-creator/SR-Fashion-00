import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductsSection } from './components/ProductsSection';
import { OfferSection } from './components/OfferSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { OrderTrackModal } from './components/OrderTrackModal';
import { Toast } from './components/Toast';
import { AdminPanel } from './components/admin/AdminPanel';
import { 
  PRODUCTS as INITIAL_PRODUCTS, 
  CATEGORIES as INITIAL_CATEGORIES,
  DEFAULT_SETTINGS,
  DEFAULT_COUPONS,
  DEFAULT_ORDERS,
  DEFAULT_HERO_BANNERS,
} from './data/products';
import { Product, CartItem, Order, CategoryItem, SiteSettings, Coupon, OrderStatus, HeroBanner, PaymentStatus } from './types';
import { ShieldCheck, ArrowLeft, Truck } from 'lucide-react';

export default function App() {
  // 1. PRODUCTS STATE (with persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. ORDERS STATE (with persistence)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // 3. CATEGORIES STATE (with persistence)
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 4. SITE SETTINGS (with persistence)
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('srfashion_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.contactPhone === '+880 1712-345678' || !parsed.contactPhone) {
          parsed.contactPhone = '01352113432';
        }
        if (parsed.contactEmail === 'info@srfashion.com' || !parsed.contactEmail) {
          parsed.contactEmail = 'gdyounus2025@gmail.com';
        }
        if (parsed.contactAddress === 'House 42, Road 11, Banani, Dhaka, Bangladesh' || !parsed.contactAddress) {
          parsed.contactAddress = 'Keshobpur, Jessore, Bangladesh';
        }
        if (!parsed.bkashNumber || parsed.bkashNumber === '01352113432') {
          parsed.bkashNumber = '01804459691';
        }
        if (!parsed.nagadNumber || parsed.nagadNumber === '01352113432') {
          parsed.nagadNumber = '01804459691';
        }
        if (!parsed.whatsappNumber) {
          parsed.whatsappNumber = '01352113432';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 5. COUPONS (with persistence)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_coupons');
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  // 6. HERO BANNERS (with persistence)
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_hero_banners');
      return saved ? JSON.parse(saved) : DEFAULT_HERO_BANNERS;
    } catch {
      return DEFAULT_HERO_BANNERS;
    }
  });

  // 7. ADMIN PIN & AUTH
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('srfashion_admin_pin') || 'admin123';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin';
  });

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('srfashion_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('srfashion_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('srfashion_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('srfashion_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('srfashion_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('srfashion_hero_banners', JSON.stringify(heroBanners));
    } catch (e) {
      console.error(e);
    }
  }, [heroBanners]);

  useEffect(() => {
    try {
      localStorage.setItem('srfashion_admin_pin', adminPin);
    } catch (e) {
      console.error(e);
    }
  }, [adminPin]);

  // Handle hash changes for admin routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('srfashion_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Category and search filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [orderTrackModalOpen, setOrderTrackModalOpen] = useState(false);
  const [trackInitialPhone, setTrackInitialPhone] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenOrderTrack = (phone?: string) => {
    if (phone) {
      setTrackInitialPhone(phone);
    }
    setOrderTrackModalOpen(true);
  };

  // Toast notifications
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: '',
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('srfashion_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('srfashion_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Total quantity calculation for header badge and alerts
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add to cart handler
  const handleAddToCart = (product: Product, size?: string, quantity: number = 1) => {
    const selectedSize = size || (product.sizes ? product.sizes[0] : 'Standard');

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedSize }];
      }
    });

    setToast({
      show: true,
      message: `${product.name} added to cart!`,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Quantity updates
  const handleUpdateQuantity = (productId: string, quantity: number, size?: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Remove item
  const handleRemoveItem = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      )
    );
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Scroll helper
  const scrollToSection = (id: string, categoryFilter?: string) => {
    if (categoryFilter) {
      setActiveCategory(categoryFilter);
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ================= ADMIN HANDLERS =================
  // Products
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Orders
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleUpdatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Categories
  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // Settings
  const handleUpdateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Coupons
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  // Hero Banners
  const handleAddBanner = (newBanner: HeroBanner) => {
    setHeroBanners((prev) => [...prev, newBanner]);
  };

  const handleUpdateBanner = (updated: HeroBanner) => {
    setHeroBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleDeleteBanner = (bannerId: string) => {
    setHeroBanners((prev) => prev.filter((b) => b.id !== bannerId));
  };

  // Restore all data
  const handleRestoreAllData = (data: {
    products: Product[];
    orders: Order[];
    categories: CategoryItem[];
    settings: SiteSettings;
    coupons: Coupon[];
    banners?: HeroBanner[];
  }) => {
    setProducts(data.products);
    setOrders(data.orders);
    setCategories(data.categories);
    setSettings(data.settings);
    setCoupons(data.coupons);
    if (data.banners) {
      setHeroBanners(data.banners);
    }
  };

  // Reset to factory defaults
  const handleResetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(DEFAULT_ORDERS);
    setCategories(INITIAL_CATEGORIES);
    setSettings(DEFAULT_SETTINGS);
    setCoupons(DEFAULT_COUPONS);
    setHeroBanners(DEFAULT_HERO_BANNERS);
    setAdminPin('admin123');
    alert('সকল ডেটা সফলভাবে ডিফল্ট অবস্থায় রিসেট করা হয়েছে!');
  };

  // IF ADMIN PANEL IS OPEN:
  if (isAdminOpen) {
    return (
      <AdminPanel
        products={products}
        orders={orders}
        categories={categories}
        settings={settings}
        coupons={coupons}
        banners={heroBanners}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onDeleteOrder={handleDeleteOrder}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddBanner={handleAddBanner}
        onUpdateBanner={handleUpdateBanner}
        onDeleteBanner={handleDeleteBanner}
        onUpdateSettings={handleUpdateSettings}
        onAddCoupon={handleAddCoupon}
        onToggleCoupon={handleToggleCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        onRestoreAllData={handleRestoreAllData}
        onResetToDefaults={handleResetToDefaults}
        onCloseAdmin={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        adminPin={adminPin}
        onUpdateAdminPin={setAdminPin}
        isAuthenticated={isAdminAuthenticated}
        onSetAuthenticated={setIsAdminAuthenticated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#222222] font-sans antialiased selection:bg-[#e8b04b] selection:text-[#111111]">
      {/* HEADER */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenOrderTrack={() => handleOpenOrderTrack()}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToSection('shop');
        }}
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* HERO SECTION */}
      <Hero
        settings={settings}
        banners={heroBanners}
        onAddBanner={handleAddBanner}
        onUpdateBanner={handleUpdateBanner}
        onDeleteBanner={handleDeleteBanner}
        categories={categories}
        onShopClick={(cat) => {
          setActiveCategory(cat || 'All');
          setSearchQuery('');
          scrollToSection('shop');
        }}
      />

      {/* CATEGORIES SECTION */}
      <Categories
        categories={categories}
        selectedCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
      />

      {/* PRODUCTS SECTION */}
      <ProductsSection
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* OFFER BANNER SECTION */}
      <OfferSection
        settings={settings}
        onShopSale={() => {
          setActiveCategory('Sale Deals');
          scrollToSection('shop');
        }}
      />

      {/* NEWSLETTER SECTION */}
      <Newsletter
        onSubscribed={(email) => {
          setToast({
            show: true,
            message: `Subscribed! 10% coupon sent to ${email}`,
          });
        }}
      />

      {/* FOOTER */}
      <Footer 
        onNavClick={scrollToSection} 
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrderTrack={() => handleOpenOrderTrack()}
      />

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white px-3.5 py-2 rounded-full shadow-lg border border-neutral-700 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer group"
          title="এডমিন প্যানেল খুলুন (Control Panel)"
        >
          <ShieldCheck className="w-4 h-4 text-[#e8b04b] group-hover:text-[#111111]" />
          <span>এডমিন প্যানেল</span>
        </button>

        <button
          onClick={() => handleOpenOrderTrack()}
          className="bg-[#e8b04b] hover:bg-[#111111] hover:text-[#e8b04b] text-[#111111] px-3.5 py-2 rounded-full shadow-lg border border-amber-400 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer group hover:scale-105"
          title="ফোন নম্বর দিয়ে আপনার অর্ডার ট্র্যাক করুন বা খুঁজুন"
        >
          <Truck className="w-4 h-4 text-[#111111] group-hover:text-[#e8b04b]" />
          <span>অর্ডার ট্র্যাক</span>
        </button>
      </div>

      {/* SLIDE-OVER CART DRAWER */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setCheckoutModalOpen(true)}
      />

      {/* QUICK VIEW PRODUCT MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cartItems={cart}
        coupons={coupons}
        settings={settings}
        onOrderCreated={handleOrderCreated}
        onOrderCompleted={() => {
          setCart([]);
          localStorage.removeItem('srfashion_cart');
        }}
      />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        onFilterCategory={(cat) => {
          setActiveCategory(cat);
          scrollToSection('shop');
        }}
        onOpenOrderTrack={(phone) => handleOpenOrderTrack(phone)}
      />

      {/* ORDER TRACK MODAL */}
      <OrderTrackModal
        isOpen={orderTrackModalOpen}
        onClose={() => setOrderTrackModalOpen(false)}
        orders={orders}
        settings={settings}
        initialPhone={trackInitialPhone}
      />

      {/* TOAST ALERT */}
      <Toast
        isOpen={toast.show}
        message={toast.message}
        cartCount={totalCartCount}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        onViewCart={() => {
          setToast((prev) => ({ ...prev, show: false }));
          setCartDrawerOpen(true);
        }}
      />
    </div>
  );
}
