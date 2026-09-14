import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Gift, Menu, X, Sparkles, User, Package, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { springs, modalBackdropVariants, drawerSlideLeftVariants } from '../../styles/motion';
import { BrandLogo } from '../ui/BrandLogo';
import { UserMenuDropdown } from '../account/UserMenuDropdown';

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
                className="hidden sm:flex items-center gap-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal px-3 py-1.5 rounded-full border border-taupe-200/80 text-xs font-semibold transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-roseGold" />
                <span>Sign In</span>
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
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 text-roseGold-light" />
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

      {/* Mobile SideNav Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-sidenav-wrapper"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 lg:hidden overflow-hidden"
          >
            {/* Backdrop with Genuine Fade-In and Fade-Out */}
            <motion.div
              variants={modalBackdropVariants}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-label="Close navigation overlay"
            />

            {/* Slide-out Left Drawer Container */}
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 pointer-events-none">
              <motion.div
                variants={drawerSlideLeftVariants}
                className="w-[85vw] max-w-xs sm:max-w-sm bg-[#FDFCF5] shadow-2xl flex flex-col justify-between border-r border-taupe-200/80 pointer-events-auto h-full"
              >
                {/* Drawer Header */}
                <div className="p-4 sm:p-5 border-b border-taupe-200/60 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
                  <BrandLogo size="sm" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={springs.snappy}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center transition cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Nav Links (Scrollable Content) */}
                <div className="px-5 py-4 overflow-y-auto flex-1 space-y-1">
                  {/* 1. Home */}
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium transition ${
                      currentView === 'home'
                        ? 'bg-cream-100 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-50 hover:text-roseGold'
                    }`}
                  >
                    Home
                  </button>

                  {/* 2. Categories (Expandable) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="flex items-center justify-between w-full text-left py-2.5 px-3 rounded-xl font-medium text-charcoal hover:bg-cream-50 hover:text-roseGold transition cursor-pointer"
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
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-4 py-1 space-y-1 border-l-2 border-roseGold/40 ml-4 my-1"
                        >
                          <button
                            onClick={() => handleNavClick('product', 'prod-mag-01')}
                            className="block w-full text-left py-1.5 px-2 text-sm text-charcoal/80 hover:text-roseGold transition"
                          >
                            Magazines
                          </button>
                          <button
                            onClick={() => handleNavClick('product', 'prod-mini-mag-01')}
                            className="block w-full text-left py-1.5 px-2 text-sm text-charcoal/80 hover:text-roseGold transition"
                          >
                            Pocket magazine
                          </button>
                          <button
                            onClick={() => handleNavClick('frames')}
                            className="block w-full text-left py-1.5 px-2 text-sm text-charcoal/80 hover:text-roseGold transition"
                          >
                            Photo frames
                          </button>
                          <button
                            onClick={() => handleNavClick('hamper')}
                            className="block w-full text-left py-1.5 px-2 text-sm text-charcoal/80 hover:text-roseGold transition"
                          >
                            Hamper
                          </button>
                          <button
                            onClick={() => handleNavClick('product', 'prod-combo-01')}
                            className="block w-full text-left py-1.5 px-2 text-sm text-charcoal/80 hover:text-roseGold transition"
                          >
                            Combos
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. FAQ */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('faq')}
                    className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium transition ${
                      currentView === 'faq'
                        ? 'bg-cream-100 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-50 hover:text-roseGold'
                    }`}
                  >
                    FAQ
                  </button>

                  {/* 4. About us */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('about')}
                    className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium transition ${
                      currentView === 'about'
                        ? 'bg-cream-100 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-50 hover:text-roseGold'
                    }`}
                  >
                    About us
                  </button>

                  {/* 5. Bulk order */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('bulk-order')}
                    className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium transition ${
                      currentView === 'bulk-order'
                        ? 'bg-cream-100 text-roseGold font-semibold'
                        : 'text-charcoal hover:bg-cream-50 hover:text-roseGold'
                    }`}
                  >
                    Bulk order
                  </button>

                  {/* 6. Contact us */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.open(
                        'https://wa.me/917000041053?text=Hi%20Artisan%20Magz!%20I%20have%20a%20question%20about%20your%20products.',
                        '_blank'
                      );
                    }}
                    className="block w-full text-left py-2.5 px-3 rounded-xl font-medium text-charcoal hover:bg-cream-50 hover:text-roseGold transition"
                  >
                    Contact us
                  </button>
                </div>

                {/* Footer Section: User Auth & Account */}
                <div className="p-4 border-t border-taupe-200/60 bg-cream-50/80 shrink-0">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
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
                          className="text-xs text-red-600 font-semibold px-2 py-1 cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openOrdersModal();
                          }}
                          className="flex-1 py-1.5 px-2.5 bg-white text-charcoal rounded-lg text-xs font-medium border border-taupe-200 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-cream-100 transition"
                        >
                          <Package className="w-3.5 h-3.5 text-roseGold" />
                          <span>My Orders</span>
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openAddressesModal();
                          }}
                          className="flex-1 py-1.5 px-2.5 bg-white text-charcoal rounded-lg text-xs font-medium border border-taupe-200 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-cream-100 transition"
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
                      className="w-full py-2.5 px-4 bg-white hover:bg-cream-100 text-charcoal rounded-xl text-xs font-bold border border-taupe-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <User className="w-4 h-4 text-roseGold" />
                      <span>Login / Sign Up</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
