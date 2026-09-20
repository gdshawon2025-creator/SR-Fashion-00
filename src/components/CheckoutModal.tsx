import React, { useState } from 'react';
import { X, CheckCircle, Truck, Tag, Check, AlertCircle, Copy, CreditCard, ShieldCheck, MessageCircle, ExternalLink, Send } from 'lucide-react';
import { CartItem, Coupon, SiteSettings, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: () => void;
  coupons: Coupon[];
  settings: SiteSettings;
  onOrderCreated: (order: Order) => void;
}

// Clean Bangladesh phone number for WhatsApp wa.me link
export const formatWhatsAppNumber = (phoneStr: string): string => {
  const clean = phoneStr.replace(/\D/g, '');
  if (clean.startsWith('880')) return clean;
  if (clean.startsWith('0')) return '88' + clean;
  if (clean.length === 10) return '880' + clean;
  return clean.length ? (clean.startsWith('88') ? clean : '88' + clean) : '8801352113432';
};

// Build rich Bengali confirmation message with full order breakdown
export const buildWhatsAppConfirmationMessage = (order: Order, settings: SiteSettings): string => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*${item.selectedSize ? ` [সাইজ: ${item.selectedSize}]` : ''}\n   ↳ পরিমাণ: ${item.quantity}টি | মূল্য: ${settings.currencySymbol}${item.price.toLocaleString()} x ${item.quantity} = *${settings.currencySymbol}${(item.quantity * item.price).toLocaleString()}*`
    )
    .join('\n');

  const paymentLabel =
    order.paymentMethod === 'bkash'
      ? 'বিকাশ (bKash Send Money)'
      : order.paymentMethod === 'nagad'
      ? 'নগদ (Nagad Send Money)'
      : 'ক্যাশ অন ডেলিভারি (Cash on Delivery)';

  const discountLine =
    order.discountAmount > 0
      ? `\n🎁 *ডিসকাউন্ট (কুপন ${order.couponCode || 'প্রযোজ্য'}):* -${settings.currencySymbol}${order.discountAmount.toLocaleString()}`
      : '';

  const trxLine = order.transactionId
    ? `\n💳 *TrxID:* ${order.transactionId}\n📱 *পেমেন্ট প্রেরক নম্বর:* ${order.senderPhone || order.phone}`
    : '';

  return `🛍️ *নতুন অর্ডার কনফার্মেশন - ${settings.storeName} ${settings.logoHighlight}*
━━━━━━━━━━━━━━━━━━━━━
📦 *অর্ডার আইডি:* ${order.id}
🗓️ *তারিখ ও সময়:* ${order.createdAt}

👤 *গ্রাহকের বিবরণ:*
• নাম: ${order.customerName}
• মোবাইল নম্বর: ${order.phone}
• ডেলিভারি ঠিকানা: ${order.address}, ${order.city}

🛒 *অর্ডারকৃত পণ্যসমূহ:*
${itemsText}

💰 *হিসাব বিবরণী:*
• সাবটোটাল: ${settings.currencySymbol}${order.subtotal.toLocaleString()}
• ডেলিভারি চার্জ (${order.city}): ${order.deliveryFee === 0 ? 'ফ্রি (FREE)' : `${settings.currencySymbol}${order.deliveryFee}`}${discountLine}
━━━━━━━━━━━━━━━━━━━━━
*সর্বমোট প্রদেয় টাকা:* ${settings.currencySymbol}${order.total.toLocaleString()}

💳 *পেমেন্ট সংক্রান্ত তথ্য:*
• মাধ্যম: ${paymentLabel}
• পেমেন্ট স্ট্যাটাস: ${order.paymentStatus || 'Pending'}${trxLine}

