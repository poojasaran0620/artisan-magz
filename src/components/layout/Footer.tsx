import React from 'react';
import { Mail } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '../ui/Icons';

interface FooterProps {
  onOpenPolicy: (policyName: string) => void;
  onNavigate: (view: string, id?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  return (
    <footer className="bg-[#FAF8F5] text-charcoal pt-14 pb-16 border-t border-[#EAE4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand & Tagline matching Website & Logo Theme */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/artisan_logo_horizontal.png"
                alt="Artisan Magz"
                className="h-14 sm:h-16 w-auto object-contain -ml-1 hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col justify-center">
                <span className="font-serif italic text-2xl sm:text-3xl text-charcoal font-bold tracking-tight leading-none">
                  Artisan
                </span>
                <span className="text-[11px] tracking-[0.28em] uppercase text-roseGold font-bold mt-1">
                  MAGZ
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed max-w-md font-sans">
              Artfully made for your moments
            </p>
          </div>

          {/* Policies Column */}
          <div className="col-span-1 space-y-3">
            <h4 className="font-serif text-sm text-charcoal/70 tracking-wide">
              Policies
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className="font-serif text-base sm:text-lg text-charcoal hover:text-roseGold transition-colors cursor-pointer text-left block"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('privacy')}
                  className="font-serif text-base sm:text-lg text-charcoal hover:text-roseGold transition-colors cursor-pointer text-left block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('cancellation')}
                  className="font-serif text-base sm:text-lg text-charcoal hover:text-roseGold transition-colors cursor-pointer text-left block"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('shipping')}
                  className="font-serif text-base sm:text-lg text-charcoal hover:text-roseGold transition-colors cursor-pointer text-left block"
                >
                  Shipping Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column with WhatsApp, Email & Instagram */}
          <div className="col-span-1 space-y-3">
            <h4 className="font-serif text-sm text-charcoal/70 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="mailto:artisanmagz@gmail.com"
                  className="flex items-center gap-2.5 text-charcoal hover:text-roseGold transition-colors group"
                >
                  <Mail className="w-5 h-5 text-charcoal group-hover:text-roseGold transition-colors shrink-0" />
                  <span className="font-sans">artisanmagz@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/artisan.magz?stkn=bXVmN2RsanZlMGdp"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-roseGold hover:text-roseGold-dark transition-colors group"
                >
                  <InstagramIcon className="w-5 h-5 text-roseGold shrink-0" />
                  <span className="font-sans font-medium">@artisan.magz</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917000041053"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-charcoal hover:text-[#25D366] transition-colors group"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span className="font-sans font-medium">+91 70000 41053</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-6 border-t border-[#EAE4DC] text-center text-xs sm:text-sm text-charcoal/70 font-sans">
          <p>© {new Date().getFullYear()} Artisan Magz. All rights reserved. Made with love in India.</p>
        </div>
      </div>
    </footer>
  );
};