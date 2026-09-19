import React, { useState } from 'react';
import { Phone, Mail, MapPin, X, ShieldCheck, Truck } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onNavClick: (sectionId: string, category?: string) => void;
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenOrderTrack?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, settings, onOpenAdmin, onOpenOrderTrack }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openCareModal = (title: string, body: string) => {
    setModalContent({ title, body });
  };

  return (
    <footer id="contact" className="bg-[#111111] text-white pt-12 md:pt-[50px] pb-5 px-[7%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-10">
        {/* BRAND COLUMN (spans 2 cols on lg) */}
        <div className="lg:col-span-2">
          <h3 className="text-xl md:text-2xl font-bold mb-[18px]">
            {settings.storeName} <span className="text-[#e8b04b]">{settings.logoHighlight}</span>
          </h3>
          <p className="text-[#aaaaaa] leading-[1.7] text-sm md:text-base max-w-sm mb-4">
            Your trusted online fashion store. Discover quality fashion at affordable prices with fast island-wide and nationwide delivery across Bangladesh.
          </p>
          <div className="text-xs text-neutral-500">
            Payment accepted via Cash on Delivery, bKash, and Nagad.
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-bold mb-[18px] text-white">Quick Links</h3>
          <div className="space-y-2.5 text-sm">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block text-[#aaaaaa] hover:text-[#e8b04b] transition-colors"
            >
              Home
            </a>
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                onNavClick('shop', 'All');
              }}
              className="block text-[#aaaaaa] hover:text-[#e8b04b] transition-colors"
            >
              Shop
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                onNavClick('categories');
              }}
              className="block text-[#aaaaaa] hover:text-[#e8b04b] transition-colors"
            >
              Categories
            </a>
            <a
              href="#offers"
              onClick={(e) => {
                e.preventDefault();
                onNavClick('offers');
              }}
              className="block text-[#aaaaaa] hover:text-[#e8b04b] transition-colors"
            >
              Offers
            </a>
            {onOpenOrderTrack && (
              <button
                onClick={onOpenOrderTrack}
                className="flex items-center gap-1.5 text-white hover:text-[#e8b04b] transition-colors pt-0.5 text-xs font-semibold cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-[#e8b04b]" />
                <span>অর্ডার ট্র্যাক করুন (ফোন দিয়ে খুঁজুন)</span>
              </button>
            )}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-[#e8b04b] hover:underline pt-1 text-xs font-semibold cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অ্যাডমিন পোর্টাল (Admin)</span>
            </button>
          </div>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h3 className="text-lg font-bold mb-[18px] text-white">Customer Care</h3>
          <div className="space-y-2.5 text-sm">
            <button
              onClick={() =>
                openCareModal(
                  'Privacy Policy',
                  'At SR Fashion, we respect your personal data. We never share your shipping address, phone number, or payment details with third parties except for trusted logistics courier partners.'
                )
              }
              className="block text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() =>
                openCareModal(
                  'Return Policy',
                  'We offer a hassle-free 7-day return and exchange policy on all unworn items with original tags intact. Simply contact support with your order number.'
                )
              }
              className="block text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
            >
              Return Policy
            </button>
            <button
              onClick={() =>
                openCareModal(
                  'Shipping Information',
                  `Standard delivery takes 2-3 business days inside Dhaka and 3-5 business days across the rest of Bangladesh. Free delivery on orders over ${settings.currencySymbol}${settings.freeDeliveryThreshold.toLocaleString()}!`
                )
              }
              className="block text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
            >
              Shipping Info
            </button>
            <button
              onClick={() =>
                openCareModal(
                  'Frequently Asked Questions',
                  'Q: What payment methods do you support?\nA: Cash on Delivery (COD), bKash, and Nagad.\n\nQ: Can I check the product before receiving it?\nA: Yes, our courier allows parcel checking in front of the delivery agent.'
                )
              }
              className="block text-left text-[#aaaaaa] hover:text-[#e8b04b] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-bold mb-[18px] text-white">Contact / যোগাযোগ</h3>
          <div className="space-y-3 text-sm text-[#aaaaaa]">
            <a 
              href={`tel:${settings.contactPhone}`}
              className="flex items-center gap-2.5 hover:text-[#e8b04b] transition-colors group"
              title="Call us directly"
            >
              <Phone className="w-4 h-4 text-[#e8b04b] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide">{settings.contactPhone}</span>
            </a>
            <a 
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-2.5 hover:text-[#e8b04b] transition-colors group break-all"
              title="Send an email"
            >
              <Mail className="w-4 h-4 text-[#e8b04b] shrink-0 group-hover:scale-110 transition-transform" />
              <span>{settings.contactEmail}</span>
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#e8b04b] shrink-0 mt-0.5" />
              <span className="leading-snug">{settings.contactAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-[#333333] pt-5 text-center text-[#888888] text-sm">
        © 2026 {settings.storeName} {settings.logoHighlight}. All Rights Reserved.
      </div>

      {/* CUSTOMER CARE MODAL */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 text-white rounded-lg max-w-md w-full p-6 relative shadow-2xl animate-scale-in">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#e8b04b] mb-3">{modalContent.title}</h3>
            <p className="text-neutral-300 text-sm whitespace-pre-line leading-relaxed mb-6">
              {modalContent.body}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="w-full py-2.5 bg-[#e8b04b] text-[#111] font-bold text-sm rounded hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
