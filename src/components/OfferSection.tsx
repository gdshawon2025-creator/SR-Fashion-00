import React, { useState, useEffect } from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface OfferSectionProps {
  onShopSale: () => void;
  settings: SiteSettings;
}

export const OfferSection: React.FC<OfferSectionProps> = ({ onShopSale, settings }) => {
  // Live ticking countdown for urgency & interactive immersion
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="offers"
      className="bg-[#111111] text-white py-16 md:py-[70px] px-[7%] text-center relative overflow-hidden"
    >
      {/* BACKGROUND ACCENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#e8b04b]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8b04b]/15 text-[#e8b04b] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{settings.offerTag}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold mb-4 tracking-tight leading-tight">
          {settings.offerTitle} <span className="text-[#e8b04b]">{settings.offerHighlight}</span>
        </h2>

        <p className="text-base sm:text-lg text-neutral-300 mb-6 font-normal">
          {settings.offerDescription}
        </p>

        {/* COUNTDOWN TIMER BLOCKS */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 sm:px-4 sm:py-2.5 min-w-[64px]">
            <div className="text-xl sm:text-2xl font-bold text-[#e8b04b]">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase text-neutral-400 font-medium">Hours</div>
          </div>
          <span className="text-xl font-bold text-neutral-500">:</span>
          <div className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 sm:px-4 sm:py-2.5 min-w-[64px]">
            <div className="text-xl sm:text-2xl font-bold text-[#e8b04b]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase text-neutral-400 font-medium">Mins</div>
          </div>
          <span className="text-xl font-bold text-neutral-500">:</span>
          <div className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 sm:px-4 sm:py-2.5 min-w-[64px]">
            <div className="text-xl sm:text-2xl font-bold text-[#e8b04b]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase text-neutral-400 font-medium">Secs</div>
          </div>
        </div>

        <button
          id="shop-sale-btn"
          onClick={onShopSale}
          className="inline-flex items-center gap-2 bg-[#e8b04b] hover:bg-white text-[#111111] px-8 py-3.5 font-bold rounded-[3px] text-base transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Tag className="w-4 h-4" />
          <span>{settings.offerButtonText || 'SHOP SALE'}</span>
        </button>
      </div>
    </section>
  );
};
