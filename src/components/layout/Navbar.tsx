import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Gift, Menu, X, Sparkles, User, Package, MapPin, ChevronDown, BookOpen } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { springs } from '../../styles/motion';
import { BrandLogo } from '../ui/BrandLogo';
import { UserMenuDropdown } from '../account/UserMenuDropdown';
import { UserProfileIcon, ShoppingBagIcon } from '../ui/Icons';

interface NavbarProps {
  onNavigate: (view: string, productId?: string) => void;
  currentView: string;
  onOpenPolicy?: (policy: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, onOpenPolicy }) => {
  const { cartItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, openOrdersModal, openAddressesModal, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string, productId?: string) => {
    onNavigate(view, productId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FDFCF5]/95 backdrop-blur-md border-b border-taupe-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Left Column: Mobile Menu or Desktop Left Nav Links */}
          <div className="flex-1 flex items-center justify-start">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-charcoal hover:text-roseGold focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Left Nav */}
            <nav className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm font-medium transition hover:text-roseGold ${
                  currentView === 'home' ? 'text-roseGold font-semibold' : 'text-charcoal/80'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('product', 'prod-mag-01')}
                className="text-sm font-bold text-roseGold hover:text-roseGold-dark transition flex items-center gap-1.5"
              >
                <span>Magazines (8-20p)</span>
                <span className="text-[9px] bg-blush-100 text-roseGold px-1.5 py-0.5 rounded-full font-bold">
                  Star
                </span>
              </button>

              <button
                onClick={() => handleNavClick('book-viewer')}
                className={`text-sm font-semibold transition hover:text-roseGold flex items-center gap-1.5 ${
                  currentView === 'book-viewer' ? 'text-roseGold font-bold' : 'text-charcoal/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-roseGold" />
                <span>Songs Book</span>
                <span className="text-[9px] bg-roseGold/10 text-roseGold px-1.5 py-0.5 rounded-full font-bold">
                  Spreads
                </span>
              </button>

              <button
                onClick={() => handleNavClick('frames')}
                className="text-sm font-medium text-charcoal/80 hover:text-roseGold transition"
              >
                Frames
              </button>
            </nav>
          </div>

          {/* Center Column: Logo in Middle */}
          <div className="shrink-0 flex items-center justify-center px-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-center group cursor-pointer focus:outline-none"
              aria-label="Artisan magz Home"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Right Column: Desktop Right Nav Links + Cart Bag */}
          <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6">
            {/* Desktop Right Nav */}
            <nav className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => handleNavClick('hamper')}
                className="text-sm font-medium text-charcoal/80 hover:text-roseGold transition"
              >
                Hampers
              </button>

              <button
                onClick={() => handleNavClick('product', 'prod-news-01')}
                className="text-sm font-medium text-charcoal/80 hover:text-roseGold transition"
              >
                Newspaper
              </button>

              <button
                onClick={() => {
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('product-categories')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-sm font-semibold text-charcoal/80 hover:text-roseGold transition flex items-center gap-1.5"
              >
                <span>Combos</span>
                <span className="text-[9px] bg-sage-100 text-sage-700 px-1.5 py-0.5 rounded-full font-bold">
                  Save
                </span>
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm font-medium transition hover:text-roseGold ${
                  currentView === 'about' ? 'text-roseGold font-semibold' : 'text-charcoal/80'
                }`}
              >
                About Us
              </button>

              <button
                onClick={() => handleNavClick('bulk-order')}
                className={`text-sm font-medium transition hover:text-roseGold ${
                  currentView === 'bulk-order' ? 'text-roseGold font-semibold' : 'text-charcoal/80'
                }`}
              >
                Bulk Orders
              </button>

              <button
                onClick={() => handleNavClick('faq')}
                className={`text-sm font-medium transition hover:text-roseGold ${
                  currentView === 'faq' ? 'text-roseGold font-semibold' : 'text-charcoal/80'
                }`}
              >
                FAQ
              </button>
            </nav>

            {/* User Auth Trigger */}
            {isAuthenticated ? (
              <UserMenuDropdown onNavigate={onNavigate} />
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal px-2.5 sm:px-3 py-1.5 rounded-full border border-taupe-200/80 text-xs font-semibold transition cursor-pointer"
                title="Sign In / Profile"
                aria-label="User profile"
              >
                <UserProfileIcon className="w-4 h-4 text-charcoal group-hover:text-roseGold transition-colors" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Trigger with Spring Scale */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={springs.snappy}
              onClick={openCart}
              className="flex items-center gap-2 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] px-3.5 py-2 rounded-full shadow-soft hover:shadow-soft-lg group cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBagIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 text-roseGold-light" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              <motion.span
                key={totalCartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springs.bouncy}
                className="bg-blush-100 text-charcoal text-[11px] font-bold px-2 py-0.2 rounded-full min-w-[18px] text-center"
              >
                {totalCartCount}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>


    </header>

    {/* Mobile Navigation Sheet Drawer (shadcn Sheet pattern rendered via Portal) */}
    {typeof document !== 'undefined' &&
      createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop Blur Overlay */}
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-xs lg:hidden"
                aria-hidden="true"
              />

              {/* Slide-in Sheet Drawer Panel */}
              <motion.div
                key="mobile-nav-sheet"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 left-0 z-50 w-[84vw] max-w-xs bg-[#FDFCF5] border-r border-taupe-200/80 shadow-2xl flex flex-col justify-between lg:hidden overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Menu"
              >
                {/* Sheet Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-taupe-200/60 bg-cream-50/70">
                  <BrandLogo size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-charcoal/70 hover:text-charcoal hover:bg-taupe-200/60 transition cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sheet Nav Links (scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                  {/* 1. Home */}
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      currentView === 'home'
                        ? 'bg-roseGold/10 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-100/80 hover:text-roseGold'
                    }`}
                  >
                    <span>Home</span>
                  </button>

                  {/* 2. Categories (Expandable) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-100/80 hover:text-roseGold transition cursor-pointer"
                    >
                      <span>Categories</span>
                      <ChevronDown
                        className={`w-4 h-4 text-taupe-600 transition-transform duration-200 ${
                          isCategoriesOpen ? 'rotate-180 text-roseGold' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isCategoriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden pl-4 py-1 space-y-1 border-l-2 border-roseGold/30 ml-4 my-1"
                        >
                          <button
                            onClick={() => handleNavClick('product', 'prod-mag-01')}
                            className="block w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal/80 hover:bg-roseGold/10 hover:text-roseGold transition cursor-pointer"
                          >
                            Custom Magazines
                          </button>
                          <button
                            onClick={() => handleNavClick('product', 'prod-mini-mag-01')}
                            className="block w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal/80 hover:bg-roseGold/10 hover:text-roseGold transition cursor-pointer"
                          >
                            Pocket Magazine
                          </button>
                          <button
                            onClick={() => handleNavClick('frames')}
                            className="block w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal/80 hover:bg-roseGold/10 hover:text-roseGold transition cursor-pointer"
                          >
                            Photo Frames
                          </button>
                          <button
                            onClick={() => handleNavClick('hamper')}
                            className="block w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal/80 hover:bg-roseGold/10 hover:text-roseGold transition cursor-pointer"
                          >
                            Bespoke Hampers
                          </button>
                          <button
                            onClick={() => handleNavClick('product', 'prod-combo-01')}
                            className="block w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal/80 hover:bg-roseGold/10 hover:text-roseGold transition cursor-pointer"
                          >
                            Gift Combos
                          </button>
                          <button
                            onClick={() => handleNavClick('book-viewer')}
                            className="flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-roseGold hover:bg-roseGold/10 hover:text-roseGold-dark transition cursor-pointer"
                          >
                            <span>Songs Book</span>
                            <span className="text-[9px] bg-roseGold/10 px-1.5 py-0.5 rounded-full font-bold">Spreads</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Direct Songs Book Spreads Mobile Link */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('book-viewer')}
                    className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      currentView === 'book-viewer'
                        ? 'bg-roseGold/10 text-roseGold'
                        : 'text-charcoal hover:bg-cream-100/80 hover:text-roseGold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-roseGold" />
                      <span>Songs Book Spreads</span>
                    </div>
                    <span className="text-[10px] bg-roseGold text-white px-2 py-0.5 rounded-full font-bold">
                      Physical Layout
                    </span>
                  </button>

                  {/* 3. FAQ */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('faq')}
                    className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      currentView === 'faq'
                        ? 'bg-roseGold/10 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-100/80 hover:text-roseGold'
                    }`}
                  >
                    <span>FAQ</span>
                  </button>

                  {/* 4. About Us */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('about')}
                    className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      currentView === 'about'
                        ? 'bg-roseGold/10 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-100/80 hover:text-roseGold'
                    }`}
                  >
                    <span>About Us</span>
                  </button>

                  {/* 5. Bulk Order */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('bulk-order')}
                    className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      currentView === 'bulk-order'
                        ? 'bg-roseGold/10 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-100/80 hover:text-roseGold'
                    }`}
                  >
                    <span>Bulk Orders</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-roseGold/10 text-roseGold">
                      Corporate
                    </span>
                  </button>

                  {/* 6. WhatsApp Concierge */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.open(
                        'https://wa.me/917000041053?text=Hi%20Artisan%20Magz!%20I%20have%20a%20question%20about%20your%20products.',
                        '_blank'
                      );
                    }}
                    className="flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-100/80 hover:text-roseGold transition cursor-pointer"
                  >
                    <span>WhatsApp Concierge</span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </button>
                </div>

                {/* Sheet Footer: User Account / Actions */}
                <div className="p-4 border-t border-taupe-200/60 bg-cream-50/60">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-roseGold"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-roseGold text-white flex items-center justify-center text-xs font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-charcoal truncate block">{user.name}</span>
                            <span className="text-[10px] text-taupe-600 truncate block">{user.email}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            signOut();
                          }}
                          className="text-xs text-roseGold hover:text-roseGold-dark font-semibold px-2 py-1 cursor-pointer transition"
                        >
                          Sign Out
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openOrdersModal();
                          }}
                          className="flex-1 py-2 px-2.5 bg-white text-charcoal rounded-lg text-xs font-medium border border-taupe-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-cream-100 transition"
                        >
                          <Package className="w-3.5 h-3.5 text-roseGold" />
                          <span>My Orders</span>
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openAddressesModal();
                          }}
                          className="flex-1 py-2 px-2.5 bg-white text-charcoal rounded-lg text-xs font-medium border border-taupe-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-cream-100 transition"
                        >
                          <MapPin className="w-3.5 h-3.5 text-roseGold" />
                          <span>Addresses</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full py-2.5 px-4 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-xl text-xs font-semibold shadow-soft flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <User className="w-4 h-4 text-roseGold-light" />
                      <span>Login / Sign Up</span>
                    </button>
                  )}

                  <div className="mt-3 text-center">
                    <span className="text-[10px] text-taupe-500 font-serif italic tracking-wide">
                      Artisan Keepsakes & Bespoke Hampers
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
  </>
  );
};
