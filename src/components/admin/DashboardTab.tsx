import React from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Package, 
  PlusCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import { Product, Order, SiteSettings } from '../../types';

interface DashboardTabProps {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  products,
  orders,
  settings,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  // Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const shippedOrders = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const outOfStockCount = products.filter((p) => p.inStock === false).length;
  const saleProductsCount = products.filter((p) => p.isSale).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP WELCOME BANNER */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-xl p-6 shadow-md border border-neutral-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#e8b04b]/20 text-[#e8b04b] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>কন্ট্রোল ড্যাশবোর্ড / Master Control</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            স্বাগতম, <span className="text-[#e8b04b]">{settings.storeName} {settings.logoHighlight}</span> অ্যাডমিন প্যানেলে
          </h2>
          <p className="text-neutral-300 text-sm mt-1">
            এখান থেকে আপনি পণ্য, অর্ডার, ব্যানার, ক্যাটাগরি এবং সাইটের সকল তথ্য নিয়ন্ত্রণ করতে পারেন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#e8b04b] text-[#111111] font-bold text-sm rounded-lg hover:bg-white transition-all shadow cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white font-medium text-sm rounded-lg transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>সকল অর্ডার ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* REVENUE CARD */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">মোট বিক্রয় (Revenue)</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900">
              {settings.currencySymbol}{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              সম্পূর্ণ ও সক্রিয় অর্ডারের সমষ্টি
            </p>
          </div>
        </div>

        {/* ORDERS CARD */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">মোট অর্ডার (Orders)</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900">
              {orders.length}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <span className="text-amber-600 font-semibold">{pendingOrders} পেন্ডিং</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{deliveredOrders} ডেলিভার্ড</span>
            </div>
          </div>
        </div>

        {/* PRODUCTS CARD */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">মোট পণ্য (Products)</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900">
              {products.length} টি
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <span className="text-red-500 font-medium">{outOfStockCount} আউট অফ স্টক</span>
              <span>•</span>
              <span className="text-[#111] font-medium">{saleProductsCount} অফারে আছে</span>
            </div>
          </div>
        </div>

        {/* PENDING ACTIONS */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">নতুন ডেলিভারি প্রস্তুত</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600">
              {pendingOrders + processingOrders}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {pendingOrders} টি নতুন অর্ডার অবিলম্বে প্রক্রিয়া করুন
            </p>
          </div>
        </div>
      </div>

      {/* QUICK STATUS BAR */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
          অর্ডার স্থিতি সামারি (Order Pipeline)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div 
            onClick={() => onNavigateTab('orders')}
            className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <div className="text-lg font-bold text-amber-800">{pendingOrders}</div>
            <div className="text-[11px] text-amber-700 font-medium">পেন্ডিং (Pending)</div>
          </div>
          <div 
            onClick={() => onNavigateTab('orders')}
            className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="text-lg font-bold text-blue-800">{processingOrders}</div>
            <div className="text-[11px] text-blue-700 font-medium">প্রসেসিং (Processing)</div>
          </div>
          <div 
            onClick={() => onNavigateTab('orders')}
            className="p-2.5 bg-purple-50/70 border border-purple-200/80 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
          >
            <div className="text-lg font-bold text-purple-800">{shippedOrders}</div>
            <div className="text-[11px] text-purple-700 font-medium">ডেলিভারিতে (Shipped)</div>
          </div>
          <div 
            onClick={() => onNavigateTab('orders')}
            className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <div className="text-lg font-bold text-emerald-800">{deliveredOrders}</div>
            <div className="text-[11px] text-emerald-700 font-medium">সম্পন্ন (Delivered)</div>
          </div>
          <div 
            onClick={() => onNavigateTab('orders')}
            className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-lg cursor-pointer hover:bg-rose-100 transition-colors col-span-2 sm:col-span-1"
          >
            <div className="text-lg font-bold text-rose-800">
              {orders.filter((o) => o.status === 'Cancelled').length}
            </div>
            <div className="text-[11px] text-rose-700 font-medium">বাতিল (Cancelled)</div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS & QUICK ACTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ORDERS TABLE (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</h3>
              <p className="text-xs text-neutral-500">গ্রাহকদের সর্বশেষ অর্ডার সমূহ</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#111] hover:text-[#e8b04b] flex items-center gap-1 cursor-pointer"
            >
              <span>সকল দেখুন</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">অর্ডার আইডি</th>
                  <th className="p-3">গ্রাহক</th>
                  <th className="p-3">আইটেম</th>
                  <th className="p-3">টাকা</th>
                  <th className="p-3">পেমেন্ট</th>
                  <th className="p-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-800">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-neutral-900">{order.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-neutral-900">{order.customerName}</div>
                        <div className="text-neutral-500 text-[11px]">{order.phone} • {order.city}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{order.items.reduce((s, i) => s + i.quantity, 0)} টি</span>
                      </td>
                      <td className="p-3 font-bold text-neutral-900">
                        {settings.currencySymbol}{order.total.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-neutral-500">
                      কোনো অর্ডার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK SHORTCUTS & SYSTEM STATUS */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-3">দ্রুত শর্টকাট (Quick Actions)</h3>
            <div className="space-y-2">
              <button
                onClick={onOpenAddProduct}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-[#111] hover:bg-neutral-50 transition-all flex items-center justify-between text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span>নতুন প্রডাক্ট আপলোড করুন</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateTab('banners')}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-[#111] hover:bg-neutral-50 transition-all flex items-center justify-between text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>হিরো ব্যানার ও অফার পরিবর্তন</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateTab('coupons')}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-[#111] hover:bg-neutral-50 transition-all flex items-center justify-between text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>ডিসকাউন্ট কুপন কোড সেট করুন</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-[#111] hover:bg-neutral-50 transition-all flex items-center justify-between text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-purple-50 text-purple-700 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <span>ঘোষণা বার ও যোগাযোগ তথ্য</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* STORE STATUS BOX */}
          <div className="bg-neutral-900 text-white p-5 rounded-xl border border-neutral-800 shadow-xs">
            <h4 className="text-xs font-bold text-[#e8b04b] uppercase tracking-wider mb-2">
              লাইভ স্টোর স্ট্যাটাস
            </h4>
            <p className="text-xs text-neutral-300 mb-3">
              অ্যানাউন্সমেন্ট বার: {settings.announcementEnabled ? (
                <span className="text-emerald-400 font-bold">চালু আছে</span>
              ) : (
                <span className="text-neutral-400">বন্ধ আছে</span>
              )}
            </p>
            <div className="text-xs bg-neutral-800 p-2.5 rounded border border-neutral-700 text-neutral-300 line-clamp-2">
              "{settings.announcementText}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
