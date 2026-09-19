import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  CreditCard,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus, SiteSettings } from '../types';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  settings: SiteSettings;
  initialPhone?: string;
}

// Helper to normalize phone numbers (strip +88, spaces, dashes)
const normalizePhoneNumber = (raw: string) => {
  const digitsOnly = raw.replace(/\D/g, '');
  if (digitsOnly.startsWith('880') && digitsOnly.length === 13) {
    return '0' + digitsOnly.slice(3);
  }
  return digitsOnly;
};

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({
  isOpen,
  onClose,
  orders,
  settings,
  initialPhone = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [searchedNumber, setSearchedNumber] = useState(initialPhone);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) return;
    setSearchedNumber(phoneNumber.trim());
    setHasSearched(true);
  };

  // Find matching orders by phone, sender phone or Order ID
  const cleanSearch = normalizePhoneNumber(searchedNumber);
  const rawSearchLower = searchedNumber.toLowerCase().trim();

  const matchingOrders = hasSearched
    ? orders.filter((order) => {
        const orderPhoneClean = normalizePhoneNumber(order.phone);
        const senderPhoneClean = order.senderPhone ? normalizePhoneNumber(order.senderPhone) : '';
        const orderIdLower = order.id.toLowerCase();

        return (
          (cleanSearch.length >= 4 && (orderPhoneClean.includes(cleanSearch) || senderPhoneClean.includes(cleanSearch))) ||
          orderIdLower.includes(rawSearchLower) ||
          order.phone.includes(searchedNumber.trim())
        );
      })
    : [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          text: 'অর্ডার গৃহীত হয়েছে (Pending)',
          step: 1,
        };
      case 'Processing':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          text: 'প্রক্রিয়াধীন রয়েছে (Processing)',
          step: 2,
        };
      case 'Shipped':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          text: 'ডেলিভারিতে রয়েছে (Shipped)',
          step: 3,
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          text: 'ডেলিভারি সম্পন্ন (Delivered)',
          step: 4,
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          text: 'বাতিল করা হয়েছে (Cancelled)',
          step: 0,
        };
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-800 border-neutral-300',
          text: status,
          step: 1,
        };
    }
  };

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
          label: 'যাচাই অপেক্ষমান (Verification Pending)',
          icon: AlertCircle,
        };
      case 'Unpaid':
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-700 border-neutral-300',
          label: 'ক্যাশ অন ডেলিভারি / অপরিশোধিত (Unpaid)',
          icon: CreditCard,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden border border-neutral-200">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8b04b] text-[#111111] flex items-center justify-center font-bold shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">অর্ডার ট্র্যাকিং ও খোঁজ (Order Track)</h3>
              <p className="text-xs text-neutral-400">ফোন নম্বর দিয়ে আপনার অর্ডারের বর্তমান অবস্থা জানুন</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH INPUT BAR */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="আপনার ফোন নম্বর দিন (যেমন: 01804459691 বা অর্ডার আইডি)..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl focus:border-[#111] focus:ring-1 focus:ring-[#111] outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!phoneNumber.trim()}
              className="px-5 py-2.5 bg-[#111111] hover:bg-[#e8b04b] text-white hover:text-[#111111] text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>খুঁজুন</span>
            </button>
          </form>

          {/* QUICK SUGGESTION CHIPS */}
          {!hasSearched && orders.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-neutral-500">
              <span>সাম্প্রতিক নম্বর:</span>
              {Array.from(new Set(orders.map((o) => o.phone))).slice(0, 3).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPhoneNumber(p);
                    setSearchedNumber(p);
                    setHasSearched(true);
                  }}
                  className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-neutral-700 hover:border-neutral-400 font-mono cursor-pointer transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RESULTS SCROLLABLE AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {!hasSearched ? (
            <div className="py-12 text-center text-neutral-500 space-y-3">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-700">ফোন নম্বর লিখে "খুঁজুন" বাটনে চাপ দিন</p>
                <p className="text-xs text-neutral-400 mt-1">
                  অর্ডার করার সময় যে মোবাইল নম্বরটি ব্যবহার করেছিলেন তা প্রবেশ করান।
                </p>
              </div>
            </div>
          ) : matchingOrders.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs">
                <span className="text-neutral-600">
                  নম্বর <strong>{searchedNumber}</strong> এর অধীনে <strong>{matchingOrders.length}</strong> টি অর্ডার পাওয়া গেছে:
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ অর্ডার ভেরিফাইড
                </span>
              </div>

              {matchingOrders.map((order) => {
                const statusInfo = getStatusBadge(order.status);
                const paymentInfo = getPaymentStatusBadge(order.paymentStatus);
                const PaymentIcon = paymentInfo.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-neutral-200 shadow-xs p-4 sm:p-5 space-y-4 hover:border-neutral-300 transition-all"
                  >
                    {/* ORDER TOP BAR */}
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-neutral-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                            {order.id}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>তারিখ: {order.createdAt}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>রশিদ / ইনভয়েস</span>
                      </button>
                    </div>

                    {/* STATUS PROGRESS BAR (IF NOT CANCELLED) */}
                    {order.status !== 'Cancelled' ? (
                      <div className="py-2 px-1">
                        <div className="relative flex items-center justify-between">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 w-full z-0" />
                          <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#e8b04b] z-0 transition-all duration-500"
                            style={{ 
                              width: statusInfo.step === 1 ? '15%' : statusInfo.step === 2 ? '50%' : statusInfo.step === 3 ? '80%' : '100%' 
                            }} 
                          />

                          {[
                            { label: 'অর্ডার গৃহীত', step: 1 },
                            { label: 'প্রসেসিং', step: 2 },
                            { label: 'ডেলিভারিতে', step: 3 },
                            { label: 'সম্পন্ন', step: 4 },
                          ].map((s) => {
                            const isPassed = statusInfo.step >= s.step;
                            return (
                              <div key={s.step} className="relative z-10 flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                    isPassed
                                      ? 'bg-[#111111] text-[#e8b04b] ring-2 ring-[#e8b04b]'
                                      : 'bg-white text-neutral-400 border-2 border-neutral-300'
                                  }`}
                                >
                                  {isPassed ? '✓' : s.step}
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${isPassed ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                                  {s.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে অনুগ্রহ করে কাস্টমার কেয়ারে যোগাযোগ করুন।</span>
                      </div>
                    )}

                    {/* CUSTOMER & PAYMENT DETAILS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl text-xs border border-neutral-100">
                      {/* RECIPIENT */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">ডেলিভারি ঠিকানা:</span>
                        <div className="font-bold text-neutral-900">{order.customerName}</div>
                        <div className="text-neutral-600 font-mono">{order.phone}</div>
                        <div className="text-neutral-600 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span>{order.address}, <strong>{order.city}</strong></span>
                        </div>
                      </div>

                      {/* PAYMENT INFO */}
                      <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-neutral-200 pt-2 sm:pt-0 sm:pl-3">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">পেমেন্ট বিবরণ:</span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">মাধ্যম:</span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                              order.paymentMethod === 'bkash'
                                ? 'bg-pink-100 text-[#e2136e]'
                                : order.paymentMethod === 'nagad'
                                ? 'bg-amber-100 text-[#f7941d]'
                                : 'bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : order.paymentMethod.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">স্ট্যাটাস:</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${paymentInfo.bg}`}>
                            <PaymentIcon className="w-3 h-3" />
                            <span>{paymentInfo.label}</span>
                          </span>
                        </div>

                        {order.transactionId && (
                          <div className="bg-white p-1.5 rounded border border-neutral-200 text-[11px] font-mono">
                            <span className="text-neutral-400">TrxID: </span>
                            <strong className="text-neutral-900">{order.transactionId}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ITEMS ORDERED */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-neutral-700 block">অর্ডারকৃত পণ্যসমূহ:</span>
                      <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between gap-3 bg-white hover:bg-neutral-50">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-10 h-12 object-cover rounded-md border border-neutral-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-neutral-900 truncate">{item.productName}</h4>
                                <div className="text-[11px] text-neutral-500">
                                  {item.selectedSize && <span className="mr-2">সাইজ: <strong>{item.selectedSize}</strong></span>}
                                  <span>পরিমাণ: <strong>{item.quantity} টি</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-xs font-bold text-neutral-900 font-mono shrink-0">
                              {settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ORDER TOTAL BAR */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100 text-xs">
                      <div className="text-neutral-500 flex items-center gap-3">
                        <span>সাবটোটাল: {settings.currencySymbol}{order.subtotal.toLocaleString()}</span>
                        <span>•</span>
                        <span>ডেলিভারি চার্জ: {settings.currencySymbol}{order.deliveryFee}</span>
                        {order.discountAmount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">ছাড়: -{settings.currencySymbol}{order.discountAmount}</span>
                          </>
                        )}
                      </div>

                      <div className="text-sm font-bold text-neutral-900">
                        সর্বমোট: <span className="text-[#e8b04b] font-extrabold">{settings.currencySymbol}{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* NO ORDER FOUND STATE */
            <div className="py-10 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-base font-bold text-neutral-900">
                  কোনো অর্ডার পাওয়া যায়নি!
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  আমরা <strong>"{searchedNumber}"</strong> নম্বরটির অধীনে কোনো অর্ডার খুঁজে পাইনি।
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left text-xs text-neutral-600 max-w-md mx-auto space-y-2">
                <span className="font-bold text-neutral-800 block">করণীয় পরামর্শ:</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  <li>নম্বরটি টাইপ করতে কোনো ভুল হয়েছে কিনা চেক করুন।</li>
                  <li>চেকআউট করার সময় যে নম্বরটি দিয়েছিলেন সেটি লিখুন।</li>
                  <li>অথবা সরাসরি আপনার অর্ডার আইডি (যেমন: ORD-...) লিখে খুঁজুন।</li>
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-[#e8b04b] hover:text-neutral-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>সাহায্যের জন্য কল করুন: {settings.contactPhone}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span>হটলাইন: <strong className="text-neutral-800">{settings.contactPhone}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-bold transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>

      {/* DETAILED RECEIPT / INVOICE MODAL POPUP */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedInvoiceOrder(null)} />

          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="customer-printable-invoice" className="space-y-4">
              <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold tracking-wider text-neutral-900">
                    {settings.storeName} <span className="text-[#e8b04b]">{settings.logoHighlight}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">ক্যাশ মেমো ও ডেলিভারি চালান</p>
                  <p className="text-[11px] text-neutral-500">{settings.contactAddress}</p>
                  <p className="text-[11px] text-neutral-500">হটলাইন: {settings.contactPhone}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500">অর্ডার নম্বর:</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm">{selectedInvoiceOrder.id}</div>
                  <div className="text-[11px] text-neutral-500 mt-1">{selectedInvoiceOrder.createdAt}</div>
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs space-y-1">
                <div className="font-bold text-neutral-900">প্রাপক: {selectedInvoiceOrder.customerName}</div>
                <div>ফোন: {selectedInvoiceOrder.phone}</div>
                <div>ঠিকানা: {selectedInvoiceOrder.address}, {selectedInvoiceOrder.city}</div>
                <div>পেমেন্ট মাধ্যম: {selectedInvoiceOrder.paymentMethod.toUpperCase()} ({selectedInvoiceOrder.paymentStatus || 'Unpaid'})</div>
                {selectedInvoiceOrder.transactionId && (
                  <div>TrxID: <strong className="font-mono">{selectedInvoiceOrder.transactionId}</strong></div>
                )}
              </div>

              {/* ITEMS */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold">
                    <tr>
                      <th className="p-2">পণ্য</th>
                      <th className="p-2 text-center">পরিমাণ</th>
                      <th className="p-2 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {selectedInvoiceOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{it.productName} {it.selectedSize ? `(${it.selectedSize})` : ''}</td>
                        <td className="p-2 text-center">{it.quantity}</td>
                        <td className="p-2 text-right font-mono">{settings.currencySymbol}{(it.price * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-xs border-t border-neutral-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">সাবটোটাল:</span>
                  <span>{settings.currencySymbol}{selectedInvoiceOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">ডেলিভারি চার্জ:</span>
                  <span>{settings.currencySymbol}{selectedInvoiceOrder.deliveryFee}</span>
                </div>
                {selectedInvoiceOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>ডিসকাউন্ট:</span>
                    <span>-{settings.currencySymbol}{selectedInvoiceOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-neutral-200 pt-2 text-neutral-900">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-[#e8b04b] font-extrabold">{settings.currencySymbol}{selectedInvoiceOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট করুন (Print)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-4 py-2.5 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  ফিরে যান
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
