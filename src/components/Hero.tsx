import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Sliders, 
  Edit3, 
  Sparkles,
  Layers
} from 'lucide-react';
import { SiteSettings, HeroBanner, CategoryItem } from '../types';
import { BannerModal } from './BannerModal';

interface HeroProps {
  onShopClick: (category?: string) => void;
  settings: SiteSettings;
  banners: HeroBanner[];
  onAddBanner: (banner: HeroBanner) => void;
  onUpdateBanner: (banner: HeroBanner) => void;
  onDeleteBanner: (bannerId: string) => void;
  categories?: CategoryItem[];
}

export const Hero: React.FC<HeroProps> = ({ 
  onShopClick, 
  settings,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  categories = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safety fallback if no banners exist
  const effectiveBanners: HeroBanner[] = banners && banners.length > 0 ? banners : [
    {
      id: 'default-fallback',
      tag: settings.heroTag || 'NEW COLLECTION 2026',
      title: settings.heroTitle || 'Define Your',
      highlight: settings.heroHighlight || 'Style',
      description: settings.heroDescription || 'Discover the latest fashion trends with SR Fashion.',
      bgImage: settings.heroBgImage || 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
      buttonText: settings.heroButtonText || 'SHOP NOW',
      categoryFilter: 'All',
      isActive: true,
    }
  ];

  // Keep current slide within bounds if banners change
  useEffect(() => {
    if (currentSlide >= effectiveBanners.length) {
      setCurrentSlide(0);
    }
  }, [effectiveBanners.length, currentSlide]);

  // Auto slide rotation every 6 seconds when not hovered and modal is closed
  useEffect(() => {
    if (isHovered || isModalOpen || effectiveBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % effectiveBanners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isHovered, isModalOpen, effectiveBanners.length]);

  const activeBanner = effectiveBanners[currentSlide] || effectiveBanners[0];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? effectiveBanners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % effectiveBanners.length);
  };

  const handleBannerAdded = (newBanner: HeroBanner) => {
    onAddBanner(newBanner);
    // Switch to the newly added banner
    setCurrentSlide(effectiveBanners.length);
  };

  return (
    <>
      <section
        id="hero-banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative min-h-[520px] md:min-h-[600px] flex items-center px-[6%] sm:px-[7%] py-16 md:py-24 text-white bg-cover bg-center overflow-hidden transition-all duration-700 select-none group"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.50)), url("${activeBanner.bgImage}")`,
        }}
      >
        {/* BANNER CONTENT CONTAINER */}
        <div className="max-w-[660px] z-10 animate-fadeIn">
          {/* TAGLINE */}
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e8b04b]" />
            <p className="text-xs sm:text-sm text-[#e8b04b] font-bold tracking-widest uppercase">
              {activeBanner.tag}
            </p>
          </div>

          {/* HEADLINE */}
          <h1 className="text-3xl sm:text-5xl md:text-[62px] font-extrabold leading-[1.1] mb-5 tracking-tight drop-shadow-md">
            {activeBanner.title}{' '}
            <span className="text-[#e8b04b] drop-shadow-sm">{activeBanner.highlight}</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-200 leading-[1.7] mb-8 max-w-[560px] drop-shadow-sm">
            {activeBanner.description}
          </p>

          {/* ACTION BUTTON */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-shop-button"
              onClick={() => onShopClick(activeBanner.categoryFilter || 'All')}
              className="inline-flex items-center gap-2.5 bg-[#e8b04b] hover:bg-white text-[#111111] font-extrabold px-8 py-3.5 rounded-lg text-sm sm:text-base transition-all duration-300 shadow-xl cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{activeBanner.buttonText || 'SHOP NOW'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROMINENT USER BANNER CUSTOMIZATION OPTIONS ON THE BANNER */}
        {/* ========================================================= */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex flex-wrap items-center gap-2">
          {/* ADD NEW BANNER BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            id="add-banner-hero-button"
            className="inline-flex items-center gap-2 bg-[#111111]/90 hover:bg-[#e8b04b] text-white hover:text-[#111111] backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 shadow-xl border border-white/20 hover:border-[#e8b04b] cursor-pointer group"
            title="নিজের মতো নতুন ব্যানার এড করুন"
          >
            <PlusCircle className="w-4 h-4 text-[#e8b04b] group-hover:text-[#111111] transition-colors" />
            <span className="hidden xs:inline sm:inline">নিজের মতো ব্যানার এড করুন</span>
            <span className="inline xs:hidden sm:hidden">ব্যানার এড</span>
          </button>

          {/* MANAGE / EDIT CURRENT BANNER BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            id="manage-banners-button"
            className="inline-flex items-center gap-1.5 bg-black/60 hover:bg-black/85 text-white backdrop-blur-md px-3 py-2 sm:py-2.5 rounded-full text-xs font-semibold transition-colors border border-white/15 cursor-pointer"
            title="ব্যানারসমূহ পরিবর্তন ও ম্যানেজ করুন"
          >
            <Sliders className="w-3.5 h-3.5 text-[#e8b04b]" />
            <span className="hidden sm:inline">ব্যানার ম্যানেজ</span>
            <span className="bg-[#e8b04b] text-[#111] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {effectiveBanners.length}
            </span>
          </button>
        </div>

        {/* LEFT / RIGHT CAROUSEL ARROWS */}
        {effectiveBanners.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/50 opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextSlide}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/50 opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* SLIDE INDICATORS (DOTS) */}
            <div className="absolute bottom-5 sm:bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
              {effectiveBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === index
                      ? 'w-7 sm:w-8 h-2 bg-[#e8b04b]'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* BANNER CUSTOMIZATION & ADD MODAL */}
      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banners={effectiveBanners}
        onAddBanner={handleBannerAdded}
        onUpdateBanner={onUpdateBanner}
        onDeleteBanner={onDeleteBanner}
        categories={categories}
        activeBannerIndex={currentSlide}
        onSelectBannerSlide={(idx) => setCurrentSlide(idx)}
      />
    </>
  );
};
