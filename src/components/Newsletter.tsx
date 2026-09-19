import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

interface NewsletterProps {
  onSubscribed: (email: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onSubscribed }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitted(true);
    onSubscribed(email);
  };

  return (
    <section id="newsletter" className="text-center py-16 md:py-[70px] px-[7%] bg-white border-t border-b border-neutral-100">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-neutral-900 mb-2.5">
          Join Our Newsletter
        </h2>

        <p className="text-[#777777] text-base mb-[25px]">
          Subscribe and get updates about new products and special offers.
        </p>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-lg max-w-md mx-auto flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-left text-sm">
              <p className="font-bold">Thank you for subscribing!</p>
              <p className="text-emerald-700">We've sent a 10% discount welcome coupon to {email}.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto">
            <div className="w-full sm:w-[350px] relative">
              <input
                id="newsletter-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email"
                className="w-full p-[14px] border border-[#dddddd] text-neutral-900 placeholder:text-neutral-400 text-sm outline-none focus:border-[#111111] transition-colors rounded-none"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              id="newsletter-subscribe-button"
              type="submit"
              className="w-full sm:w-auto px-[25px] py-[14px] bg-[#111111] hover:bg-[#e8b04b] hover:text-[#111111] text-white font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
        )}
      </div>
    </section>
  );
};
