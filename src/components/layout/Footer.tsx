import React from 'react';
import { Heart, MessageCircle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';

interface FooterProps {
  onOpenPolicy: (policyName: string) => void;
  onNavigate: (view: string, id?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onNavigate }) => {
  return (
    <footer className="bg-[#242424] text-[#FDFCF5] pt-16 pb-24 md:pb-12 border-t border-taupe-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-8 rounded-full overflow-hidden bg-white shrink-0 p-0.5 border border-white/20">
                <img src="/artisan_logo_horizontal.png" alt="Artisan Magz Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-logo text-3xl text-[#FDFCF5] tracking-wide font-normal">
                  Artisan
                </span>
                <span className="text-[10px] tracking-[0.28em] uppercase text-roseGold font-bold ml-1">
                  magz
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-taupe-300">
              India's premier bespoke magazine gifting studio. We immortalize your sweetest dates, milestones, and love stories into glossy magazines, custom frames, and curated keepsakes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-roseGold flex items-center justify-center text-[#FDFCF5] transition"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-sage-700 hover:bg-sage flex items-center justify-center text-white transition"
                aria-label="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-taupe-400 font-mono">
              DM us on Instagram: @artisanmagz.studio
            </p>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="font-serif text-lg text-[#FDFCF5] mb-4">Keepsake Collections</h4>
            <ul className="space-y-2.5 text-xs text-taupe-300">
              <li>
                <button
                  onClick={() => onNavigate('product', 'prod-mag-01')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Custom Magazines (8 to 20 Pages)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('product', 'prod-frame-01')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Polaroid Collage & Cutout Frames
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('product', 'prod-news-01')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Personalized "Breaking News" Frame
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('product', 'prod-song-01')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Spotify Song Book & Acrylic Plaque
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hamper')}
                  className="hover:text-roseGold transition text-roseGold font-medium cursor-pointer"
                >
                  Build Your Own Hamper (Bundle) ✨
                </button>
              </li>
            </ul>
          </div>

          {/* Promises & Highlights */}
          <div>
            <h4 className="font-serif text-lg text-[#FDFCF5] mb-4">Studio Promises</h4>
            <ul className="space-y-3 text-xs text-taupe-300">
              <li className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-roseGold mt-0.5 shrink-0" />
                <span>Express pan-India delivery with bubble-cushioned transit guarantee.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                <span>Digital design proofs shared before final print execution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-roseGold mt-0.5 shrink-0" />
                <span>Handwritten calligraphy notes sealed with hot stamped wax.</span>
              </li>
            </ul>
          </div>

          {/* Policies & Help */}
          <div>
            <h4 className="font-serif text-lg text-[#FDFCF5] mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-taupe-300">
              <li>
                <button
                  onClick={() => onOpenPolicy('cancellation')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Cancellation & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Shipping & Dispatch Timelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Photo Privacy & Safety Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('faq')}
                  className="hover:text-roseGold transition cursor-pointer"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] bg-sage-800/80 hover:bg-sage text-[#FDFCF5] hover:text-charcoal px-3 py-1.5 rounded-lg transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Help: +91 98765 43210</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-taupe-700/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-taupe-400">
          <p>© {new Date().getFullYear()} Artisan Magz Studio. Handcrafted with love in India.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Secure Checkout</span>
            <span>•</span>
            <span>UPI / Cards / NetBanking</span>
            <span>•</span>
            <span>WhatsApp Order Routing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
