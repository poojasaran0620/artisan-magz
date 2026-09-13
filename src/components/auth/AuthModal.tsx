import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, ShieldCheck, Heart, Truck, ArrowRight, Mail } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithEmail, isLoading } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    signInWithEmail(emailInput.trim(), nameInput.trim() || undefined);
  };

  const handleQuickFill = (email: string, name: string) => {
    setEmailInput(email);
    setNameInput(name);
    signInWithEmail(email, name);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="bg-[#FFFDF9] rounded-3xl max-w-md w-full overflow-hidden shadow-luxury border border-white/80 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-charcoal/50 hover:text-charcoal rounded-full hover:bg-cream-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9E7864] to-[#B76E79] text-[#FDFCF5] flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-6 h-6 text-roseGold-light" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            Artisan Magz
          </h2>
          <p className="text-xs text-taupe-700 max-w-xs mx-auto">
            Sign in to access your personalized keepsakes, track orders, and open the Admin Dashboard.
          </p>
        </div>

        {/* Value Perks List */}
        <div className="bg-cream-100/70 rounded-2xl p-3.5 space-y-2.5 border border-taupe-200/50">
          <div className="flex items-start gap-2 text-xs text-charcoal">
            <div className="w-4.5 h-4.5 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-roseGold text-[11px]">
              ⚡
            </div>
            <div>
              <strong className="font-semibold text-charcoal">1-Tap Express Checkout:</strong>
              <span className="text-[11px] text-taupe-700 ml-1">Auto-fill saved shipping addresses.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-charcoal">
            <div className="w-4.5 h-4.5 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-roseGold text-[11px]">
              📦
            </div>
            <div>
              <strong className="font-semibold text-charcoal">Real-time Order Tracking:</strong>
              <span className="text-[11px] text-taupe-700 ml-1">Live updates from print to door.</span>
            </div>
          </div>
        </div>

        {/* Sign-In Actions */}
        <div className="space-y-4 pt-1">
          {/* 1-Click Google Sign-In Button */}
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-cream-50 text-charcoal rounded-2xl font-bold text-sm shadow-luxury hover:shadow-soft-lg active:scale-98 border border-taupe-300/80 transition flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
          >
            {/* Multicolored Google 'G' Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            <ArrowRight className="w-4 h-4 text-roseGold group-hover:translate-x-1 transition-transform ml-auto" />
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-taupe-200/80 w-full" />
            <span className="bg-[#FFFDF9] px-3 text-[10px] font-bold tracking-widest text-taupe-500 uppercase shrink-0">
              or sign in with email
            </span>
            <div className="border-t border-taupe-200/80 w-full" />
          </div>

          {/* Direct Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 text-taupe-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email (e.g. artisanmagz@gmail.com)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-taupe-200/90 rounded-xl text-xs text-charcoal placeholder:text-taupe-400 focus:outline-none focus:ring-1 focus:ring-roseGold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailInput.trim()}
              className="w-full py-2.5 px-4 bg-charcoal hover:bg-charcoal-dark text-white rounded-xl font-bold text-xs shadow-soft active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <span>Instant Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Admin Profile Shortcuts */}
          <div className="pt-1">
            <div className="text-[10px] text-taupe-500 font-semibold uppercase tracking-wider mb-1.5 text-center">
              Quick Admin Access
            </div>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickFill('artisanmagz@gmail.com', 'Artisan Magz')}
                className="px-2.5 py-1 rounded-full bg-cream-100 hover:bg-roseGold/10 border border-taupe-200 text-[10px] font-medium text-charcoal transition cursor-pointer"
              >
                artisanmagz@gmail.com 🛡️
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('poojasaran0620@gmail.com', 'Pooja Saran')}
                className="px-2.5 py-1 rounded-full bg-cream-100 hover:bg-roseGold/10 border border-taupe-200 text-[10px] font-medium text-charcoal transition cursor-pointer"
              >
                poojasaran0620@gmail.com 🛡️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
