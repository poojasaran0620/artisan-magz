import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

const MESSAGES = [
  '✨ Free Express Delivery on orders above ₹1,499',
  '🎀 Handcrafted with Love • 100% Personalised for Your Special Milestones',
  '💖 Use Code "AURA10" for Extra 10% OFF Today',
  '⚡ 48-72h Rush Dispatch Available on Custom Frames & Newspaper Cards'
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('AURA10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-wine-900 via-blush-900 to-wine-900 text-roseGold-light text-xs font-medium py-2 px-4 shadow-sm relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-1 text-[11px] text-blush-200">
          <Sparkles className="w-3.5 h-3.5 text-blush-300" />
          <span>Made in India • Sustainable Gifting</span>
        </div>

        <div className="flex-1 text-center transition-all duration-500 ease-in-out">
          <span className="inline-flex items-center gap-1.5 text-white/95">
            {MESSAGES[index]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm transition border border-white/20"
            title="Click to copy coupon code"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-green-300" />
                <span className="text-green-300">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5" />
                <span>CODE: AURA10</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
