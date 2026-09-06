import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ProductCategoriesSection } from './components/home/ProductCategoriesSection';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { TestimonialSection } from './components/home/TestimonialSection';
import { InstagramFeedSection } from './components/home/InstagramFeedSection';
import { ProductDetail } from './components/product/ProductDetail';
import { HamperBuilder } from './components/hamper/HamperBuilder';
import { MagazineBuilder } from './components/magazine/MagazineBuilder';
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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-mag-01');
  const [selectedFrameOption, setSelectedFrameOption] = useState<FrameOption | null>(null);
  const [initialVariantId, setInitialVariantId] = useState<string | undefined>(undefined);
  const [initialTemplateId, setInitialTemplateId] = useState<string | undefined>(undefined);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const handleNavigate = (view: string, id?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'wishlist') {
      setIsWishlistModalOpen(true);
      return;
    }
    if (view === 'frames') {
      setCurrentView('frames');
      return;
    }
    if (id) {
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
    if (productId === 'frames' || productId === 'frames-collection') {
      setCurrentView('frames');
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
          <div className="min-h-screen flex flex-col bg-[#FDFCF5] selection:bg-[#FFDBE5] selection:text-[#333333]">
          {/* Main Navigation (AnnouncementBar disabled per user request) */}
          <Navbar onNavigate={handleNavigate} currentView={currentView} />

          {/* Main Content Area */}
          <main className="flex-grow">
            {currentView === 'home' && (
              <>
                {/* Brand Logo & Tagline Hero Section with Explore Products trigger */}
                <HeroSection
                  onExploreClick={() => {
                    const el = document.getElementById('product-categories');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else handleNavigate('shop');
                  }}
                  onHamperClick={() => handleNavigate('hamper')}
                  onProductClick={handleSelectProduct}
                />

                {/* Front Page Product Categories: Magazines (8 & 20p + Templates), Frames, Hampers, Mini Mag, Newspaper, Combos */}
                <ProductCategoriesSection
                  onSelectProduct={handleSelectProduct}
                  onHamperClick={() => handleNavigate('hamper')}
                />

                {/* Bestseller Keepsakes Grid */}
                <FeaturedProducts
                  onSelectProduct={handleSelectProduct}
                  onHamperClick={() => handleNavigate('hamper')}
                />

                {/* Real Customer Photos & Reviews */}
                <TestimonialSection />

                {/* Instagram Feed Grid */}
                <InstagramFeedSection />
              </>
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
                  if (selectedFrameOption) {
                    setCurrentView('frames');
                  } else {
                    handleNavigate('home');
                  }
                }}
                onNavigateHamper={() => handleNavigate('hamper')}
                onOpenPolicy={(policy) => setActivePolicy(policy)}
                onDirectCheckout={() => setIsCheckoutModalOpen(true)}
              />
            )}

            {currentView === 'magazine-builder' && (
              <MagazineBuilder onBack={() => handleNavigate('home')} />
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
          </main>

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
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
  );
};

export default App;