✅ দ্রুত অর্ডারটি কনফার্ম করুন ও ডেলিভারির প্রস্তুতি নিন। ধন্যবাদ!`;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
  coupons,
  settings,
  onOrderCreated,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedWaMessage, setCopiedWaMessage] = useState(false);

  // Target WhatsApp number (Default 01352113432 as requested)
  const targetWhatsApp = settings.whatsappNumber || '01352113432';

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const currentPaymentNumber = paymentMethod === 'bkash' 
    ? (settings.bkashNumber || '01804459691') 
    : (settings.nagadNumber || '01804459691');

  const handleCopyPaymentNumber = () => {
    navigator.clipboard?.writeText(currentPaymentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : city === 'Dhaka' ? 60 : 120;
  
  // Calculate discount if coupon applied
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCodeInput.trim().toUpperCase();
    if (!clean) return;

    const matched = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
    if (!matched) {
      setPromoMessage({ text: 'অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড', isError: true });
      return;
    }

    if (subtotal < matched.minOrderAmount) {
      setPromoMessage({
        text: `এই কুপনের জন্য সর্বনিম্ন ${settings.currencySymbol}${matched.minOrderAmount} এর অর্ডার প্রয়োজন`,
        isError: true,
      });
      return;
    }

    setAppliedCoupon(matched);
    setPromoMessage({ text: `সফল! ${matched.discountPercent}% ছাড় প্রযোজ্য হয়েছে`, isError: false });
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCodeInput('');
    setPromoMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা পূরণ করুন।');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      setError(`অনুগ্রহ করে ${paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} পেমেন্ট সম্পন্ন করে Transaction ID (TrxID) প্রদান করুন। ক্যাশ অন ডেলিভারি চাইলে Cash on Delivery বেছে নিন।`);
      return;
    }

    setError('');
    setIsSubmitting(true);

    const generatedOrderNum = `SRF-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: generatedOrderNum,
      customerName: name.trim(),
      phone: phone.trim(),
      city: city,
      address: address.trim(),
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Unpaid' : transactionId.trim() ? 'Pending Verification' : 'Unpaid',
      transactionId: transactionId.trim() ? transactionId.trim().toUpperCase() : undefined,
      senderPhone: senderPhone.trim() || phone.trim(),
      status: 'Pending',
      items: cartItems.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        selectedSize: ci.selectedSize,
        image: ci.product.image,
      })),
      subtotal,
      deliveryFee,
      discountAmount,
      couponCode: appliedCoupon?.code,
      total: grandTotal,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    // Simulate order placement and store into admin state
    const waText = buildWhatsAppConfirmationMessage(newOrder, settings);
    const waUrl = `https://wa.me/${formatWhatsAppNumber(targetWhatsApp)}?text=${encodeURIComponent(waText)}`;

    // Automatically trigger opening WhatsApp in a new tab with order details
    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      console.warn('Direct window.open prevented by browser popup settings:', err);
    }

    setTimeout(() => {
      onOrderCreated(newOrder);
      setOrderNumber(generatedOrderNum);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      setStep('success');
      onOrderCompleted();
    }, 600);
  };

  const handleClose = () => {
    setStep('form');
    setName('');
    setPhone('');
    setAddress('');
    setSenderPhone('');
    setTransactionId('');
    setAppliedCoupon(null);
    setPromoCodeInput('');
    setPromoMessage(null);
    setCompletedOrder(null);
    setCopiedWaMessage(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={handleClose} />

      <div className="relative bg-white rounded-xl max-w-xl w-full p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="border-b border-neutral-200 pb-4 mb-5">
              <h2 className="text-xl font-bold text-neutral-900">Checkout & Delivery Details</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Fast doorstep delivery anywhere in Bangladesh
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {error}
                </div>
              )}

              {/* PERSONAL INFO */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full text-sm px-3.5 py-2.5 border border-neutral-300 rounded focus:border-[#111111] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Phone Number (Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full text-sm px-3.5 py-2.5 border border-neutral-300 rounded focus:border-[#111111] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    City / Division
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 border border-neutral-300 rounded focus:border-[#111111] outline-none bg-white"
                  >
                    <option value="Dhaka">Dhaka (Inside ৳60)</option>
                    <option value="Chattogram">Chattogram (৳120)</option>
                    <option value="Sylhet">Sylhet (৳120)</option>
                    <option value="Rajshahi">Rajshahi (৳120)</option>
                    <option value="Khulna">Khulna (৳120)</option>
                    <option value="Barishal">Barishal (৳120)</option>
                    <option value="Rangpur">Rangpur (৳120)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Delivery Speed
                  </label>
                  <div className="text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-600 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#e8b04b]" />
                    <span>2 - 4 Business Days</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Full Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Apartment, Road, Area, Thana/Post Code"
                  className="w-full text-sm px-3.5 py-2.5 border border-neutral-300 rounded focus:border-[#111111] outline-none resize-none"
                />
              </div>

              {/* PROMO CODE BOX */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#e8b04b]" />
                  <span>Promo Code / কুপন কোড (যেমন: EID2026)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={Boolean(appliedCoupon)}
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="কুপন কোড লিখুন..."
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded font-mono font-bold uppercase focus:border-[#111] outline-none disabled:bg-neutral-100"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded border border-red-200"
                    >
                      মুছুন
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white text-xs font-bold rounded transition-colors"
                    >
                      প্রয়োগ করুন
                    </button>
                  )}
                </div>

                {promoMessage && (
                  <div
                    className={`mt-1.5 text-xs flex items-center gap-1 font-medium ${
                      promoMessage.isError ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.isError ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{promoMessage.text}</span>
                  </div>
                )}
              </div>

              {/* PAYMENT METHODS */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                  Payment Method / পেমেন্ট মাধ্যম বেছে নিন *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#111111] bg-neutral-900 text-white font-bold shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-xs font-bold">ক্যাশ অন ডেলিভারি</div>
                    <div className="text-[10px] opacity-80">Cash on Delivery</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e] text-white font-bold shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:bg-pink-50/50'
                    }`}
                  >
                    <div className="text-xs font-bold">বিকাশ (bKash)</div>
                    <div className="text-[10px] opacity-80">সরাসরি পেমেন্ট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d] text-white font-bold shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="text-xs font-bold">নগদ (Nagad)</div>
                    <div className="text-[10px] opacity-80">সরাসরি পেমেন্ট</div>
                  </button>
                </div>

                {/* DIRECT PAYMENT INSTRUCTION & NUMBER BOX (For bKash & Nagad) */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div
                    className={`mt-3 p-4 rounded-xl border transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-pink-50/70 border-pink-200 text-neutral-800'
                        : 'bg-amber-50/70 border-amber-200 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/10">
                      <div className="flex items-center gap-2">
                        <CreditCard className={`w-4 h-4 ${paymentMethod === 'bkash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}`} />
                        <span className="font-bold text-xs">
                          {paymentMethod === 'bkash' ? 'বিকাশ (bKash) পার্সোনাল পেমেন্ট' : 'নগদ (Nagad) পার্সোনাল পেমেন্ট'}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-black/10">
                        Personal (Send Money)
                      </span>
                    </div>

                    {/* PAYMENT NUMBER CALLOUT */}
                    <div className="mt-3 bg-white p-3 rounded-lg border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase">পেমেন্ট নম্বর (Send Money):</div>
                        <div className="text-base sm:text-lg font-black font-mono tracking-wider text-neutral-900">
                          {currentPaymentNumber}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyPaymentNumber}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-[#e8b04b] hover:text-neutral-900 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedNumber ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>নম্বর কপি করুন</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`tel:${currentPaymentNumber}`}
                          className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md text-xs font-medium transition-colors"
                          title="ডায়াল করুন"
                        >
                          কল করুন
                        </a>
                      </div>
                    </div>

                    {/* STEP BY STEP INSTRUCTIONS */}
                    <div className="mt-3 text-[11px] text-neutral-600 space-y-1 bg-white/50 p-2.5 rounded-lg border border-black/5">
                      <div className="font-bold text-neutral-800">পেমেন্ট করার সহজ ধাপ:</div>
                      <div>১. আপনার {paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} অ্যাপে যান বা ডায়াল করুন।</div>
                      <div>২. <strong>Send Money</strong> অপশনে গিয়ে নম্বর দিন: <strong className="font-mono text-neutral-900">{currentPaymentNumber}</strong></div>
                      <div>৩. প্রদেয় টাকার পরিমাণ লিখুন: <strong className="font-mono text-neutral-900">{settings.currencySymbol}{grandTotal.toLocaleString()}</strong></div>
                      <div>৪. পেমেন্ট সম্পন্ন হলে ফিরতি এসএমএস থেকে <strong>Transaction ID (TrxID)</strong> এবং আপনার যে নম্বর থেকে টাকা পাঠিয়েছেন তা নিচে লিখুন:</div>
                    </div>

                    {/* SENDER NUMBER & TRXID INPUT FIELDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-2 border-t border-black/10">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder={phone || '01XXXXXXXXX'}
                          className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded-md focus:border-[#111] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                          Transaction ID (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          placeholder="যেমন: BL92X710PQ"
                          className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded-md focus:border-[#111] outline-none font-mono uppercase font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ORDER BREAKDOWN */}
              <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 text-xs space-y-1.5 mt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>পণ্যের সংখ্যা ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} টি)</span>
                  <span>{settings.currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>কুপন ছাড় ({appliedCoupon?.code})</span>
                    <span>-{settings.currencySymbol}{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>ডেলিভারি চার্জ ({city})</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `${settings.currencySymbol}${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1.5 border-t border-neutral-200">
                  <span>মোট প্রদেয় টাকা (Payable)</span>
                  <span className="text-base text-[#111111]">{settings.currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেসিং হচ্ছে...</span>
                ) : (
                  <span>অর্ডার কনফার্ম করুন ({settings.currencySymbol}{grandTotal.toLocaleString()})</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 mb-2">অর্ডার সফল হয়েছে!</h2>
            <p className="text-neutral-600 text-sm max-w-sm mx-auto mb-6">
              <span className="font-bold">{settings.storeName} {settings.logoHighlight}</span>-এ কেনাকাটা করার জন্য ধন্যবাদ। আপনার অর্ডারটি গৃহীত হয়েছে।
            </p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 max-w-sm mx-auto text-left text-xs space-y-2 mb-6 shadow-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">অর্ডার নম্বর:</span>
                <span className="font-mono font-bold text-neutral-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">গ্রাহকের নাম:</span>
                <span className="font-medium text-neutral-900">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">মোবাইল:</span>
                <span className="font-medium text-neutral-900 font-mono">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ঠিকানা:</span>
                <span className="font-medium text-neutral-900 truncate max-w-[180px]">{address}, {city}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-neutral-900 uppercase">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}
                </span>
              </div>
              {transactionId && (
                <div className="flex justify-between items-center bg-white p-1.5 rounded border border-neutral-200 font-mono">
                  <span className="text-neutral-500 text-[11px]">TrxID:</span>
                  <span className="font-bold text-emerald-700">{transactionId}</span>
                </div>
              )}
              {paymentMethod !== 'cod' && (
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>পেমেন্ট স্ট্যাটাস:</span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    যাচাই অপেক্ষমান (Verifying)
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-neutral-200 pt-1.5 text-neutral-900">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="text-sm">{settings.currencySymbol}{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* WHATSAPP CONFIRMATION ACTIONS */}
            {completedOrder && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">হোয়াটসঅ্যাপে অর্ডার কনফার্মেশন পাঠানো হয়েছে</h4>
                    <p className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                      অর্ডারের যাবতীয় তথ্যসহ <span className="font-bold font-mono text-emerald-900">{targetWhatsApp}</span> হোয়াটসঅ্যাপে মেসেজ তৈরি হয়েছে।
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(targetWhatsApp)}?text=${encodeURIComponent(buildWhatsAppConfirmationMessage(completedOrder, settings))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>হোয়াটসঅ্যাপ মেসেজ দেখুন বা পাঠান ({targetWhatsApp})</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const text = buildWhatsAppConfirmationMessage(completedOrder, settings);
                      navigator.clipboard.writeText(text);
                      setCopiedWaMessage(true);
                      setTimeout(() => setCopiedWaMessage(false), 2500);
                    }}
                    className="w-full py-2 px-3 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedWaMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">অর্ডার মেসেজ কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>কনফার্মেশন মেসেজ টেক্সট কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              আরও কেনাকাটা করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
