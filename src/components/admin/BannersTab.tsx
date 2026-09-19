import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Layers, 
  Eye, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { SiteSettings, HeroBanner, CategoryItem } from '../../types';

interface BannersTabProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => void;
  banners: HeroBanner[];
  onAddBanner: (banner: HeroBanner) => void;
  onUpdateBanner: (banner: HeroBanner) => void;
  onDeleteBanner: (bannerId: string) => void;
  categories?: CategoryItem[];
}

const HERO_BACKGROUND_PRESETS = [
  { label: 'Boutique Luxury', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Urban Streetwear', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Modern Aesthetic', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Autumn Chic', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Minimal Studio', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Casual Fits', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80' },
];

export const BannersTab: React.FC<BannersTabProps> = ({
  settings,
  onUpdateSettings,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  categories = [],
}) => {
  // Offer settings form state
  const [offerData, setOfferData] = useState({
    offerTag: settings.offerTag,
    offerTitle: settings.offerTitle,
    offerHighlight: settings.offerHighlight,
    offerDescription: settings.offerDescription,
    offerButtonText: settings.offerButtonText,
  });

  const [savedSuccess, setSavedSuccess] = useState('');

  // Add/Edit Banner inline state
  const [showAddBannerForm, setShowAddBannerForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [bannerTag, setBannerTag] = useState('NEW ARRIVAL 2026');
  const [bannerTitle, setBannerTitle] = useState('Modern Elegance');
  const [bannerHighlight, setBannerHighlight] = useState('Collection');
  const [bannerDesc, setBannerDesc] = useState('Experience unmatched comfort, premium fabrics, and royal aesthetics.');
  const [bannerBg, setBannerBg] = useState(HERO_BACKGROUND_PRESETS[0].url);
  const [bannerBtnText, setBannerBtnText] = useState('SHOP NOW');
  const [bannerCategory, setBannerCategory] = useState('All');
  const [bannerError, setBannerError] = useState('');
  const [bannerToDelete, setBannerToDelete] = useState<HeroBanner | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setBannerError('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setBannerError('ছবির সাইজ ৫MB এর কম হতে হবে।');
      return;
    }

    setBannerError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setBannerBg(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditBanner = (b: HeroBanner) => {
    setEditingBannerId(b.id);
    setBannerTag(b.tag);
    setBannerTitle(b.title);
    setBannerHighlight(b.highlight);
    setBannerDesc(b.description);
    setBannerBg(b.bgImage);
    setBannerBtnText(b.buttonText);
    setBannerCategory(b.categoryFilter || 'All');
    setShowAddBannerForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleResetBannerForm = () => {
    setEditingBannerId(null);
    setBannerTag('NEW ARRIVAL 2026');
    setBannerTitle('Modern Elegance');
    setBannerHighlight('Collection');
    setBannerDesc('Experience unmatched comfort, premium fabrics, and royal aesthetics.');
    setBannerBg(HERO_BACKGROUND_PRESETS[0].url);
    setBannerBtnText('SHOP NOW');
    setBannerCategory('All');
    setBannerError('');
    setShowAddBannerForm(false);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerBg.trim()) {
      setBannerError('একটি ছবির লিঙ্ক বা আপলোড প্রয়োজন।');
      return;
    }
    if (!bannerTitle.trim()) {
      setBannerError('ব্যানারের মূল শিরোনাম লিখুন।');
      return;
    }

    setBannerError('');

    if (editingBannerId) {
      onUpdateBanner({
        id: editingBannerId,
        tag: bannerTag.trim(),
        title: bannerTitle.trim(),
        highlight: bannerHighlight.trim(),
        description: bannerDesc.trim(),
        bgImage: bannerBg.trim(),
        buttonText: bannerBtnText.trim() || 'SHOP NOW',
        categoryFilter: bannerCategory,
        isActive: true,
      });
      setSavedSuccess('ব্যানার সফলভাবে আপডেট করা হয়েছে!');
    } else {
      const newBanner: HeroBanner = {
        id: `banner-${Date.now()}`,
        tag: bannerTag.trim() || 'NEW COLLECTION',
        title: bannerTitle.trim(),
        highlight: bannerHighlight.trim(),
        description: bannerDesc.trim(),
        bgImage: bannerBg.trim(),
        buttonText: bannerBtnText.trim() || 'SHOP NOW',
        categoryFilter: bannerCategory,
        isActive: true,
      };
      onAddBanner(newBanner);
      setSavedSuccess('নতুন ব্যানার সফলভাবে তালিকায় যুক্ত করা হয়েছে!');
    }

    handleResetBannerForm();
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(offerData);
    setSavedSuccess('স্পেশাল অফার ব্যানার সেটিংস সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  return (
    <div className="space-y-8">
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 1: HERO SLIDER BANNERS MANAGEMENT */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#e8b04b]" />
              <span>১. মূল হিরো ব্যানারসমূহ (Hero Carousel Banners)</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              হোমপেজের শীর্ষ ব্যানার স্লাইডার। আপনি নিজের ইচ্ছামতো যেকোনো ছবি ও লেখা দিয়ে ব্যানার তৈরি করতে পারেন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showAddBannerForm && !editingBannerId) {
                setShowAddBannerForm(false);
              } else {
                handleResetBannerForm();
                setShowAddBannerForm(true);
              }
            }}
            className="inline-flex items-center gap-2 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddBannerForm ? 'ফর্ম বন্ধ করুন' : '+ নিজের মতো নতুন ব্যানার যোগ করুন'}</span>
          </button>
        </div>

        {/* ADD / EDIT BANNER FORM (EXPANDABLE) */}
        {showAddBannerForm && (
          <form onSubmit={handleSaveBanner} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-300 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e8b04b]" />
                <span>{editingBannerId ? 'ব্যানার এডিট করুন' : 'নতুন ব্যানার তৈরি ও যুক্ত করুন'}</span>
              </h4>
              <button
                type="button"
                onClick={handleResetBannerForm}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
              >
                বাতিল করুন
              </button>
            </div>

            {bannerError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{bannerError}</span>
              </div>
            )}

            {/* LIVE PREVIEW BOX */}
            <div>
              <span className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#e8b04b]" />
                <span>লাইভ প্রিভিউ (Live Preview)</span>
              </span>
              <div
                className="relative rounded-xl overflow-hidden min-h-[200px] flex items-center p-6 text-white bg-cover bg-center border border-neutral-300 shadow-inner"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)), url("${bannerBg}")`,
                }}
              >
                <div className="max-w-[460px] z-10">
                  <p className="text-[11px] text-[#e8b04b] font-bold tracking-widest uppercase mb-1 drop-shadow-sm">
                    {bannerTag || 'TAGLINE'}
                  </p>
                  <h4 className="text-2xl font-bold leading-tight mb-2 drop-shadow-md">
                    {bannerTitle || 'Main Title'}{' '}
                    <span className="text-[#e8b04b]">{bannerHighlight || 'Highlight'}</span>
                  </h4>
                  <p className="text-xs text-neutral-200 line-clamp-2 mb-3 drop-shadow-sm">
                    {bannerDesc || 'Banner short description will appear right here.'}
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-[#e8b04b] text-[#111] font-bold text-xs px-3.5 py-1.5 rounded shadow">
                    <span>{bannerBtnText || 'SHOP NOW'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE CONTROLS */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-neutral-200">
              <label className="block text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#e8b04b]" />
                <span>১. ব্যানার ব্যাকগ্রাউন্ড ছবি</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-neutral-400 mb-1.5" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    ডিভাইস থেকে ছবি আপলোড করুন
                  </button>
                  <span className="text-[10px] text-neutral-400 mt-1">সর্বোচ্চ ৫MB (JPG, PNG, WEBP)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    অথবা অনলাইন ইমেজ লিংক (URL):
                  </label>
                  <input
                    type="url"
                    value={bannerBg}
                    onChange={(e) => setBannerBg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                  />
                </div>
              </div>

              {/* PRESETS */}
              <div>
                <span className="text-[11px] font-bold text-neutral-500 block mb-1.5">বা তৈরি করা ডিজাইন থেকে বেছে নিন:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {HERO_BACKGROUND_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBannerBg(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 aspect-16/9 cursor-pointer transition-all ${
                        bannerBg === preset.url
                          ? 'border-[#e8b04b] ring-2 ring-[#e8b04b]/30'
                          : 'border-transparent hover:border-neutral-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TEXT FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  ট্যাগলাইন (Top Tag)
                </label>
                <input
                  type="text"
                  value={bannerTag}
                  onChange={(e) => setBannerTag(e.target.value)}
                  placeholder="যেমন: EID SPECIAL 2026"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  মূল শিরোনাম (Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="যেমন: Exclusive Summer"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  হাইলাইট লেখা (Golden Color)
                </label>
                <input
                  type="text"
                  value={bannerHighlight}
                  onChange={(e) => setBannerHighlight(e.target.value)}
                  placeholder="যেমন: Collection"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  বর্ণনা (Description)
                </label>
                <textarea
                  rows={2}
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  placeholder="ব্যানারের সংক্ষিপ্ত বিবরণ লিখুন..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    বাটন টেক্সট
                  </label>
                  <input
                    type="text"
                    value={bannerBtnText}
                    onChange={(e) => setBannerBtnText(e.target.value)}
                    placeholder="যেমন: SHOP NOW"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    বাটন ক্লিক ক্যাটাগরি
                  </label>
                  <select
                    value={bannerCategory}
                    onChange={(e) => setBannerCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none bg-white"
                  >
                    <option value="All">সকল পণ্য (Shop All)</option>
                    <option value="Men's Fashion">Men's Fashion</option>
                    <option value="Women's Fashion">Women's Fashion</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Pants">Pants</option>
                    <option value="Sale Deals">Sale Deals (অফার)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleResetBannerForm}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {editingBannerId ? 'ব্যানার আপডেট করুন' : 'ব্যানার সেভ ও যুক্ত করুন'}
              </button>
            </div>
          </form>
        )}

        {/* EXISTING BANNERS GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 uppercase">
              বর্তমান সক্রিয় ব্যানারসমূহ ({banners.length}টি)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-neutral-900 overflow-hidden">
                    <img
                      src={item.bgImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white px-2 py-0.5 rounded">
                      স্লাইড #{idx + 1}
                    </div>
                  </div>

                  <div className="p-3.5">
                    <span className="text-[10px] font-bold text-[#e8b04b] uppercase block">
                      {item.tag}
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900">
                      {item.title} <span className="text-[#e8b04b]">{item.highlight}</span>
                    </h5>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex items-center justify-between border-t border-neutral-100 mt-2">
                  <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                    বাটন: {item.buttonText}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditBanner(item)}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                      title="এডিট করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>

                    {banners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBannerToDelete(item)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছুন</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: SPECIAL OFFER BANNER (COUNTDOWN / FLASH SALE) */}
      {/* ========================================================= */}
      <form onSubmit={handleSaveOffer} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e8b04b]" />
            <span>২. স্পেশাল অফার ব্যানার (Flash Sale Section)</span>
          </h3>
          <p className="text-xs text-neutral-500">
            কাউন্টডাউন সহ ডিসকাউন্ট ও সেল অফার সেকশনের টেক্সট পরিবর্তন করুন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              অফার ব্যাজ ট্যাগ
            </label>
            <input
              type="text"
              value={offerData.offerTag}
              onChange={(e) => setOfferData({ ...offerData, offerTag: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              হেডলাইন প্রিফিক্স
            </label>
            <input
              type="text"
              value={offerData.offerTitle}
              onChange={(e) => setOfferData({ ...offerData, offerTitle: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              ডিসকাউন্ট টেক্সট (যেমন 50% OFF)
            </label>
            <input
              type="text"
              value={offerData.offerHighlight}
              onChange={(e) => setOfferData({ ...offerData, offerHighlight: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              অফার বিবরণ
            </label>
            <textarea
              rows={2}
              value={offerData.offerDescription}
              onChange={(e) => setOfferData({ ...offerData, offerDescription: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              বাটন টেক্সট
            </label>
            <input
              type="text"
              value={offerData.offerButtonText}
              onChange={(e) => setOfferData({ ...offerData, offerButtonText: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>অফার ব্যানার সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
      {/* BANNER DELETE CONFIRMATION MODAL */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => setBannerToDelete(null)} 
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 text-center mb-1">
              ব্যানার মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-neutral-500 text-center mb-4">
              আপনি কি নিশ্চিত যে &ldquo;{bannerToDelete.title}&rdquo; ব্যানারটি মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBanner(bannerToDelete.id);
                  setBannerToDelete(null);
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
