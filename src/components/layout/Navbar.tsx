import React, { useState } from 'react';
import { ShoppingBag, Gift, Menu, X, Sparkles, User, Package, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../ui/BrandLogo';
import { UserMenuDropdown } from '../account/UserMenuDropdown';

interface NavbarProps {
  onNavigate: (view: string, productId?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const { cartItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, openOrdersModal, openAddressesModal, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string, productId?: string) => {
    onNavigate(view, productId);
    setMobileMenuOpen(false);
  };

  return (
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
            </nav>

            {/* User Auth Trigger */}
            {isAuthenticated ? (
              <UserMenuDropdown />
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="hidden sm:flex items-center gap-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal px-3 py-1.5 rounded-full border border-taupe-200/80 text-xs font-semibold transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-roseGold" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] px-3.5 py-2 rounded-full shadow-soft transition hover:shadow-soft-lg group cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition text-roseGold-light" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              <span className="bg-blush-100 text-charcoal text-[11px] font-bold px-2 py-0.2 rounded-full min-w-[18px] text-center">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-taupe-200/60 px-5 py-4 space-y-3 animate-fadeIn">
          {/* Mobile User Profile Section */}
          <div className="pb-3 border-b border-taupe-200/60">
            {isAuthenticated && user ? (
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
                  <div>
                    <span className="text-xs font-bold text-charcoal block">{user.name}</span>
                    <span className="text-[10px] text-taupe-600 block">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="text-xs text-red-600 font-semibold px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-cream-100 text-charcoal rounded-xl text-xs font-bold border border-taupe-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-roseGold" />
                <span>Sign In with Google</span>
              </button>
            )}

            {isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openOrdersModal();
                  }}
                  className="flex-1 py-1.5 px-2.5 bg-white text-charcoal rounded-lg text-xs font-medium border border-taupe-200 flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-roseGold" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAddressesModal();
                  }}
                  className="flex-1 py-1.5 px-2.5 bg-white text-charcoal rounded-lg text-xs font-medium border border-taupe-200 flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-roseGold" />
                  <span>Addresses</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 font-medium text-charcoal hover:text-roseGold"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('product', 'prod-mag-01')}
            className="block w-full text-left py-2 font-medium text-charcoal hover:text-roseGold"
          >
            Custom Magazines (8 - 20 Pages)
          </button>
          <button
            onClick={() => handleNavClick('frames')}
            className="block w-full text-left py-2 font-medium text-charcoal hover:text-roseGold"
          >
            Personalized Frames & Collages
          </button>
          <button
            onClick={() => handleNavClick('product', 'prod-news-01')}
            className="block w-full text-left py-2 font-medium text-charcoal hover:text-roseGold"
          >
            Personalized Newspaper Card
          </button>
          <button
            onClick={() => handleNavClick('product', 'prod-song-01')}
            className="block w-full text-left py-2 font-medium text-charcoal hover:text-roseGold"
          >
            Song Book & Spotify Plaque
          </button>
          <button
            onClick={() => handleNavClick('hamper')}
            className="flex items-center justify-between w-full text-left py-2.5 px-3 bg-blush-100 rounded-xl font-semibold text-charcoal"
          >
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-roseGold" />
              Build Your Own Hamper
            </span>
            <span className="text-[10px] bg-charcoal text-[#FDFCF5] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
              Interactive
            </span>
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="block w-full text-left py-2 font-medium text-charcoal hover:text-roseGold"
          >
            Customer Reviews & Unboxings
          </button>
        </div>
      )}
    </header>
  );
};
