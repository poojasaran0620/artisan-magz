import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WelcomeHeader } from './components/home/WelcomeHeader';
import { ProductCategoriesSection } from './components/home/ProductCategoriesSection';
import { HowToOrderSection } from './components/home/HowToOrderSection';
import { InstagramFeedSection } from './components/home/InstagramFeedSection';
import { AboutUsSection } from './components/home/AboutUsSection';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { ProductDetail } from './components/product/ProductDetail';
import { HamperBuilder } from './components/hamper/HamperBuilder';
import { MagazineBuilder } from './components/magazine/MagazineBuilder';
import { MultiPageBookViewer } from './components/book/MultiPageBookViewer';
import { ReviewsPage } from './components/reviews/ReviewsPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { WishlistModal } from './components/wishlist/WishlistModal';
import { PolicyModal } from './components/ui/PolicyModal';
import { AuthModal } from './components/auth/AuthModal';
import { MyOrdersModal } from './components/account/MyOrdersModal';
import { SavedAddressesModal } from './components/account/SavedAddressesModal';
import { FramesCollectionPage } from './components/frames/FramesCollectionPage';
import { FrameOption } from './data/frameOptions';
import { PRODUCTS } from './data/products';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BulkOrderPage } from './components/bulk/BulkOrderPage';
import { FAQSection } from './components/home/FAQSection';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const hash = window.location.hash.toLowerCase();
      if (
        viewParam === 'book' ||
        viewParam === 'book-viewer' ||
        viewParam === 'songbook' ||
        viewParam === 'songs-book' ||
        hash.includes('book') ||
        hash.includes('songbook')
      ) {
        return 'book-viewer';
      }
      if (viewParam) return viewParam;
    }
    return 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-mag-01');
  const [selectedFrameOption, setSelectedFrameOption] = useState<FrameOption | null>(null);
  const [initialVariantId, setInitialVariantId] = useState<string | undefined>(undefined);
  const [initialTemplateId, setInitialTemplateId] = useState<string | undefined>(undefined);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const hash = window.location.hash.toLowerCase();
      if (
        viewParam === 'book' ||
        viewParam === 'book-viewer' ||
        viewParam === 'songbook' ||
        viewParam === 'songs-book' ||
        hash.includes('book') ||
        hash.includes('songbook')
      ) {
        setCurrentView('book-viewer');
      } else if (viewParam) {
        setCurrentView(viewParam);
      } else if (!hash) {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleNavigate = (view: string, id?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'wishlist') {
      setIsWishlistModalOpen(true);
      return;
    }
    if (view === 'book-viewer' || view === 'book' || view === 'songs-book') {
      setCurrentView('book-viewer');
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState(null, '', '?view=book');
      }
      return;
    }
    if (view === 'home') {
      setCurrentView('home');
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      return;
    }
    if (view === 'frames') {
      setCurrentView('frames');
      return;
    }
    if (id) {
      if (id === 'prod-frame-01' || id === 'frames' || id === 'frames-collection') {
        setCurrentView('frames');
        return;
      }
      if (id === 'prod-hamper-01' || id === 'hamper' || id === 'hampers') {
        setCurrentView('hamper');
        return;
      }
      if (id === 'prod-song-01' || id === 'songbook' || id === 'song-album' || id === 'songs-book') {
        setCurrentView('book-viewer');
        return;
      }
      setSelectedProductId(id);
      setInitialVariantId(undefined);
      setInitialTemplateId(undefined);
      setSelectedFrameOption(null);
      if (id === 'prod-mag-01') {
        setCurrentView('magazine-builder');
      } else {
        setCurrentView('product');
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleSelectProduct = (productId: string, templateId?: string, variantId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (productId === 'frames' || productId === 'frames-collection' || productId === 'prod-frame-01') {
      setCurrentView('frames');
      return;
    }
    if (productId === 'hampers' || productId === 'prod-hamper-01' || productId === 'hamper') {
      setCurrentView('hamper');
      return;
    }
    if (productId === 'prod-song-01' || productId === 'songbook' || productId === 'song-album' || productId === 'songs-book') {
      setCurrentView('book-viewer');
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState(null, '', '?view=book');
      }
      return;
    }
    setSelectedFrameOption(null);
    setSelectedProductId(productId);
    setInitialTemplateId(templateId);
    setInitialVariantId(variantId);
    if (productId === 'prod-mag-01') {
      setCurrentView('magazine-builder');
    } else {
      setCurrentView('product');
    }
  };

  const handleSelectFrameOption = (frame: FrameOption) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedFrameOption(frame);
    setSelectedProductId(frame.productId);
    setCurrentView('product');
  };

  const selectedProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-[#FDFCF5] selection:bg-[#FFDBE5] selection:text-[#333333]">
              {/* Main Navigation (AnnouncementBar disabled per user request) */}
            <Navbar
              onNavigate={handleNavigate}
              currentView={currentView}
              onOpenPolicy={(policy) => setActivePolicy(policy)}
            />

            {/* Main Content Area */}
          {/* Main Content Area with Fluid Page Transition */}
          <AnimatePresence mode="wait">
            <motion.main
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex-grow"
            >
            {currentView === 'home' && (
              <>
                {/* 1. Top Welcome Header */}
                <WelcomeHeader
                  onExploreClick={() => {
                    const el = document.getElementById('best-selling');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* 2. Best Selling & More Products (Clean Minimalist Cards) */}
                <ProductCategoriesSection
                  onSelectProduct={handleSelectProduct}
                  onHamperClick={() => handleNavigate('hamper')}
                />

                {/* 3. Process: How to Order & How to Upload Photos */}
                <HowToOrderSection />

                {/* 4. Curated Instagram Feed (Reels & Posts Grid) */}
                <InstagramFeedSection />
              </>
            )}

            {(currentView === 'about' || currentView === 'about-us') && (
              <AboutUsSection onBack={() => handleNavigate('home')} />
            )}

            {(currentView === 'bulk-order' || currentView === 'bulk') && (
              <BulkOrderPage onBack={() => handleNavigate('home')} />
            )}

            {(currentView === 'faq' || currentView === 'faqs') && (
              <FAQSection onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'shop' && (
              <>
                <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="font-serif text-3xl font-bold text-wine-900">
                    Artisan magz Keepsakes Collection 🌸
                  </h1>
                  <p className="text-xs text-wine-900/60 mt-1">
                    Select any custom magazine, frame, newspaper card, or curated hamper to personalize.
                  </p>
                </div>
                <ProductCategoriesSection
                  onSelectProduct={handleSelectProduct}
                  onHamperClick={() => handleNavigate('hamper')}
                />
                <FeaturedProducts
                  onSelectProduct={handleSelectProduct}
                  onHamperClick={() => handleNavigate('hamper')}
                />
              </>
            )}

            {currentView === 'frames' && (
              <FramesCollectionPage
                onSelectFrame={handleSelectFrameOption}
                onBack={() => handleNavigate('home')}
              />
            )}

            {currentView === 'product' && (
              <ProductDetail
                product={selectedProduct}
                initialVariantId={initialVariantId}
                initialTemplateId={initialTemplateId}
                initialImage={selectedFrameOption?.image}
                initialTitle={selectedFrameOption?.title}
                initialCollageStyle={selectedFrameOption?.collageStyle}
                onBack={() => {
                  if (selectedFrameOption || selectedProduct.category === 'frame') {
                    setCurrentView('frames');
                  } else {
                    handleNavigate('home');
                  }
                }}
                onNavigateHamper={() => handleNavigate('hamper')}
                onOpenPolicy={(policy) => setActivePolicy(policy)}
                onDirectCheckout={() => setIsCheckoutModalOpen(true)}
                onOpenBookViewer={() => setCurrentView('book-viewer')}
              />
            )}

            {currentView === 'magazine-builder' && (
              <MagazineBuilder
                onBack={() => handleNavigate('home')}
                onOpenBookViewer={() => handleNavigate('book-viewer')}
              />
            )}

            {(currentView === 'book-viewer' || currentView === 'book-layout' || currentView === 'book') && (
              <MultiPageBookViewer onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'hamper' && (
              <HamperBuilder onBackToShop={() => handleNavigate('home')} />
            )}

            {currentView === 'reviews' && (
              <ReviewsPage
                onBackToShop={() => handleNavigate('home')}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentView === 'admin' && (
              <AdminDashboard onBack={() => handleNavigate('home')} />
            )}
            </motion.main>
          </AnimatePresence>

          {/* Footer (BottomNav disabled per user request) */}
          <Footer
            onOpenPolicy={(policy) => setActivePolicy(policy)}
            onNavigate={handleNavigate}
          />

          {/* Global Slide-out Cart Drawer */}
          <CartDrawer
            onProceedToDirectCheckout={() => setIsCheckoutModalOpen(true)}
          />

          {/* Simulated Direct Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
          />

          {/* Wishlist Modal */}
          <WishlistModal
            isOpen={isWishlistModalOpen}
            onClose={() => setIsWishlistModalOpen(false)}
            onSelectProduct={handleSelectProduct}
            onNavigateHamper={() => handleNavigate('hamper')}
          />

          {/* Policy Modal (Cancellation, Shipping, Privacy, FAQ) */}
          <PolicyModal
            policy={activePolicy}
            onClose={() => setActivePolicy(null)}
          />

          {/* Authentication & User Modals */}
          <AuthModal />
          <MyOrdersModal />
          <SavedAddressesModal />
        </div>
      </ToastProvider>
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
  );
};

export default App;
