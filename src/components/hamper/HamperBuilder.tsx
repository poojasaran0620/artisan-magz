import React, { useState, useRef } from 'react';
import {
  HAMPER_BOX_OPTIONS,
  HAMPER_GOODIES,
  HAMPER_LID_TAGS,
  HAMPER_INSPIRATION_LOOKS,
  HamperLidTagOption,
  PRODUCTS,
} from '../../data/products';
import {
  HamperBoxOption,
  HamperGoodie,
  HamperSelection,
  HamperInspirationLook,
} from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import {
  Gift,
  Check,
  Sparkles,
  ArrowLeft,
  X,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Package,
  Heart,
  Eye,
  Plus,
  Minus,
  Layers,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Camera,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HamperBuilderProps {
  onBackToShop: () => void;
}

interface FlyingProjectile {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const HamperBuilder: React.FC<HamperBuilderProps> = ({ onBackToShop }) => {
  const { addToCart, sendWhatsAppOrder } = useCart();

  // Box Choice (Cardboard vs Hardboard)
  const [selectedBox, setSelectedBox] = useState<HamperBoxOption>(HAMPER_BOX_OPTIONS[0]);

  // Inside Lid Tag (Happy Birthday, Anniversary, Made with Love, Just for You)
  const [selectedLidTag, setSelectedLidTag] = useState<HamperLidTagOption>(HAMPER_LID_TAGS[0]);

  // Packed Goodies in the Hamper
  const [selectedGoodies, setSelectedGoodies] = useState<
    { goodie: HamperGoodie; quantity: number }[]
  >([]);

  // Flying Projectiles state for the flying item animation
  const [flyingProjectiles, setFlyingProjectiles] = useState<FlyingProjectile[]>([]);

  // Box Bounce trigger when item lands
  const [isBoxBouncing, setIsBoxBouncing] = useState<boolean>(false);

  // Ref to the central hamper box drop zone to compute exact target coordinates
  const boxDropZoneRef = useRef<HTMLDivElement>(null);

  // Cozy Meter Toggle (can be enabled/disabled by user)
  const [showCozyMeter, setShowCozyMeter] = useState<boolean>(true);

  // Note / Message Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [noteType, setNoteType] = useState<'scroll' | 'greeting' | 'newspaper'>('scroll');
  const [cardMessage, setCardMessage] = useState<string>(
    'Wishing you all the joy, love, and sweet smiles in the world! You mean so much to me. Happy Birthday! 💖'
  );
  const [recipientName, setRecipientName] = useState<string>('My Favorite Person');
  const [senderName, setSenderName] = useState<string>('With Love');

  // Hamper Gallery & Deep-Dive Showcase State
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<
    'all' | 'jewelry' | 'accessory' | 'keepsake' | 'beauty-treat'
  >('all');
  const [gallerySearchQuery, setGallerySearchQuery] = useState<string>('');
  const [inspectingGoodie, setInspectingGoodie] = useState<HamperGoodie | null>(null);

  // Pre-curated Lookbook loader
  const handleLoadInspirationLook = (look: HamperInspirationLook) => {
    const targetBox = HAMPER_BOX_OPTIONS.find((b) => b.id === look.boxId) || HAMPER_BOX_OPTIONS[0];
    setSelectedBox(targetBox);

    const targetTag = HAMPER_LID_TAGS.find((t) => t.id === look.lidTagId) || HAMPER_LID_TAGS[0];
    setSelectedLidTag(targetTag);

    const newItems: { goodie: HamperGoodie; quantity: number }[] = [];
    look.includedGoodieIds.forEach((id) => {
      const goodie = HAMPER_GOODIES.find((g) => g.id === id);
      if (goodie) {
        newItems.push({ goodie, quantity: 1 });
      }
    });
    setSelectedGoodies(newItems);

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#F7CAD0', '#B76E79', '#D5B68D', '#FAF6F0'],
    });
    setIsBoxBouncing(true);
    setTimeout(() => setIsBoxBouncing(false), 500);

    boxDropZoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Toggle goodie from the gallery showcase
  const handleToggleGoodieFromGallery = (
    goodie: HamperGoodie,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    const isAlreadyIn = selectedGoodies.some((g) => g.goodie.id === goodie.id);
    if (isAlreadyIn) {
      setSelectedGoodies((prev) => prev.filter((g) => g.goodie.id !== goodie.id));
    } else {
      setIsBoxBouncing(true);
      setTimeout(() => setIsBoxBouncing(false), 400);

      setSelectedGoodies((prev) => [...prev, { goodie, quantity: 1 }]);

      if (goodie.id === 'g-small-note') {
        setNoteType('scroll');
        setIsNoteModalOpen(true);
      } else if (goodie.id === 'g-greeting-card') {
        setNoteType('greeting');
        setIsNoteModalOpen(true);
      } else if (goodie.id === 'g-newspaper-card') {
        setNoteType('newspaper');
        setIsNoteModalOpen(true);
      }
    }
  };

  // Only authentic items with genuine user-uploaded photos for the gallery showcase
  // Excludes items without user photos (5th hoops, 7th claw, greeting card, newspaper card, etc.)
  const galleryGoodies = HAMPER_GOODIES.filter((g) => {
    return (
      g.id !== 'g-hoops' &&
      g.id !== 'g-claw' &&
      g.id !== 'g-chocolates' &&
      g.id !== 'g-small-note' &&
      g.id !== 'g-presson-nails' &&
      g.id !== 'g-greeting-card' &&
      g.id !== 'g-newspaper-card'
    );
  });

  const filteredGoodies = galleryGoodies.filter((g) => {
    if (gallerySearchQuery.trim()) {
      const q = gallerySearchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      if (!matchName) return false;
    }

    if (activeGalleryCategory === 'all') return true;
    if (activeGalleryCategory === 'jewelry') return g.category === 'jewelry';
    if (activeGalleryCategory === 'accessory') return g.category === 'accessory';
    if (activeGalleryCategory === 'keepsake') return g.category === 'keepsake';
    return true;
  });

  // Interactive Product Click Handler: Trigger flying animation into the center box
  const handleItemClick = (goodie: HamperGoodie, event: React.MouseEvent<HTMLElement>) => {
    const isAlreadyIn = selectedGoodies.some((g) => g.goodie.id === goodie.id);

    if (isAlreadyIn) {
      // If already in hamper, remove it
      setSelectedGoodies((prev) => prev.filter((g) => g.goodie.id !== goodie.id));
      return;
    }

    // Launch Flying Projectile from clicked element to the center hamper box
    const boxEl = boxDropZoneRef.current;
    if (boxEl) {
      const boxRect = boxEl.getBoundingClientRect();
      const itemRect = event.currentTarget.getBoundingClientRect();

      const startX = itemRect.left + itemRect.width / 2 - 32;
      const startY = itemRect.top + itemRect.height / 2 - 32;
      const endX = boxRect.left + boxRect.width / 2 - 32;
      const endY = boxRect.top + boxRect.height / 2 - 32;

      const projectileId = `${goodie.id}-${Date.now()}`;
      const projectile: FlyingProjectile = {
        id: projectileId,
        image: goodie.image,
        startX,
        startY,
        endX,
        endY,
      };

      setFlyingProjectiles((prev) => [...prev, projectile]);

      // When the flying animation completes (500ms):
      setTimeout(() => {
        setFlyingProjectiles((prev) => prev.filter((p) => p.id !== projectileId));

        // Trigger satisfying box bounce
        setIsBoxBouncing(true);
        setTimeout(() => setIsBoxBouncing(false), 400);

        // Add item to hamper
        setSelectedGoodies((prev) => [...prev, { goodie, quantity: 1 }]);

        // If card or note was added, prompt message personalization
        if (goodie.id === 'g-small-note') {
          setNoteType('scroll');
          setIsNoteModalOpen(true);
        } else if (goodie.id === 'g-greeting-card') {
          setNoteType('greeting');
          setIsNoteModalOpen(true);
        } else if (goodie.id === 'g-newspaper-card') {
          setNoteType('newspaper');
          setIsNoteModalOpen(true);
        }
      }, 500);
    } else {
      setSelectedGoodies((prev) => [...prev, { goodie, quantity: 1 }]);
    }
  };

  const handleRemoveGoodie = (goodieId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedGoodies((prev) => prev.filter((g) => g.goodie.id !== goodieId));
  };

  const isGoodieInHamper = (goodieId: string) =>
    selectedGoodies.some((g) => g.goodie.id === goodieId);

  // Financial Calculations (Real-time live pricing)
  const boxPrice = selectedBox.price;
  const goodiesPrice = selectedGoodies.reduce(
    (sum, item) => sum + item.goodie.price * item.quantity,
    0
  );
  const hamperTotal = boxPrice + goodiesPrice;

  // Cozy Meter Math
  const totalItemCount = selectedGoodies.reduce((sum, item) => sum + item.quantity, 0);
  const cozyPercent = Math.min(Math.round((totalItemCount / 6) * 100), 100);

  const getCozyStatus = () => {
    if (totalItemCount === 0) return { label: 'Empty Box', color: 'text-taupe-500' };
    if (totalItemCount <= 2) return { label: 'Getting Started', color: 'text-amber-600' };
    if (totalItemCount <= 4) return { label: 'Looking Cozy & Full! ✨', color: 'text-roseGold' };
    if (totalItemCount <= 6) return { label: 'Perfect Luxury Bundle 🎁', color: 'text-emerald-700' };
    return { label: 'Grand Deluxe Hamper! 💖', color: 'text-purple-700' };
  };

  const hamperProduct = PRODUCTS.find((p) => p.id === 'prod-hamper-01') || PRODUCTS[4];

  // Complete & Order
  const handleCompleteHamper = (action: 'cart' | 'whatsapp') => {
    const hamperDetails: HamperSelection = {
      box: selectedBox,
      lidTag: selectedLidTag.label,
      items: selectedGoodies,
      card: {
        design:
          noteType === 'newspaper'
            ? 'Vintage Newspaper Card'
            : noteType === 'greeting'
            ? 'Floating Greeting Card'
            : 'Rolled Scroll Note',
        recipientName,
        message: cardMessage,
        senderName,
      },
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F7CAD0', '#B76E79', '#D5B68D', '#FAF6F0'],
    });

    const createdItem = addToCart(
      hamperProduct,
      {
        id: `hamper-${selectedBox.id}-${Date.now()}`,
        name: `${selectedBox.name} [${selectedLidTag.label}] (${totalItemCount} items)`,
        price: hamperTotal,
      },
      {
        hamperDetails,
        uploadedPhotoCount: selectedGoodies.some(
          (g) => g.goodie.id === 'g-mini-frame' || g.goodie.id === 'g-newspaper-card'
        )
          ? 1
          : 0,
      },
      1
    );

    if (action === 'whatsapp') {
      sendWhatsAppOrder([createdItem]);
    }
  };

  // 10 items positioned around the box in an orbit matching the user's reference sketch:
  // 1. Top (12:00): Frame
  // 2. Top-Right (1:15): Pink Mirror
  // 3. Right-Upper (2:45): Kashmiri Silver Jumkhe
  // 4. Right-Lower (4:00): Kashmiri Dangles
  // 5. Bottom-Right (5:15): Silver Floral Hoops
  // 6. Bottom (6:00): Golden Charm Bangles
  // 7. Bottom-Left (7:15): Flower Hair Claw
  // 8. Left-Lower (8:30): Red Scrunchie
  // 9. Left-Upper (9:45): Salon Press-On Nails Set
  // 10. Top-Left (10:45): Rolled Scroll Note
  const orbitItems = [
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-mini-frame') || HAMPER_GOODIES[0],
      positionClass: 'top-2 left-1/2 -translate-x-1/2',
      delay: '0s',
      labelPosition: 'bottom',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-mirror') || HAMPER_GOODIES[1],
      positionClass: 'top-10 right-14 xl:right-20',
      delay: '0.3s',
      labelPosition: 'bottom',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-jhumkas') || HAMPER_GOODIES[2],
      positionClass: 'top-48 right-3 xl:right-8',
      delay: '0.6s',
      labelPosition: 'left',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-dangles') || HAMPER_GOODIES[3],
      positionClass: 'bottom-52 right-3 xl:right-8',
      delay: '0.9s',
      labelPosition: 'left',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-hoops') || HAMPER_GOODIES[4],
      positionClass: 'bottom-12 right-14 xl:right-20',
      delay: '1.2s',
      labelPosition: 'top',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-bangles') || HAMPER_GOODIES[5],
      positionClass: 'bottom-2 left-1/2 -translate-x-1/2',
      delay: '1.5s',
      labelPosition: 'top',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-claw') || HAMPER_GOODIES[6],
      positionClass: 'bottom-12 left-14 xl:left-20',
      delay: '1.8s',
      labelPosition: 'top',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-scrunchie') || HAMPER_GOODIES[7],
      positionClass: 'bottom-52 left-3 xl:left-8',
      delay: '2.1s',
      labelPosition: 'right',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-presson-nails') || HAMPER_GOODIES[8],
      positionClass: 'top-48 left-3 xl:left-8',
      delay: '2.4s',
      labelPosition: 'right',
    },
    {
      goodie: HAMPER_GOODIES.find((g) => g.id === 'g-small-note') || HAMPER_GOODIES[9],
      positionClass: 'top-10 left-14 xl:left-20',
      delay: '2.7s',
      labelPosition: 'bottom',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F4] via-[#FDF5F7] to-[#FAF8F5] pb-36 pt-4 sm:pt-6 relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* FLYING PROJECTILES LAYER (ANIMATES FLYING ACROSS THE SCREEN INTO BOX)     */}
      {/* ========================================================================= */}
      {flyingProjectiles.map((proj) => (
        <div
          key={proj.id}
          className="fixed z-50 pointer-events-none w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-roseGold bg-white p-1"
          style={
            {
              left: `${proj.startX}px`,
              top: `${proj.startY}px`,
              animation: 'flyToBox 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              '--target-x': `${proj.endX - proj.startX}px`,
              '--target-y': `${proj.endY - proj.startY}px`,
            } as any
          }
        >
          <img src={proj.image} alt="flying product" className="w-full h-full object-contain" />
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-rose-200/60 pb-3">
          <button
            type="button"
            onClick={onBackToShop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-taupe-300 bg-white hover:bg-cream-100 text-charcoal text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-taupe-600" />
            <span>Back to Shop</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-roseGold">
              ★ I N T E R A C T I V E &nbsp; H A M P E R &nbsp; S T U D I O ★
            </span>
            <h1 className="font-serif text-lg sm:text-2xl md:text-3xl text-charcoal font-bold">
              Build Your Dream Hamper
            </h1>
          </div>

          <div className="flex items-center gap-2 text-right">
            <button
              type="button"
              onClick={() => gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-roseGold hover:text-charcoal bg-white/90 hover:bg-blush-50 px-3 py-1.5 rounded-full border border-roseGold/30 transition shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Hamper Gallery ↓</span>
            </button>
            <span className="text-xs font-bold text-roseGold bg-blush-100 px-2.5 py-1 rounded-full border border-roseGold/30">
              {totalItemCount} Items Packed
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SELECT BOX FOUNDATION (APPEARS AT THE TOP)                       */}
        {/* ========================================================================= */}
        <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-6 border border-rose-200/80 shadow-soft max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold block">
                Step 1 • Select Your Hamper Box
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-charcoal">
                Choose Your Box Style
              </h2>
            </div>
            <p className="text-xs text-charcoal/70 sm:text-right">
              Selected box opens below with all floating products ready to pack!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HAMPER_BOX_OPTIONS.map((box) => {
              const isSelected = selectedBox.id === box.id;
              return (
                <div
                  key={box.id}
                  onClick={() => setSelectedBox(box)}
                  className={`rounded-2xl p-3.5 sm:p-4 border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 group ${
                    isSelected
                      ? 'border-roseGold bg-blush-50/80 shadow-md ring-4 ring-roseGold/20'
                      : 'border-taupe-200 bg-[#FAF8F5] hover:border-roseGold-light'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-taupe-200/60 p-1 flex items-center justify-center">
                    <img src={box.image} alt={box.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-charcoal border border-taupe-200">
                        {box.id === 'box-cardboard' ? 'Popular Value' : 'Luxury Keepsake'}
                      </span>
                      <span className="font-sans font-bold text-base sm:text-lg text-roseGold tabular-nums">
                        {formatPrice(box.price)}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal mt-1 group-hover:text-roseGold transition-colors">
                      {box.name}
                    </h3>
                    <p className="text-[11px] text-charcoal/70 truncate mt-0.5">
                      {box.subtitle}
                    </p>
                    <div className="text-[10px] text-taupe-500 font-sans mt-0.5 flex items-center justify-between">
                      <span>{box.dimensions}</span>
                      <span className="font-bold text-roseGold">
                        {isSelected ? '✓ Selected' : 'Click to Pick'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Inside Lid Tag Selector + Cozy Meter */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-rose-200/70 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 justify-center w-full md:w-auto">
            <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider shrink-0">
              Inside Lid Tag:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 justify-center">
              {HAMPER_LID_TAGS.map((tag) => {
                const isSelected = selectedLidTag.id === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedLidTag(tag)}
                    className={`py-1 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                      isSelected
                        ? 'bg-charcoal text-white border-charcoal shadow-xs'
                        : 'bg-[#FAF8F5] text-charcoal/80 border-taupe-200 hover:bg-cream-100'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cozy Meter Status Bar */}
          {showCozyMeter && (
            <div className="flex items-center gap-2 w-full md:w-72">
              <div className="w-6 h-6 rounded-full bg-blush-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-roseGold" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <span className="font-bold text-charcoal">Cozy Meter</span>
                  <span className={`font-serif italic font-semibold ${getCozyStatus().color}`}>
                    {getCozyStatus().label}
                  </span>
                </div>
                <div className="w-full bg-taupe-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blush-400 via-roseGold to-charcoal h-full transition-all duration-500 rounded-full"
                    style={{ width: `${cozyPercent}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCozyMeter(false)}
                className="text-[10px] text-taupe-500 hover:text-charcoal px-1.5 py-0.5 rounded border border-taupe-200 transition cursor-pointer shrink-0"
              >
                Hide
              </button>
            </div>
          )}

          {!showCozyMeter && (
            <button
              type="button"
              onClick={() => setShowCozyMeter(true)}
              className="text-[10px] text-roseGold hover:underline font-semibold"
            >
              + Show Cozy Meter
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: THE HAMPER ORBIT STAGE (MATCHING USER SKETCH / CONCEPT MOCKUP)    */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FDE8EE] via-[#FAD3DE] to-[#FCECF0] border border-rose-300/60 shadow-luxury p-4 sm:p-8 overflow-hidden">
          {/* Subtle Ambient Floral & Petal Decorations */}
          <div className="absolute top-2 left-2 text-3xl opacity-30 select-none pointer-events-none">
            🌸
          </div>
          <div className="absolute top-2 right-2 text-3xl opacity-30 select-none pointer-events-none">
            🌸
          </div>
          <div className="absolute bottom-2 left-2 text-3xl opacity-30 select-none pointer-events-none">
            🌸
          </div>
          <div className="absolute bottom-2 right-2 text-3xl opacity-30 select-none pointer-events-none">
            🌸
          </div>

          {/* Interactive instruction banner */}
          <div className="text-center mb-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-xs font-bold text-roseGold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-roseGold" />
              <span>Click any floating product to fly it right into the hamper box!</span>
            </span>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* DESKTOP VIEW: FULL ORBITAL RING CANVAS (SCREENS >= 1024PX)            */}
          {/* --------------------------------------------------------------------- */}
          <div className="hidden lg:block relative w-full max-w-5xl mx-auto h-[780px]">
            {/* SVG Glowing Orbit Ring with cute hand-drawn hearts */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1024 780"
              preserveAspectRatio="none"
            >
              <ellipse
                cx="512"
                cy="390"
                rx="440"
                ry="320"
                fill="none"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              {/* Cute white heart accents along orbit */}
              <text x="512" y="55" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="880" y="240" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="960" y="440" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="780" y="680" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="512" y="730" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="240" y="680" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="70" y="440" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
              <text x="140" y="240" fill="rgba(255,255,255,0.9)" fontSize="16" textAnchor="middle">
                ♡
              </text>
            </svg>

            {/* ----------------------------------------------------------------- */}
            {/* 10 FLOATING ORBIT PRODUCTS (EXACTLY MATCHING USER'S SKETCH)       */}
            {/* ----------------------------------------------------------------- */}
            {orbitItems.map((item, idx) => {
              const inHamper = isGoodieInHamper(item.goodie.id);
              return (
                <div
                  key={item.goodie.id}
                  onClick={(e) => handleItemClick(item.goodie, e)}
                  className={`absolute z-30 cursor-pointer group animate-float-gentle transition-all duration-300 ${item.positionClass}`}
                  style={{ animationDelay: item.delay }}
                >
                  <div className="flex flex-col items-center">
                    {/* Floating Product Bubble */}
                    <div
                      className={`w-24 h-24 rounded-3xl p-1.5 bg-white/95 backdrop-blur-xs border-2 shadow-luxury transition-all duration-300 flex items-center justify-center relative group-hover:scale-110 group-hover:shadow-soft-lg ${
                        inHamper
                          ? 'border-roseGold ring-4 ring-roseGold/30 bg-blush-50'
                          : 'border-white/80 hover:border-roseGold'
                      }`}
                    >
                      <img
                        src={item.goodie.image}
                        alt={item.goodie.name}
                        className="w-full h-full object-contain rounded-2xl transition duration-300"
                      />

                      {/* Packed Checkmark Badge */}
                      {inHamper && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-roseGold text-white flex items-center justify-center text-xs shadow-md font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Product Name & Price Tag Below */}
                    <div
                      className={`mt-1.5 px-3 py-1 rounded-full text-center transition-all duration-300 shadow-sm border max-w-[170px] ${
                        inHamper
                          ? 'bg-roseGold text-white border-roseGold'
                          : 'bg-white/95 text-charcoal border-taupe-200 group-hover:bg-charcoal group-hover:text-white'
                      }`}
                    >
                      <h4 className="font-serif text-[11px] font-bold truncate">
                        {item.goodie.name}
                      </h4>
                      <div className="text-[10px] font-bold opacity-90 flex items-center justify-center gap-1">
                        <span>
                          {item.goodie.price === 0 ? 'FREE' : formatPrice(item.goodie.price)}
                        </span>
                        <span>•</span>
                        <span>{inHamper ? '✓ In Box' : '+ Pack'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ----------------------------------------------------------------- */}
            {/* THE CENTER HAMPER BOX: REAL 3D CORRUGATED CARDBOARD BOX           */}
            {/* ----------------------------------------------------------------- */}
            <div
              ref={boxDropZoneRef}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[440px] h-[395px] transition-all duration-300 ${
                isBoxBouncing ? 'animate-box-bounce scale-103' : ''
              }`}
            >
              {/* REAL CARDBOARD BOX OR HARDBOARD LUXURY BOX */}
              {selectedBox.id === 'box-cardboard' ? (
                <div className="relative w-full h-full">
                  {/* The Authentic 3D Open Cardboard Box Photo */}
                  <img
                    src="/hamper/real_cardboard_box_open.png"
                    alt="Authentic Cardboard Box"
                    className="w-full h-full object-contain filter drop-shadow-2xl select-none pointer-events-none"
                  />

                  {/* Inside Lid Tag Sticker - Stamped directly on the real cardboard flap */}
                  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-30">
                    <div
                      className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full font-serif font-bold text-xs shadow-md border border-white/60 bg-gradient-to-r ${selectedLidTag.previewClass}`}
                    >
                      <span className="text-sm">{selectedLidTag.icon}</span>
                      <span>{selectedLidTag.tagline}</span>
                    </div>
                  </div>

                  {/* Inside Box Cavity - Sitting neatly inside the open cardboard chamber */}
                  <div className="absolute top-[33%] inset-x-[11%] bottom-[6%] z-20 flex flex-col justify-between p-2 overflow-hidden">
                    {/* Pink Crinkle Shredded Bedding */}
                    <div className="absolute inset-0 bg-[radial-gradient(#F5D6CE_1.5px,transparent_1.5px)] [background-size:10px_10px] opacity-60 pointer-events-none rounded-b-xl" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-blush-200/50 to-transparent pointer-events-none rounded-b-xl" />

                    {/* Packed items grid inside the real box cavity */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                      {selectedGoodies.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-3">
                          <p className="font-serif italic text-xs font-semibold text-charcoal/80 bg-white/85 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-2xs">
                            Your Cardboard Box is open! Click items in orbit to pack.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5 max-h-[175px] overflow-y-auto pr-1 no-scrollbar pt-1">
                          {selectedGoodies.map(({ goodie }) => (
                            <div
                              key={goodie.id}
                              className="bg-white/95 backdrop-blur-xs rounded-xl p-1.5 border border-taupe-200 shadow-xs flex items-center gap-1.5 group animate-drop-into-box hover:border-roseGold transition relative"
                            >
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-taupe-200/50 p-0.5 flex items-center justify-center">
                                <img
                                  src={goodie.image}
                                  alt={goodie.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="font-serif text-[10px] font-bold text-charcoal truncate">
                                  {goodie.name}
                                </h5>
                                <span className="text-[9px] font-bold text-roseGold block">
                                  {goodie.price === 0 ? 'FREE' : formatPrice(goodie.price)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveGoodie(goodie.id, e)}
                                className="w-4 h-4 rounded-full bg-taupe-100 hover:bg-rose-500 hover:text-white text-taupe-600 flex items-center justify-center text-[9px] transition cursor-pointer shrink-0"
                                title="Remove from box"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Complimentary Rolled Scroll Note at the bottom */}
                      <div className="pt-1.5 flex items-center justify-between border-t border-taupe-300/60 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-lg mt-1">
                        <span className="text-[9px] font-semibold text-charcoal">
                          Rolled Scroll Note Included
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteType('scroll');
                            setIsNoteModalOpen(true);
                          }}
                          className="text-[9px] font-bold text-roseGold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* HARDBOARD LUXURY BOX STAGE */
                <div className="relative w-full h-full bg-[#3D141E] rounded-3xl p-4 border-4 border-[#B76E79] shadow-2xl flex flex-col justify-between overflow-hidden">
                  <div className="w-full bg-gradient-to-r from-[#591D2C] to-[#431621] rounded-2xl p-2 text-center border border-[#B76E79]/40 mb-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-serif font-bold text-xs shadow-md bg-gradient-to-r ${selectedLidTag.previewClass}`}
                    >
                      <span className="text-sm">{selectedLidTag.icon}</span>
                      <span>{selectedLidTag.tagline}</span>
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl bg-[#FFF8FA] p-3 shadow-inner relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#F5D6CE_1.5px,transparent_1.5px)] [background-size:10px_10px] opacity-40 pointer-events-none" />

                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                      {selectedGoodies.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-3">
                          <p className="font-serif italic text-xs font-semibold text-charcoal/80">
                            Hardboard Luxury Box ready! Click items in orbit to pack.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pr-1 no-scrollbar">
                          {selectedGoodies.map(({ goodie }) => (
                            <div
                              key={goodie.id}
                              className="bg-white/95 rounded-xl p-1.5 border border-taupe-200 shadow-xs flex items-center gap-1.5 group animate-drop-into-box hover:border-roseGold transition relative"
                            >
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 p-0.5 flex items-center justify-center">
                                <img
                                  src={goodie.image}
                                  alt={goodie.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="font-serif text-[10px] font-bold text-charcoal truncate">
                                  {goodie.name}
                                </h5>
                                <span className="text-[9px] font-bold text-roseGold block">
                                  {goodie.price === 0 ? 'FREE' : formatPrice(goodie.price)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveGoodie(goodie.id, e)}
                                className="w-4 h-4 rounded-full bg-taupe-100 hover:bg-rose-500 hover:text-white text-taupe-600 flex items-center justify-center text-[9px] transition cursor-pointer shrink-0"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-1.5 flex items-center justify-between border-t border-taupe-200 text-[9px] font-semibold text-charcoal">
                        <span>Complimentary Rolled Scroll Note Included</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteType('scroll');
                            setIsNoteModalOpen(true);
                          }}
                          className="text-[9px] font-bold text-roseGold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MOBILE / TABLET VIEW: STACKED CENTER BOX & FLOATING GALLERY (< 1024PX) */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:hidden space-y-6">
            {/* Real Center Cardboard Box on Mobile */}
            <div
              ref={boxDropZoneRef}
              className={`w-full max-w-sm mx-auto aspect-[440/395] relative transition-all duration-300 ${
                isBoxBouncing ? 'animate-box-bounce scale-103' : ''
              }`}
            >
              {selectedBox.id === 'box-cardboard' ? (
                <div className="relative w-full h-full">
                  <img
                    src="/hamper/real_cardboard_box_open.png"
                    alt="Authentic Cardboard Box"
                    className="w-full h-full object-contain filter drop-shadow-xl select-none pointer-events-none"
                  />

                  {/* Inside Lid Tag Sticker */}
                  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-30">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-serif font-bold text-[11px] shadow-md border border-white/60 bg-gradient-to-r ${selectedLidTag.previewClass}`}
                    >
                      <span>{selectedLidTag.icon}</span>
                      <span>{selectedLidTag.tagline}</span>
                    </div>
                  </div>

                  {/* Inside Box Cavity */}
                  <div className="absolute top-[33%] inset-x-[11%] bottom-[6%] z-20 flex flex-col justify-between p-1.5 overflow-hidden">
                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                      {selectedGoodies.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-2">
                          <p className="font-serif italic text-[11px] font-semibold text-charcoal/80 bg-white/85 px-3 py-1 rounded-full shadow-2xs">
                            Box open! Tap products below to pack.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1 max-h-[140px] overflow-y-auto no-scrollbar">
                          {selectedGoodies.map(({ goodie }) => (
                            <div
                              key={goodie.id}
                              className="bg-white/95 rounded-lg p-1 border border-taupe-200 flex items-center gap-1"
                            >
                              <img
                                src={goodie.image}
                                alt={goodie.name}
                                className="w-6 h-6 rounded object-contain shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h5 className="font-serif text-[9px] font-bold text-charcoal truncate">
                                  {goodie.name}
                                </h5>
                                <span className="text-[8px] font-bold text-roseGold">
                                  {goodie.price === 0 ? 'FREE' : formatPrice(goodie.price)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveGoodie(goodie.id, e)}
                                className="w-3.5 h-3.5 rounded-full bg-taupe-100 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[8px]"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between border-t border-taupe-300/60 bg-white/70 px-1.5 py-0.5 rounded text-[8px] text-charcoal">
                        <span>Rolled Scroll Note Included</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteType('scroll');
                            setIsNoteModalOpen(true);
                          }}
                          className="font-bold text-roseGold underline"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-[#3D141E] rounded-3xl p-3 border-2 border-[#B76E79] shadow-xl flex flex-col justify-between">
                  <div className="w-full bg-gradient-to-r from-[#591D2C] to-[#431621] rounded-xl p-1.5 text-center text-xs text-white">
                    <span>{selectedLidTag.icon}</span> <span>{selectedLidTag.tagline}</span>
                  </div>
                  <div className="flex-1 rounded-xl bg-[#FFF8FA] p-2 mt-2">
                    {selectedGoodies.length === 0 ? (
                      <p className="text-[11px] text-center text-charcoal pt-6">
                        Hardboard box ready! Tap products below.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 max-h-[140px] overflow-y-auto">
                        {selectedGoodies.map(({ goodie }) => (
                          <div
                            key={goodie.id}
                            className="bg-white rounded p-1 border border-taupe-200 flex items-center gap-1 text-[9px]"
                          >
                            <span className="truncate flex-1">{goodie.name}</span>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveGoodie(goodie.id, e)}
                              className="text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Floating Products Tray */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-roseGold" />
                  <span>Tap Products to Fly Into Box</span>
                </span>
                <span className="text-[10px] text-taupe-500">Swipe horizontal →</span>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 pt-1 px-1">
                {HAMPER_GOODIES.map((goodie) => {
                  const inHamper = isGoodieInHamper(goodie.id);
                  return (
                    <div
                      key={goodie.id}
                      onClick={(e) => handleItemClick(goodie, e)}
                      className={`shrink-0 w-36 bg-white/95 backdrop-blur-xs rounded-2xl p-2.5 border shadow-soft transition-all duration-300 cursor-pointer flex flex-col justify-between text-center relative ${
                        inHamper
                          ? 'border-roseGold ring-2 ring-roseGold/20 bg-blush-50/70'
                          : 'border-taupe-200 hover:border-roseGold'
                      }`}
                    >
                      {inHamper && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-roseGold text-white flex items-center justify-center text-[10px] font-bold shadow-xs z-10">
                          ✓
                        </span>
                      )}

                      <div className="space-y-1.5">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] border border-taupe-200/50 p-1 flex items-center justify-center">
                          <img
                            src={goodie.image}
                            alt={goodie.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h4 className="font-serif font-bold text-xs text-charcoal truncate">
                          {goodie.name}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-taupe-100 mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-roseGold">
                          {goodie.price === 0 ? 'FREE' : formatPrice(goodie.price)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inHamper ? 'bg-roseGold text-white' : 'bg-cream-100 text-charcoal'
                          }`}
                        >
                          {inHamper ? 'Packed' : '+ Fly In'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Keepsakes: Greeting Card & Vintage Newspaper Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-taupe-200/80 shadow-soft max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center text-roseGold shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal">
                Personalized Cards & Letter Notes
              </h3>
              <p className="text-xs text-charcoal/70">
                Included complimentary: Handwritten Rolled Scroll Note with red thread!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setNoteType('greeting');
                setIsNoteModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-taupe-300 hover:border-roseGold bg-[#FAF8F5] text-charcoal text-xs font-semibold transition cursor-pointer"
            >
              Floating Greeting Card (₹99)
            </button>
            <button
              type="button"
              onClick={() => {
                setNoteType('newspaper');
                setIsNoteModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-taupe-300 hover:border-roseGold bg-[#FAF8F5] text-charcoal text-xs font-semibold transition cursor-pointer"
            >
              Vintage Newspaper Card (₹149)
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HAMPER GALLERY & DETAILED SHOWCASE (CUSTOMER UNBOXING & SPECIFICATIONS)   */}
        {/* ========================================================================= */}
        <div
          ref={gallerySectionRef}
          className="pt-10 border-t-2 border-dashed border-rose-200/80 space-y-12"
        >
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-roseGold/10 text-roseGold text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hamper Gallery & Lookbook</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">
              Explore Our Real Hampers & Keepsakes
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              Every single piece is designed, hand-finished, and curated by our studio. Inspect
              detailed specs, materials, and real customer flatlays below.
            </p>
          </div>

          {/* 1. CURATED HAMPER INSPIRATION LOOKBOOK */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-taupe-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-roseGold uppercase tracking-wider block">
                  Studio Curations
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Complete Hamper Combinations
                </h3>
              </div>
              <p className="text-xs text-charcoal/60">
                Click "Load into Studio" to auto-fill the customizer above with any curated style!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HAMPER_INSPIRATION_LOOKS.map((look) => {
                const isLookActive =
                  selectedBox.id === look.boxId &&
                  look.includedGoodieIds.every((id) =>
                    selectedGoodies.some((g) => g.goodie.id === id)
                  );

                return (
                  <div
                    key={look.id}
                    className="bg-white rounded-3xl overflow-hidden border border-rose-200/80 shadow-soft hover:shadow-luxury transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Banner with Badges */}
                    <div className="relative h-60 sm:h-72 overflow-hidden bg-cream-100">
                      <img
                        src={look.image}
                        alt={look.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                      {/* Badge Top Left */}
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-charcoal text-[11px] font-bold tracking-wide shadow-sm">
                        {look.badge}
                      </span>

                      {/* Price Tag Top Right */}
                      <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-charcoal/90 backdrop-blur-xs text-white text-xs font-sans font-bold tabular-nums shadow-sm">
                        Total {formatPrice(look.price)}
                      </span>

                      {/* Title & Subtitle Banner */}
                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <h4 className="font-serif text-lg sm:text-xl font-bold drop-shadow-sm">
                          {look.title}
                        </h4>
                        <p className="text-xs text-white/90 line-clamp-1 drop-shadow-xs mt-0.5">
                          {look.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <p className="font-serif italic text-xs text-charcoal/80 leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-taupe-200/60">
                          "{look.highlight}"
                        </p>

                        {/* Included Goodies Pill List */}
                        <div>
                          <span className="text-[10px] font-bold text-taupe-500 uppercase tracking-wider block mb-1.5">
                            Included in this look:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {look.includedGoodieIds.map((goodieId) => {
                              const goodie = HAMPER_GOODIES.find((g) => g.id === goodieId);
                              if (!goodie) return null;
                              return (
                                <span
                                  key={goodieId}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-50 border border-taupe-200/80 text-charcoal text-[11px] font-medium"
                                >
                                  <img
                                    src={goodie.image}
                                    alt={goodie.name}
                                    className="w-3.5 h-3.5 object-contain rounded-full"
                                  />
                                  <span>{goodie.name}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-taupe-100 flex items-center justify-between gap-3">
                        <div className="text-[11px] text-taupe-500">
                          Box:{' '}
                          <span className="font-semibold text-charcoal">
                            {look.boxId === 'box-cardboard'
                              ? 'Normal Cardboard'
                              : 'Hardboard Luxury'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleLoadInspirationLook(look)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isLookActive
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-charcoal text-white hover:bg-roseGold'
                          }`}
                        >
                          {isLookActive ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Loaded in Studio</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Customize / Load This Look ↑</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. AUTHENTIC GOODIES PHOTO GALLERY */}
          <div ref={gallerySectionRef} className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-taupe-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-roseGold uppercase tracking-wider block">
                  Authentic Studio Lookbook
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Hamper Goodies Photo Gallery
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Authentic, unedited studio photographs of our handcrafted hamper items.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-taupe-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search jewelry, mirror, frame..."
                  value={gallerySearchQuery}
                  onChange={(e) => setGallerySearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-taupe-300 text-xs text-charcoal placeholder-taupe-400 focus:outline-none focus:ring-2 focus:ring-roseGold bg-white"
                />
                {gallerySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setGallerySearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-charcoal cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'All Photos', count: galleryGoodies.length },
                {
                  id: 'jewelry',
                  label: '💍 Handcrafted Jewelry',
                  count: galleryGoodies.filter((g) => g.category === 'jewelry').length,
                },
                {
                  id: 'accessory',
                  label: '🎀 Accessories',
                  count: galleryGoodies.filter((g) => g.category === 'accessory').length,
                },
                {
                  id: 'keepsake',
                  label: '🖼️ Keepsakes',
                  count: galleryGoodies.filter((g) => g.category === 'keepsake').length,
                },
              ].map((tab) => {
                const isActive = activeGalleryCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveGalleryCategory(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-charcoal text-white shadow-xs'
                        : 'bg-white text-charcoal/80 border border-taupe-200 hover:border-roseGold hover:text-roseGold'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-cream-100 text-taupe-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clean Photo Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGoodies.map((goodie) => {
                const displayImg = goodie.detailedImage || goodie.image;

                return (
                  <div
                    key={goodie.id}
                    className="bg-white rounded-2xl border border-taupe-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                  >
                    {/* Pristine Clean Photo (No Badges, No Text Overlay, No Buttons) */}
                    <div className="relative aspect-square bg-[#FAF8F5] overflow-hidden p-3 flex items-center justify-center">
                      <img
                        src={displayImg}
                        alt={goodie.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
                        loading="lazy"
                      />
                    </div>

                    {/* Minimalist, Clean Product Title */}
                    <div className="p-3 text-center border-t border-taupe-100 bg-white">
                      <h4 className="font-serif font-medium text-xs sm:text-sm text-charcoal group-hover:text-roseGold transition-colors line-clamp-1">
                        {goodie.name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredGoodies.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-taupe-200 p-8 space-y-3">
                <p className="text-sm text-charcoal/70">
                  No photos match "{gallerySearchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setGallerySearchQuery('');
                    setActiveGalleryCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold cursor-pointer"
                >
                  Reset Filter & Show All Photos
                </button>
              </div>
            )}
          </div>

          {/* 3. QUALITY, PACKAGING & UNBOXING GUARANTEE BANNER */}
          <div className="bg-gradient-to-r from-cream-100 via-[#FFF5F7] to-cream-100 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-soft">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold">
                Artisan Magz Quality Assurance
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                How Your Hamper Travels to You
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-roseGold/20 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-roseGold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-charcoal">
                  Crush-Proof Packaging
                </h4>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Every product is nestled in thick pink shredded paper, bubble wrapped, and
                  protected with rigid outer casing.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-roseGold/20 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-roseGold">
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-charcoal">
                  Pre-Dispatch Video / Photo
                </h4>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  We share high-definition photos and unboxing clips of your final curated hamper on
                  WhatsApp before sealing.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-roseGold/20 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-roseGold">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-charcoal">
                  Express Pan-India Delivery
                </h4>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Quick dispatch within 24-48 hours with real-time tracking links sent directly to
                  your phone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personalization Modal for Scroll Note / Cards */}
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-luxury border border-roseGold-light/40 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-taupe-200/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold">
                    Personalized Hamper Message
                  </span>
                  <h3 className="font-serif text-lg font-bold text-charcoal">
                    {noteType === 'newspaper'
                      ? 'Vintage Newspaper Card'
                      : noteType === 'greeting'
                      ? 'Floating Greeting Card'
                      : 'Rolled Handwritten Scroll Note'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-cream-100 hover:bg-roseGold hover:text-white flex items-center justify-center text-taupe-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Recipient Name / Nickname:
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold"
                    placeholder="e.g. My Favorite Human"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Your Personalized Message:
                  </label>
                  <textarea
                    rows={4}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold resize-none font-serif italic text-charcoal"
                    placeholder="Write your sweet words here..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Sender Name / Signature:
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold"
                    placeholder="e.g. Forever Yours ♡"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="w-full py-2.5 bg-charcoal hover:bg-roseGold text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Save & Tuck Inside Hamper ✓
              </button>
            </div>
          </div>
        )}

        {/* Quick View / Inspect Modal for any Goodie */}
        {inspectingGoodie && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-luxury border border-roseGold-light/40 overflow-hidden space-y-0 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-taupe-200/70">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-100 text-charcoal border border-taupe-200">
                    {inspectingGoodie.category}
                  </span>
                  {inspectingGoodie.tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      {inspectingGoodie.tag}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingGoodie(null)}
                  className="w-7 h-7 rounded-full bg-cream-100 hover:bg-roseGold hover:text-white flex items-center justify-center text-taupe-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                  <div className="aspect-square rounded-2xl bg-[#FAF8F5] border border-taupe-200 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={inspectingGoodie.detailedImage || inspectingGoodie.image}
                      alt={inspectingGoodie.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-sans font-bold text-roseGold tabular-nums">
                        {inspectingGoodie.price > 0
                          ? formatPrice(inspectingGoodie.price)
                          : 'Included with Hamper'}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                        {inspectingGoodie.name}
                      </h3>
                    </div>

                    <p className="text-xs text-charcoal/80 leading-relaxed">
                      {inspectingGoodie.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-taupe-200/60 text-xs">
                      {inspectingGoodie.material && (
                        <div className="flex items-center justify-between">
                          <span className="text-taupe-500">Material:</span>
                          <span className="font-semibold text-charcoal">
                            {inspectingGoodie.material}
                          </span>
                        </div>
                      )}
                      {inspectingGoodie.dimensions && (
                        <div className="flex items-center justify-between">
                          <span className="text-taupe-500">Dimensions:</span>
                          <span className="font-sans font-medium text-charcoal">
                            {inspectingGoodie.dimensions}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-taupe-500">Status in Hamper:</span>
                        <span
                          className={`font-bold ${
                            isGoodieInHamper(inspectingGoodie.id)
                              ? 'text-emerald-600'
                              : 'text-taupe-500'
                          }`}
                        >
                          {isGoodieInHamper(inspectingGoodie.id) ? '✓ Packed' : 'Not yet added'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                {inspectingGoodie.specs && inspectingGoodie.specs.length > 0 && (
                  <div className="space-y-2 bg-[#FAF8F5] p-4 rounded-2xl border border-taupe-200/70">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      Craftsmanship & Key Details
                    </h4>
                    <ul className="space-y-1.5 text-xs text-charcoal/80">
                      {inspectingGoodie.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-roseGold font-bold text-sm leading-none">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-taupe-200/70 bg-[#FAF8F5] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setInspectingGoodie(null)}
                  className="px-4 py-2 rounded-xl border border-taupe-300 text-xs font-bold text-charcoal hover:bg-white transition cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleToggleGoodieFromGallery(inspectingGoodie);
                    setInspectingGoodie(null);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-soft cursor-pointer flex items-center gap-1.5 ${
                    isGoodieInHamper(inspectingGoodie.id)
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-charcoal hover:bg-roseGold text-white'
                  }`}
                >
                  {isGoodieInHamper(inspectingGoodie.id) ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Remove from Hamper</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Pack into My Hamper Box</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM LIVE PRICING & CHECKOUT BAR                                 */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] text-taupe-600 block uppercase tracking-wider font-bold">
                Real-Time Hamper Total
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-xl sm:text-2xl font-bold text-charcoal tabular-nums">
                  {formatPrice(hamperTotal)}
                </span>
                <span className="text-xs text-taupe-500">
                  ({selectedBox.name} + {totalItemCount} items)
                </span>
              </div>
            </div>

            <span className="text-[11px] px-2.5 py-1 rounded-full bg-cream-100 text-charcoal font-semibold border border-taupe-200">
              Free Shipping Over ₹1499
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleCompleteHamper('cart')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Add Hamper to Cart</span>
            </button>

            <button
              type="button"
              onClick={() => handleCompleteHamper('whatsapp')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-soft hover:shadow-soft-lg cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Order via WhatsApp →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamperBuilder;
