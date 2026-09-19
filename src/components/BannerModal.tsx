import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Trash2, 
  Eye, 
  Edit3, 
  Plus, 
  Layers, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { HeroBanner, CategoryItem } from '../types';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banners: HeroBanner[];
  onAddBanner: (banner: HeroBanner) => void;
  onUpdateBanner: (banner: HeroBanner) => void;
  onDeleteBanner: (bannerId: string) => void;
  categories?: CategoryItem[];
  activeBannerIndex?: number;
  onSelectBannerSlide?: (index: number) => void;
}

const FASHION_PRESETS = [
  {
    name: 'Boutique Luxury',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Urban Streetwear',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Modern Aesthetics',
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Chic Lifestyle',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Studio Minimal',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Casual Fits',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
  },
];

export const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  onClose,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  categories = [],
  activeBannerIndex = 0,
  onSelectBannerSlide,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [tag, setTag] = useState('NEW ARRIVAL 2026');
  const [title, setTitle] = useState('Exclusive Summer');
  const [highlight, setHighlight] = useState('Collection');
  const [description, setDescription] = useState(
    'Explore our freshest modern apparel crafted for unmatched comfort, timeless elegance, and everyday style.'
  );
  const [bgImage, setBgImage] = useState(
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80'
  );
  const [buttonText, setButtonText] = useState('SHOP NOW');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    // Limit check (~5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('ছবির সাইজ ৫ মেগাবাইট (5MB)-এর কম হতে হবে।');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setBgImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (banner: HeroBanner) => {
    setEditingBannerId(banner.id);
    setTag(banner.tag);
    setTitle(banner.title);
    setHighlight(banner.highlight);
    setDescription(banner.description);
    setBgImage(banner.bgImage);
    setButtonText(banner.buttonText);
    setCategoryFilter(banner.categoryFilter || 'All');
    setActiveTab('add');
  };

  const handleResetForm = () => {
    setEditingBannerId(null);
    setTag('NEW COLLECTION 2026');
    setTitle('Premium Fashion');
    setHighlight('Edition');
    setDescription('Discover the best styles tailored for your confidence with SR Fashion.');
    setBgImage(FASHION_PRESETS[0].url);
    setButtonText('SHOP NOW');
    setCategoryFilter('All');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bgImage.trim()) {
      setErrorMessage('একটি ব্যানার ব্যাকগ্রাউন্ড ছবি দেওয়া আবশ্যক।');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('ব্যানারের মূল শিরোনাম লিখুন।');
      return;
    }

    setErrorMessage('');

    if (editingBannerId) {
      // Update existing banner
      const updatedBanner: HeroBanner = {
        id: editingBannerId,
        tag: tag.trim(),
        title: title.trim(),
        highlight: highlight.trim(),
        description: description.trim(),
        bgImage: bgImage.trim(),
        buttonText: buttonText.trim() || 'SHOP NOW',
        categoryFilter,
        isActive: true,
      };
      onUpdateBanner(updatedBanner);
      setSuccessToast('ব্যানার সফলভাবে আপডেট করা হয়েছে!');
      setEditingBannerId(null);
    } else {
      // Add new banner
      const newBanner: HeroBanner = {
        id: `banner-${Date.now()}`,
        tag: tag.trim() || 'NEW COLLECTION',
        title: title.trim(),
        highlight: highlight.trim(),
        description: description.trim(),
        bgImage: bgImage.trim(),
        buttonText: buttonText.trim() || 'SHOP NOW',
        categoryFilter,
        isActive: true,
      };
      onAddBanner(newBanner);
      setSuccessToast('নতুন ব্যানার সফলভাবে তৈরি এবং যুক্ত করা হয়েছে!');
      handleResetForm();
    }

    setTimeout(() => {
      setSuccessToast('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* MODAL DIALOG */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden border border-neutral-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8b04b] text-[#111] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">
                ব্যানার কাস্টমাইজার ও নতুন ব্যানার যুক্তকরণ
              </h2>
              <p className="text-[11px] text-neutral-300">
                নিজের মতো করে নতুন ব্যানার এড করুন অথবা বিদ্যমান ব্যানার পরিবর্তন করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP TABS & STATS */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('add');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'border-[#e8b04b] text-[#111] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#e8b04b]" />
            <span>{editingBannerId ? 'ব্যানার এডিট করুন' : '+ নতুন ব্যানার যোগ করুন'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-[#e8b04b] text-[#111] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#e8b04b]" />
            <span>সকল ব্যানার তালিকা ({banners.length}টি)</span>
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: ADD / EDIT BANNER */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {editingBannerId && (
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  <span>আপনি একটি বিদ্যমান ব্যানার এডিট করছেন।</span>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs font-bold underline hover:text-amber-950"
                  >
                    নতুন তৈরিতে ফিরে যান
                  </button>
                </div>
              )}

              {/* LIVE PREVIEW CARD */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#e8b04b]" />
                  <span>লাইভ ব্যানার প্রিভিউ (Live Preview)</span>
                </label>
                <div
                  className="relative rounded-xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center p-6 text-white bg-cover bg-center border border-neutral-300 shadow-inner"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)), url("${bgImage}")`,
                  }}
                >
                  <div className="max-w-[480px] z-10">
                    <p className="text-xs text-[#e8b04b] font-bold tracking-widest uppercase mb-1.5 drop-shadow-sm">
                      {tag || 'TAGLINE HERE'}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-2 drop-shadow-md">
                      {title || 'Banner Title'}{' '}
                      <span className="text-[#e8b04b]">{highlight || 'Highlight'}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 mb-4 drop-shadow-sm">
                      {description || 'Banner short promotional description will be displayed right here.'}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-[#e8b04b] text-[#111] font-bold text-xs px-4 py-2 rounded shadow-md">
                      <span>{buttonText || 'SHOP NOW'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE SELECTION & UPLOAD */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#e8b04b]" />
                    <span>১. ব্যানারের ব্যাকগ্রাউন্ড ছবি নির্বাচন করুন</span>
                  </label>
                  <span className="text-[11px] text-neutral-500">কম্পিউটার/মোবাইল থেকে সরাসরি ছবি দিন</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* UPLOAD BUTTON */}
                  <div className="flex flex-col justify-center items-center border-2 border-dashed border-neutral-300 hover:border-[#111] rounded-xl p-4 bg-white transition-colors cursor-pointer text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white px-4 py-1.5 rounded-lg transition-colors cursor-pointer mb-1"
                    >
                      ডিভাইস থেকে ছবি আপলোড করুন
                    </button>
                    <span className="text-[10px] text-neutral-400">JPG, PNG, WEBP (সর্বোচ্চ 5MB)</span>
                  </div>

                  {/* URL INPUT */}
                  <div className="flex flex-col justify-center bg-white border border-neutral-200 rounded-xl p-3.5">
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                      অথবা অনলাইন ছবির লিঙ্ক (Image URL):
                    </label>
                    <input
                      type="url"
                      value={bgImage}
                      onChange={(e) => setBgImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                    />
                  </div>
                </div>

                {/* PRESETS SELECTION */}
                <div>
                  <p className="text-[11px] font-bold text-neutral-600 mb-2">
                    অথবা রেডিমেড ফ্যাশন ব্যাকগ্রাউন্ড থেকে ক্লিক করুন:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {FASHION_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBgImage(preset.url)}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-4/3 group cursor-pointer transition-all ${
                          bgImage === preset.url
                            ? 'border-[#e8b04b] ring-2 ring-[#e8b04b]/30 scale-95'
                            : 'border-transparent hover:border-neutral-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white font-medium px-1 py-0.5 truncate text-center">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TEXT FIELDS */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-[#e8b04b]" />
                  <span>২. ব্যানারের টেক্সট ও তথ্যসমূহ</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      ট্যাগলাইন (Top Tag)
                    </label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="যেমন: NEW ARRIVAL 2026"
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="যেমন: Define Your"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      হাইলাইট লেখা (Golden Color)
                    </label>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => setHighlight(e.target.value)}
                      placeholder="যেমন: Style"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      ছোট বিবরণ (Description)
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="ব্যানারের সুন্দর একটি বর্ণনা লিখুন..."
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        বাটন টেক্সট (Button Text)
                      </label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="যেমন: SHOP NOW"
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        বাটনে ক্লিক করলে কোথায় যাবে
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none bg-white"
                      >
                        <option value="All">সব পণ্য (Shop All)</option>
                        <option value="Men's Fashion">Men's Fashion</option>
                        <option value="Women's Fashion">Women's Fashion</option>
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Pants">Pants</option>
                        <option value="Sale Deals">Sale Deals (অফার কালেকশন)</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBannerId ? 'ব্যানার আপডেট করুন' : 'ব্যানার সেভ ও প্রদর্শন করুন'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MANAGE ALL BANNERS */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  বর্তমানে মোট {banners.length}টি ব্যানার হিরো স্লাইডারে সক্রিয় আছে।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('add');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#111] text-white hover:bg-[#e8b04b] hover:text-[#111] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ব্যানার তৈরি</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-xl p-3.5 flex flex-col justify-between shadow-xs transition-all ${
                      activeBannerIndex === idx
                        ? 'border-[#e8b04b] ring-2 ring-[#e8b04b]/20 bg-amber-50/20'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="relative rounded-lg overflow-hidden aspect-16/8 mb-3 bg-neutral-900">
                        <img
                          src={item.bgImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white px-2 py-0.5 rounded">
                          স্লাইড #{idx + 1}
                        </div>
                        {activeBannerIndex === idx && (
                          <div className="absolute top-2 right-2 bg-[#e8b04b] text-[#111] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            বর্তমান স্লাইড
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] font-bold text-[#e8b04b] uppercase tracking-wider mb-0.5">
                        {item.tag}
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 mb-1">
                        {item.title} <span className="text-[#e8b04b]">{item.highlight}</span>
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      {onSelectBannerSlide && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBannerSlide(idx);
                            onClose();
                          }}
                          className="text-[11px] text-neutral-700 hover:text-[#111] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#e8b04b]" />
                          <span>হোমে প্রদর্শন করুন</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>এডিট</span>
                        </button>

                        {banners.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`আপনি কি নিশ্চিত যে "${item.title}" ব্যানারটি মুছে ফেলতে চান?`)) {
                                onDeleteBanner(item.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1 font-semibold"
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
          )}
        </div>
      </div>
    </div>
  );
};
