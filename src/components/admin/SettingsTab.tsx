import React, { useState } from 'react';
import { 
  Check, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Store, 
  Phone, 
  Bell, 
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { SiteSettings, Product, Order, CategoryItem, Coupon } from '../../types';

interface SettingsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => void;
  adminPin: string;
  onUpdateAdminPin: (pin: string) => void;
  products: Product[];
  orders: Order[];
  categories: CategoryItem[];
  coupons: Coupon[];
  onRestoreAllData: (data: {
    products: Product[];
    orders: Order[];
    categories: CategoryItem[];
    settings: SiteSettings;
    coupons: Coupon[];
  }) => void;
  onResetToDefaults: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  adminPin,
  onUpdateAdminPin,
  products,
  orders,
  categories,
  coupons,
  onRestoreAllData,
  onResetToDefaults,
}) => {
  const [formData, setFormData] = useState({
    storeName: settings.storeName,
    logoHighlight: settings.logoHighlight,
    announcementText: settings.announcementText,
    announcementEnabled: settings.announcementEnabled,
    contactPhone: settings.contactPhone,
    contactEmail: settings.contactEmail,
    contactAddress: settings.contactAddress,
    currencySymbol: settings.currencySymbol,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    bkashNumber: settings.bkashNumber || '01804459691',
    nagadNumber: settings.nagadNumber || '01804459691',
    whatsappNumber: settings.whatsappNumber || '01352113432',
  });

  const [pinInput, setPinInput] = useState(adminPin);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...formData,
      freeDeliveryThreshold: Number(formData.freeDeliveryThreshold),
    });
    if (pinInput.trim()) {
      onUpdateAdminPin(pinInput.trim());
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      store: `${settings.storeName} ${settings.logoHighlight}`,
      settings,
      products,
      categories,
      orders,
      coupons,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srfashion-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && parsed.settings) {
          onRestoreAllData({
            products: parsed.products,
            orders: parsed.orders || [],
            categories: parsed.categories || categories,
            settings: parsed.settings,
            coupons: parsed.coupons || coupons,
          });
          alert('ব্যাকআপ ডেটা সফলভাবে রিস্টোর করা হয়েছে!');
        } else {
          setImportError('ব্যাকআপ ফাইলের ফরম্যাট সঠিক নয়।');
        }
      } catch (err) {
        setImportError('ফাইল পড়তে ব্যর্থ হয়েছে। সঠিক JSON ফাইল প্রদান করুন।');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* BRANDING & TOP BAR */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-neutral-600" />
            <h3 className="text-sm font-bold text-neutral-900">ব্র্যান্ডিং ও ডিসপ্লে তথ্য</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                স্টোর ব্র্যান্ড নাম
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                লোগো হাইলাইট শব্দ
              </label>
              <input
                type="text"
                required
                value={formData.logoHighlight}
                onChange={(e) => setFormData({ ...formData, logoHighlight: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                কারেন্সি সিম্বল
              </label>
              <input
                type="text"
                required
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-bold"
              />
            </div>
          </div>

          {/* ANNOUNCEMENT BAR */}
          <div className="pt-2 border-t border-neutral-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                <input
                  type="checkbox"
                  checked={formData.announcementEnabled}
                  onChange={(e) => setFormData({ ...formData, announcementEnabled: e.target.checked })}
                  className="rounded border-neutral-300 text-[#111] focus:ring-[#e8b04b] w-4 h-4"
                />
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>টপ নোটিশ বার সক্রিয় রাখুন (Top Announcement Bar)</span>
              </label>
            </div>

            <div>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                placeholder="যেমন: 🔥 ফ্রি ডেলিভারি সারা বাংলাদেশে ২০০০ টাকার অর্ডারে!"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
              />
            </div>
          </div>
        </div>

        {/* CONTACT & SUPPORT DETAILS */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-neutral-600" />
            <h3 className="text-sm font-bold text-neutral-900">যোগাযোগ ও সাপোর্ট তথ্য</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                হটলাইন ফোন নম্বর
              </label>
              <input
                type="text"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                ইমেইল এড্রেস
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                ফ্রি ডেলিভারি মিনিমাম অর্ডার ({formData.currencySymbol})
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              অফিস বা শোরুম ঠিকানা
            </label>
            <input
              type="text"
              required
              value={formData.contactAddress}
              onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>
        </div>

        {/* PAYMENT & MOBILE BANKING NUMBERS */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-600" />
              <h3 className="text-sm font-bold text-neutral-900">মোবাইল ব্যাংকিং ও সরাসরি পেমেন্ট নম্বর</h3>
            </div>
            <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded font-medium">
              চেকআউটে প্রদর্শিত হবে
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-pink-50/50 border border-pink-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#e2136e] uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e2136e]" />
                  বিকাশ (bKash) পেমেন্ট নম্বর
                </label>
                <span className="text-[10px] font-semibold text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  Send Money (Personal)
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.bkashNumber}
                onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-[#e2136e] outline-none font-mono font-bold text-neutral-900"
              />
              <p className="text-[11px] text-neutral-500">
                কাস্টমার বিকাশ বেছে নিলে এই নম্বরে সেন্ড মানি করার নির্দেশনা ও কপি বাটন দেখতে পাবে।
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#f7941d] uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f7941d]" />
                  নগদ (Nagad) পেমেন্ট নম্বর
                </label>
                <span className="text-[10px] font-semibold text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  Send Money (Personal)
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.nagadNumber}
                onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-[#f7941d] outline-none font-mono font-bold text-neutral-900"
              />
              <p className="text-[11px] text-neutral-500">
                কাস্টমার নগদ বেছে নিলে এই নম্বরে সেন্ড মানি করার নির্দেশনা ও কপি বাটন দেখতে পাবে।
              </p>
            </div>
          </div>

          {/* WHATSAPP ORDER NOTIFICATION */}
          <div className="mt-4 p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                অর্ডার কনফার্মেশন হোয়াটসঅ্যাপ (WhatsApp) নম্বর
              </label>
              <span className="text-[10px] font-semibold text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                Instant Notification
              </span>
            </div>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-emerald-600 outline-none font-mono font-bold text-neutral-900"
            />
            <p className="text-[11px] text-neutral-500">
              কাস্টমার কোনো অর্ডার কনফার্ম করলে তাৎক্ষণিকভাবে এই হোয়াটসঅ্যাপ নম্বরে সকল তথ্যসহ অর্ডার কনফার্মেশন পাঠানো হবে।
            </p>
          </div>
        </div>

        {/* SECURITY & ADMIN PIN */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-600" />
            <h3 className="text-sm font-bold text-neutral-900">অ্যাডমিন সিকিউরিটি ও পিন কোড</h3>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              অ্যাডমিন পাসওয়ার্ড / পিন (Admin PIN)
            </label>
            <input
              type="text"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="admin123"
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-mono"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              ডিফল্ট পিন: <strong>admin123</strong>। চাইলে নিজের পছন্দমতো পরিবর্তন করতে পারেন।
            </p>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>সকল সেটিংস সংরক্ষণ করুন (Save Settings)</span>
          </button>
        </div>
      </form>

      {/* DATA BACKUP, RESTORE & FACTORY RESET */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">ডেটা ব্যাকআপ ও রিস্টোর (Data Management)</h3>
        <p className="text-xs text-neutral-500">
          আপনার ওয়েবসাইটের পণ্য, অর্ডার ও সেটিংসের ব্যাকআপ ডাউনলোড করে নিরাপদে সংরক্ষণ করুন অথবা রিস্টোর করুন।
        </p>

        {importError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {importError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* EXPORT BACKUP */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100 font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>ব্যাকআপ ডাউনলোড করুন (JSON)</span>
          </button>

          {/* IMPORT BACKUP */}
          <label className="px-4 py-2.5 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100 font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>ব্যাকআপ রিস্টোর করুন</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          {/* RESET TO FACTORY DEFAULTS */}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'সতর্কতা: আপনি কি সমস্ত তথ্য রিসেট করে ডিফল্ট ডেমো ডেটাতে ফিরে যেতে চান?'
                )
              ) {
                onResetToDefaults();
              }
            }}
            className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ডিফল্ট ডেটায় রিসেট করুন (Reset Store)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
