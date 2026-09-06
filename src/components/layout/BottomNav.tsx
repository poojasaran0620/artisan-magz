import React from 'react';
import { Home, Sparkles, Gift, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { cartItems, openCart } = useCart();
  const { wishlist } = useWishlist();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-lg border-t border-roseGold-light/40 py-2 px-6 flex items-center justify-around md:hidden shadow-luxury">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-0.5 transition ${
          currentView === 'home' ? 'text-blush-600 font-semibold' : 'text-wine-900/60'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => onNavigate('shop')}
        className={`flex flex-col items-center gap-0.5 transition ${
          currentView === 'shop' ? 'text-blush-600 font-semibold' : 'text-wine-900/60'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px]">Shop</span>
      </button>

      {/* Center Build Hamper floating CTA */}
      <button
        onClick={() => onNavigate('hamper')}
        className="flex flex-col items-center -mt-5 relative group focus:outline-none"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blush-500 to-roseGold text-white flex items-center justify-center shadow-soft-lg group-active:scale-95 transition border-2 border-[#FCFAF7]">
          <Gift className="w-6 h-6 animate-pulse-subtle" />
        </div>
        <span className="text-[10px] font-bold text-blush-600 mt-0.5">Hamper</span>
      </button>

      <button
        onClick={() => onNavigate('wishlist')}
        className={`flex flex-col items-center gap-0.5 relative transition ${
          currentView === 'wishlist' ? 'text-blush-600 font-semibold' : 'text-wine-900/60'
        }`}
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 right-2 bg-blush-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px]">Saved</span>
      </button>

      <button
        onClick={openCart}
        className="flex flex-col items-center gap-0.5 relative text-wine-900/60 hover:text-blush-600 transition"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalCartCount > 0 && (
          <span className="absolute -top-1 right-2 bg-blush-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            {totalCartCount}
          </span>
        )}
        <span className="text-[10px]">Cart</span>
      </button>
    </nav>
  );
};
