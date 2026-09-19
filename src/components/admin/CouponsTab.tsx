import React, { useState } from 'react';
import { Plus, Trash2, Tag, Check, Copy, AlertCircle, X } from 'lucide-react';
import { Coupon, SiteSettings } from '../../types';

interface CouponsTabProps {
  coupons: Coupon[];
  settings: SiteSettings;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (couponId: string) => void;
  onDeleteCoupon: (couponId: string) => void;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({
  coupons,
  settings,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1000);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard?.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('কুপন কোড প্রদান করুন');
      return;
    }
    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      setError('এই কুপন কোডটি ইতিমধ্যে বিদ্যমান রয়েছে');
      return;
    }

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: cleanCode,
      discountPercent: Number(discountPercent),
      minOrderAmount: Number(minOrderAmount),
      isActive: true,
    };

    onAddCoupon(newCoupon);
    setIsModalOpen(false);
    setCode('');
    setDiscountPercent(10);
    setMinOrderAmount(1000);
    setError('');
  };

  return (
    <div className="space-y-5">
      {/* HEADER BAR */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">ডিসকাউন্ট কুপন ও প্রোমো কোড ({coupons.length})</h3>
          <p className="text-xs text-neutral-500">গ্রাহকরা চেকআউটে এই কুপন কোড ব্যবহার করে মূল্যছাড় পাবেন</p>
        </div>

        <button
          onClick={() => {
            setError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন যোগ করুন</span>
        </button>
      </div>

      {/* COUPONS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`p-4 rounded-xl border transition-all ${
              coupon.isActive
                ? 'bg-white border-neutral-200 shadow-xs hover:border-neutral-300'
                : 'bg-neutral-50/70 border-neutral-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono font-bold text-base text-neutral-900 flex items-center gap-1.5">
                    <span>{coupon.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="text-neutral-400 hover:text-neutral-700 p-0.5"
                      title="কপি কোড"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    সর্বনিম্ন অর্ডার: {settings.currencySymbol}{coupon.minOrderAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <span className="text-xl font-bold text-emerald-600">
                {coupon.discountPercent}% OFF
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              {/* TOGGLE ACTIVE */}
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={coupon.isActive}
                  onChange={() => onToggleCoupon(coupon.id)}
                  className="rounded border-neutral-300 text-[#111] focus:ring-[#e8b04b] w-3.5 h-3.5"
                />
                <span className={coupon.isActive ? 'text-emerald-700 font-bold' : 'text-neutral-400'}>
                  {coupon.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                </span>
              </label>

              <button
                onClick={() => setCouponToDelete(coupon)}
                className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                title="মুছে ফেলুন (Delete)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-neutral-900">নতুন ডিসকাউন্ট কুপন তৈরি</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  কুপন কোড (Promo Code) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: EID2026 বা SR20"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-mono font-bold uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  ডিসকাউন্ট শতাংশ (%) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="90"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  placeholder="10"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  সর্বনিম্ন অর্ডার পরিমাণ ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(parseFloat(e.target.value) || 0)}
                  placeholder="1000"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 border border-neutral-300 text-neutral-700 text-xs rounded-lg hover:bg-neutral-50 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111] text-white hover:bg-[#e8b04b] hover:text-[#111] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  কুপন তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* COUPON DELETE CONFIRMATION MODAL */}
      {couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => setCouponToDelete(null)} 
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 text-center mb-1">
              কুপন মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-neutral-500 text-center mb-4">
              আপনি কি নিশ্চিত যে কুপন কোড <strong>{couponToDelete.code}</strong> ({couponToDelete.discountPercent}% ছাড়) মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCouponToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCoupon(couponToDelete.id);
                  setCouponToDelete(null);
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
