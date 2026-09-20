import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Eye, 
  Printer, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileText,
  Copy,
  Check,
  CheckCheck,
  MessageCircle
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus, SiteSettings } from '../../types';

interface OrdersTabProps {
  orders: Order[];
  settings: SiteSettings;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdatePaymentStatus?: (orderId: string, newPaymentStatus: PaymentStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  settings,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);

  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard?.writeText(trxId);
    setCopiedTrxId(trxId);
    setTimeout(() => setCopiedTrxId(null), 2000);
  };

  // Status badge style helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Payment status badge style helper
  const getPaymentStatusBadge = (status?: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'পরিশোধিত (Paid)',
          icon: CheckCircle2,
        };
      case 'Pending Verification':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'যাচাই অপেক্ষমান (Pending)',
          icon: AlertCircle,
        };
      case 'Unpaid':
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-700 border-neutral-300',
          label: 'অপরিশোধিত (Unpaid)',
          icon: CreditCard,
        };
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const cleanQ = q.replace(/\D/g, '');
    const phoneClean = o.phone.replace(/\D/g, '');
    const senderClean = o.senderPhone ? o.senderPhone.replace(/\D/g, '') : '';

    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      (cleanQ.length >= 3 && (phoneClean.includes(cleanQ) || senderClean.includes(cleanQ))) ||
      o.city.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(q)) ||
      (o.senderPhone && o.senderPhone.includes(q));

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    const currentPaymentStatus = o.paymentStatus || 'Unpaid';
    const matchesPayment = paymentFilter === 'All' || currentPaymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const paidCount = orders.filter((o) => o.paymentStatus === 'Paid').length;
  const pendingVerifyCount = orders.filter((o) => o.paymentStatus === 'Pending Verification').length;
  const unpaidCount = orders.filter((o) => !o.paymentStatus || o.paymentStatus === 'Unpaid').length;

  return (
    <div className="space-y-5">
      {/* FILTER & STATS BAR */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="গ্রাহকের ফোন নম্বর (যেমন: 01804459691), নাম, TrxID বা অর্ডার আইডি..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => {
              const count = tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;
              const isActive = statusFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#111] text-[#e8b04b] font-bold shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {tab === 'All' ? 'সব অর্ডার' : tab} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* PAYMENT STATUS FILTER ROW */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-bold text-neutral-700">পেমেন্ট ফিল্টার:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setPaymentFilter('All')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                paymentFilter === 'All'
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              সব ({orders.length})
            </button>

            <button
              onClick={() => setPaymentFilter('Paid')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                paymentFilter === 'Paid'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>পরিশোধিত ({paidCount})</span>
            </button>

            <button
              onClick={() => setPaymentFilter('Pending Verification')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                paymentFilter === 'Pending Verification'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>যাচাই অপেক্ষমান ({pendingVerifyCount})</span>
            </button>

            <button
              onClick={() => setPaymentFilter('Unpaid')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                paymentFilter === 'Unpaid'
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              <span>অপরিশোধিত / ক্যাশ ({unpaidCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-neutral-200/90 shadow-xs p-4 sm:p-5 hover:border-neutral-300 transition-all"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-100 pb-3 mb-3.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                      {order.id}
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {order.createdAt}
                    </span>

                    {/* PAYMENT STATUS BADGE */}
                    {(() => {
                      const currentPaymentStatus = order.paymentStatus || 'Unpaid';
                      const paymentBadgeInfo = getPaymentStatusBadge(currentPaymentStatus);
                      const PaymentIcon = paymentBadgeInfo.icon;
                      return (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${paymentBadgeInfo.bg}`}
                        >
                          <PaymentIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{paymentBadgeInfo.label}</span>
                        </span>
                      );
                    })()}
                  </div>

                  {/* CONTROLS: ORDER STATUS & PAYMENT STATUS */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* PAYMENT STATUS SELECTOR */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-neutral-500 font-medium">পেমেন্ট:</span>
                      <select
                        value={order.paymentStatus || 'Unpaid'}
                        onChange={(e) =>
                          onUpdatePaymentStatus &&
                          onUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)
                        }
                        className={`text-xs font-bold px-2 py-1 rounded-md border outline-none cursor-pointer ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.paymentStatus === 'Pending Verification'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-300'
                        }`}
                      >
                        <option value="Paid">✓ Paid (পরিশোধিত)</option>
                        <option value="Pending Verification">⏳ Pending (যাচাই অপেক্ষমান)</option>
                        <option value="Unpaid">✕ Unpaid (অপরিশোধিত)</option>
                      </select>
                    </div>

                    {/* ORDER STATUS SELECTOR */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-neutral-500 font-medium">অর্ডার:</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border outline-none cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending (অপেক্ষমাণ)</option>
                        <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
                        <option value="Shipped">Shipped (ডেলিভারিতে)</option>
                        <option value="Delivered">Delivered (সম্পন্ন)</option>
                        <option value="Cancelled">Cancelled (বাতিল)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ORDER CONTENT: CUSTOMER & ITEMS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CUSTOMER & PAYMENT INFO */}
                  <div className="space-y-2 text-xs text-neutral-700 bg-neutral-50/70 p-3 rounded-lg border border-neutral-100">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-sm">
                      <User className="w-3.5 h-3.5 text-[#111]" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <Phone className="w-3.5 h-3.5 text-[#e8b04b]" />
                      <a href={`tel:${order.phone}`} className="hover:underline font-mono">
                        {order.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-1.5 text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                      <span>{order.address}, <strong className="text-neutral-800">{order.city}</strong></span>
                    </div>

                    {/* PAYMENT DETAILS SECTION */}
                    <div className="pt-2 border-t border-neutral-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">পেমেন্ট মেথড:</span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                            order.paymentMethod === 'bkash'
                              ? 'bg-pink-100 text-[#e2136e] border border-pink-200'
                              : order.paymentMethod === 'nagad'
                              ? 'bg-amber-100 text-[#f7941d] border border-amber-200'
                              : 'bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : order.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      {order.senderPhone && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">প্রেরক নম্বর:</span>
                          <a
                            href={`tel:${order.senderPhone}`}
                            className="font-mono font-bold text-neutral-900 hover:underline"
                          >
                            {order.senderPhone}
                          </a>
                        </div>
                      )}

                      {order.transactionId && (
                        <div className="bg-white p-2 rounded-md border border-neutral-200 flex items-center justify-between gap-1 shadow-2xs">
                          <div className="min-w-0">
                            <span className="text-[10px] text-neutral-400 font-bold block">TrxID:</span>
                            <span className="font-mono font-bold text-xs text-neutral-900 tracking-wider">
                              {order.transactionId}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyTrx(order.transactionId!)}
                            className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                            title="Transaction ID কপি করুন"
                          >
                            {copiedTrxId === order.transactionId ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">কপি হয়েছে</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* QUICK ACTION TO MARK PAID */}
                      {order.paymentStatus === 'Pending Verification' && onUpdatePaymentStatus && (
                        <button
                          type="button"
                          onClick={() => onUpdatePaymentStatus(order.id, 'Paid')}
                          className="w-full mt-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>পেমেন্ট নিশ্চিত করুন (Mark Paid)</span>
                        </button>
                      )}

                      {order.couponCode && (
                        <div className="pt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            কুপন: {order.couponCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ITEMS LIST (Spans 2 cols) */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${item.productId}-${idx}`}
                          className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-neutral-50 transition-colors border border-neutral-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-11 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {item.productName}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                {item.selectedSize && <span className="mr-2">সাইজ: <strong>{item.selectedSize}</strong></span>}
                                <span>পরিমাণ: <strong>{item.quantity}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-xs font-bold text-neutral-900 shrink-0">
                            {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FINANCIAL SUMMARY & ACTIONS */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-neutral-100">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-neutral-500">
                          সাবটোটাল: {settings.currencySymbol}{order.subtotal.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="text-neutral-500">
                          ডেলিভারি: {order.deliveryFee === 0 ? 'FREE' : `${settings.currencySymbol}${order.deliveryFee}`}
                        </span>
                        {order.discountAmount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">
                              ছাড়: -{settings.currencySymbol}{order.discountAmount.toLocaleString()}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-sm font-bold text-neutral-900">
                          মোট: {settings.currencySymbol}{order.total.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <a
                          href={`https://wa.me/${
                            order.phone.replace(/\D/g, '').startsWith('880')
                              ? order.phone.replace(/\D/g, '')
                              : order.phone.replace(/\D/g, '').startsWith('0')
                              ? '88' + order.phone.replace(/\D/g, '')
                              : '8801352113432'
                          }?text=${encodeURIComponent(
                            `আসসালামু আলাইকুম ${order.customerName},\n${settings.storeName} ${settings.logoHighlight} থেকে আপনার অর্ডার #${order.id} সংক্রান্ত তথ্য:\nমোট টাকা: ${settings.currencySymbol}${order.total.toLocaleString()}\nস্ট্যাটাস: ${order.status}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer border border-emerald-200"
                          title="কাস্টমারকে হোয়াটসঅ্যাপে মেসেজ দিন"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="ইনভয়েস মেমো দেখুন ও প্রিন্ট করুন"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ইনভয়েস / মেমো</span>
                        </button>

                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="অর্ডার ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 text-neutral-500">
            কোনো অর্ডার খুঁজে পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* INVOICE / ORDER RECEIPT MODAL */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setSelectedOrderForInvoice(null)} />

          <div className="relative bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="printable-invoice" className="space-y-5">
              {/* STORE BRANDING INVOICE HEADER */}
              <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-wider text-neutral-900">
                    {settings.storeName} <span className="text-[#e8b04b]">{settings.logoHighlight}</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">ক্যাশ মেমো ও ডেলিভারি চালান</p>
                  <p className="text-[11px] text-neutral-500">{settings.contactAddress}</p>
                  <p className="text-[11px] text-neutral-500">হটলাইন: {settings.contactPhone}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500">অর্ডার নম্বর:</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm">{selectedOrderForInvoice.id}</div>
                  <div className="text-[11px] text-neutral-500 mt-1">{selectedOrderForInvoice.createdAt}</div>
                </div>
              </div>

              {/* CUSTOMER & PAYMENT DETAILS */}
              <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 text-xs space-y-1.5">
                <div className="font-bold text-neutral-900 text-sm">প্রাপকের বিবরণ:</div>
                <div className="font-medium text-neutral-800">{selectedOrderForInvoice.customerName}</div>
                <div className="text-neutral-600">ফোন: {selectedOrderForInvoice.phone}</div>
                <div className="text-neutral-600">ঠিকানা: {selectedOrderForInvoice.address}, {selectedOrderForInvoice.city}</div>
                
                <div className="pt-2 border-t border-neutral-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500">পেমেন্ট মাধ্যম: </span>
                    <strong className="text-neutral-900 uppercase">
                      {selectedOrderForInvoice.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrderForInvoice.paymentMethod.toUpperCase()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">পেমেন্ট অবস্থা: </span>
                    <strong className={`${
                      selectedOrderForInvoice.paymentStatus === 'Paid' 
                        ? 'text-emerald-700' 
                        : selectedOrderForInvoice.paymentStatus === 'Pending Verification' 
                        ? 'text-amber-700' 
                        : 'text-neutral-700'
                    }`}>
                      {selectedOrderForInvoice.paymentStatus === 'Paid' 
                        ? 'পরিশোধিত (PAID)' 
                        : selectedOrderForInvoice.paymentStatus === 'Pending Verification' 
                        ? 'যাচাই অপেক্ষমান (PENDING)' 
                        : 'অপরিশোধিত (UNPAID)'}
                    </strong>
                  </div>
                  {selectedOrderForInvoice.transactionId && (
                    <div className="col-span-2 bg-white p-2 rounded border border-neutral-200">
                      <span className="text-neutral-500">Transaction ID (TrxID): </span>
                      <strong className="font-mono text-neutral-900 text-xs">{selectedOrderForInvoice.transactionId}</strong>
                    </div>
                  )}
                  {selectedOrderForInvoice.senderPhone && (
                    <div className="col-span-2">
                      <span className="text-neutral-500">পেমেন্ট প্রেরক নম্বর: </span>
                      <strong className="font-mono text-neutral-900">{selectedOrderForInvoice.senderPhone}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* ITEMS TABLE */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100 text-neutral-700 font-semibold">
                    <tr>
                      <th className="p-2.5">পণ্য</th>
                      <th className="p-2.5 text-center">সাইজ</th>
                      <th className="p-2.5 text-center">পরিমাণ</th>
                      <th className="p-2.5 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {selectedOrderForInvoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-medium">{item.productName}</td>
                        <td className="p-2.5 text-center">{item.selectedSize || '-'}</td>
                        <td className="p-2.5 text-center">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono">
                          {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTALS */}
              <div className="bg-neutral-50 p-3.5 rounded-lg text-xs space-y-1.5 border border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>সাবটোটাল:</span>
                  <span>{settings.currencySymbol}{selectedOrderForInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{selectedOrderForInvoice.deliveryFee === 0 ? 'FREE' : `${settings.currencySymbol}${selectedOrderForInvoice.deliveryFee}`}</span>
                </div>
                {selectedOrderForInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>ডিসকাউন্ট ({selectedOrderForInvoice.couponCode}):</span>
                    <span>-{settings.currencySymbol}{selectedOrderForInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>সর্বমোট প্রদেয় টাকা:</span>
                  <span className="text-base font-bold text-[#111]">
                    {settings.currencySymbol}{selectedOrderForInvoice.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-center text-neutral-400">
                ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য! কোনো সমস্যায় কল করুন {settings.contactPhone}
              </div>

              {/* PRINT BUTTON */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#111] text-white hover:bg-[#e8b04b] hover:text-[#111] text-xs font-bold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট / সেভ করুন (Print Invoice)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ORDER DELETE CONFIRMATION MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => setOrderToDelete(null)} 
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 text-center mb-1">
              অর্ডার মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-neutral-500 text-center mb-4">
              আপনি কি নিশ্চিত যে অর্ডার <strong>{orderToDelete.id}</strong> মুছে ফেলতে চান? গ্রাহকের নাম: {orderToDelete.customerName}
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
