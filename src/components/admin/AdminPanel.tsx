import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Layers, 
  Sparkles, 
  Tag, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Store,
  ShieldCheck,
  ChevronRight,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { Product, Order, CategoryItem, SiteSettings, Coupon, OrderStatus, HeroBanner, PaymentStatus } from '../../types';
import { DashboardTab } from './DashboardTab';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { CategoriesTab } from './CategoriesTab';
import { BannersTab } from './BannersTab';
import { CouponsTab } from './CouponsTab';
import { SettingsTab } from './SettingsTab';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  categories: CategoryItem[];
  settings: SiteSettings;
  coupons: Coupon[];
  banners: HeroBanner[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: PaymentStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddCategory: (category: CategoryItem) => void;
  onUpdateCategory: (category: CategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddBanner: (banner: HeroBanner) => void;
  onUpdateBanner: (banner: HeroBanner) => void;
  onDeleteBanner: (bannerId: string) => void;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (couponId: string) => void;
  onDeleteCoupon: (couponId: string) => void;
  onRestoreAllData: (data: {
    products: Product[];
    orders: Order[];
    categories: CategoryItem[];
    settings: SiteSettings;
    coupons: Coupon[];
  }) => void;
  onResetToDefaults: () => void;
  onCloseAdmin: () => void;
  adminPin: string;
  onUpdateAdminPin: (pin: string) => void;
  isAuthenticated: boolean;
  onSetAuthenticated: (auth: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  categories,
  settings,
  coupons,
  banners,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onUpdateSettings,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  onRestoreAllData,
  onResetToDefaults,
  onCloseAdmin,
  adminPin,
  onUpdateAdminPin,
  isAuthenticated,
  onSetAuthenticated,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'categories' | 'banners' | 'coupons' | 'settings'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

  // Login form state
  const [inputPin, setInputPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.trim() === adminPin.trim()) {
      onSetAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('ভুল পিন কোড! সঠিক পিন দিয়ে চেষ্টা করুন।');
    }
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  // IF NOT AUTHENTICATED: SHOW BEAUTIFUL ACCESS SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#111111] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-neutral-200">
          <button
            onClick={onCloseAdmin}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
            title="ওয়েবসাইটে ফিরুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-neutral-900 text-[#e8b04b] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">অ্যাডমিন প্রবেশাধিকার</h2>
            <p className="text-xs text-neutral-500 mt-1">
              {settings.storeName} {settings.logoHighlight} কন্ট্রোল প্যানেল
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                অ্যাডমিন সিকিউরিটি পিন (Security PIN)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="পিন লিখুন..."
                  className="w-full text-center tracking-widest text-lg px-10 py-2.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                  title={showPin ? 'পিন লুকান' : 'পিন দেখুন'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                <span>অননুমোদিত প্রবেশাধিকার কঠোরভাবে সংরক্ষিত</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
            >
              লগইন করুন (Enter Dashboard)
            </button>
          </form>
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'পণ্যসমূহ', labelEn: 'Products', icon: Package, badge: products.length },
    { id: 'orders', label: 'অর্ডার তালিকা', labelEn: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : orders.length },
    { id: 'categories', label: 'ক্যাটাগরি', labelEn: 'Categories', icon: Layers, badge: categories.length },
    { id: 'banners', label: 'ব্যানার ও অফার', labelEn: 'Banners & Offers', icon: Sparkles },
    { id: 'coupons', label: 'কুপন ডিসকাউন্ট', labelEn: 'Coupons', icon: Tag, badge: coupons.filter((c) => c.isActive).length },
    { id: 'settings', label: 'সাইট সেটিংস', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-neutral-900 flex flex-col font-sans">
      {/* TOP ADMIN BAR */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white px-4 sm:px-6 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden text-white p-1 hover:text-[#e8b04b]"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wider">
              {settings.storeName} <span className="text-[#e8b04b]">{settings.logoHighlight}</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#e8b04b] text-[#111]">
              ADMIN
            </span>
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-500/40 rounded-full text-emerald-400 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ক্লাউড সিঙ্ক সক্রিয়</span>
            </div>
          </div>
        </div>

        {/* TOP CONTROLS */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onCloseAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-[#e8b04b] hover:text-[#111] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            title="লাইভ ওয়েবসাইট দেখুন"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ভিউ ওয়েবসাইট</span>
          </button>

          <button
            onClick={() => onSetAuthenticated(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            title="লগআউট করুন"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION (DESKTOP) */}
        <aside className="hidden md:block w-64 bg-white border-r border-neutral-200/80 p-4 space-y-1 shrink-0">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
            প্রধান মেনু (Main Menu)
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e8b04b]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#e8b04b] text-[#111]'
                        : item.id === 'orders' && pendingOrdersCount > 0
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-neutral-100">
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>ক্লাউড ডাটাবেস সক্রিয়</span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">মোবাইল ও পিসিতে স্বয়ংক্রিয়ভাবে রিয়েল-টাইম সিঙ্ক হয়</div>
              <button
                onClick={onCloseAdmin}
                className="mt-2.5 w-full py-1.5 bg-[#111] text-white text-[11px] font-bold rounded hover:bg-[#e8b04b] hover:text-[#111] transition-colors"
              >
                সাইট দেখুন →
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR MODAL */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative w-64 bg-white h-full p-4 space-y-1 shadow-xl z-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200">
                  <span className="font-bold text-sm">অ্যাডমিন মেনু</span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold mb-1 cursor-pointer ${
                        isActive
                          ? 'bg-[#111111] text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#e8b04b]' : 'text-neutral-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <button
                  onClick={onCloseAdmin}
                  className="w-full py-2 bg-[#111] text-white text-xs font-bold rounded-lg"
                >
                  ওয়েবসাইটে ফিরুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN TAB CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardTab
              products={products}
              orders={orders}
              settings={settings}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onOpenAddProduct={() => {
                setActiveTab('products');
                setOpenAddProductModal(true);
              }}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              categories={categories}
              settings={settings}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              onAddCategory={onAddCategory}
              isAddModalOpenInitially={openAddProductModal}
              onCloseInitialAddModal={() => setOpenAddProductModal(false)}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              settings={settings}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onUpdatePaymentStatus={onUpdatePaymentStatus}
              onDeleteOrder={onDeleteOrder}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              products={products}
              onAddCategory={onAddCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {activeTab === 'banners' && (
            <BannersTab
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              banners={banners}
              onAddBanner={onAddBanner}
              onUpdateBanner={onUpdateBanner}
              onDeleteBanner={onDeleteBanner}
              categories={categories}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponsTab
              coupons={coupons}
              settings={settings}
              onAddCoupon={onAddCoupon}
              onToggleCoupon={onToggleCoupon}
              onDeleteCoupon={onDeleteCoupon}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              adminPin={adminPin}
              onUpdateAdminPin={onUpdateAdminPin}
              products={products}
              orders={orders}
              categories={categories}
              coupons={coupons}
              onRestoreAllData={onRestoreAllData}
              onResetToDefaults={onResetToDefaults}
            />
          )}
        </main>
      </div>
    </div>
  );
};
