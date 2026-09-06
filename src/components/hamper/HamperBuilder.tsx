import React, { useState } from 'react';
import { HAMPER_BOX_OPTIONS, HAMPER_GOODIES, PRODUCTS } from '../../data/products';
import { HamperBoxOption, HamperGoodie, HamperSelection } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import {
  Gift,
  Check,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Heart,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HamperBuilderProps {
  onBackToShop: () => void;
}

export const HamperBuilder: React.FC<HamperBuilderProps> = ({ onBackToShop }) => {
  const { addToCart, sendWhatsAppOrder } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Selected Box
  const [selectedBox, setSelectedBox] = useState<HamperBoxOption>(HAMPER_BOX_OPTIONS[0]);

  // Step 2: Selected Goodies with quantities
  const [selectedGoodies, setSelectedGoodies] = useState<
    { goodie: HamperGoodie; quantity: number }[]
  >([
    { goodie: HAMPER_GOODIES[0], quantity: 1 }, // Mulberry scrunchie
    { goodie: HAMPER_GOODIES[1], quantity: 1 }, // Kashmiri Jhumkas
    { goodie: HAMPER_GOODIES[2], quantity: 1 }, // Press-on Nails
    { goodie: HAMPER_GOODIES[3], quantity: 1 }, // Mini Frame
  ]);

  // Step 3: Greeting Card
  const [cardDesign, setCardDesign] = useState<string>('Floral Deckled Parchment');
  const [waxSealColor, setWaxSealColor] = useState<string>('Ruby Red');
  const [recipientName, setRecipientName] = useState<string>('My Favorite Person');
  const [senderName, setSenderName] = useState<string>('With Love');
  const [cardMessage, setCardMessage] = useState<string>(
    'Happy Anniversary to my favorite person in the world! You deserve all the little luxuries, sweet smiles, and pretty things today. Here is to making everyday as magical as the first day we met! 💖'
  );

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Goodie selection helpers
  const handleToggleGoodie = (goodie: HamperGoodie) => {
    const exists = selectedGoodies.find((g) => g.goodie.id === goodie.id);
    if (exists) {
      setSelectedGoodies((prev) => prev.filter((g) => g.goodie.id !== goodie.id));
    } else {
      setSelectedGoodies((prev) => [...prev, { goodie, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (goodieId: string, delta: number) => {
    setSelectedGoodies((prev) =>
      prev
        .map((item) => {
          if (item.goodie.id === goodieId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { goodie: HamperGoodie; quantity: number }[]
    );
  };

  const isGoodieSelected = (goodieId: string) =>
    selectedGoodies.some((g) => g.goodie.id === goodieId);

  // Financial tallies
  const boxPrice = selectedBox.price;
  const goodiesPrice = selectedGoodies.reduce(
    (sum, item) => sum + item.goodie.price * item.quantity,
    0
  );
  const cardPrice = 0; // Complimentary with every hamper!
  const hamperTotal = boxPrice + goodiesPrice + cardPrice;

  const hamperProduct = PRODUCTS.find((p) => p.id === 'prod-hamper-01') || PRODUCTS[4];

  const handleCompleteHamper = (action: 'cart' | 'whatsapp') => {
    const hamperDetails: HamperSelection = {
      box: selectedBox,
      items: selectedGoodies,
      card: {
        design: cardDesign,
        waxSealColor,
        recipientName,
        message: cardMessage,
        senderName,
      },
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f4b7bd', '#dd374e', '#d5b68d', '#fdfcf9'],
    });

    const createdItem = addToCart(
      hamperProduct,
      {
        id: `hamper-${selectedBox.id}`,
        name: `${selectedBox.name} (${selectedGoodies.length} items)`,
        price: hamperTotal,
      },
      {
        hamperDetails,
        uploadedPhotoCount: selectedGoodies.some((g) => g.goodie.id === 'g-mini-frame') ? 1 : 0,
      },
      1
    );

    if (action === 'whatsapp') {
      sendWhatsAppOrder([createdItem]);
    }
  };

  const goodieCategories = [
    { id: 'all', label: 'All Goodies' },
    { id: 'accessory', label: 'Hair & Charms' },
    { id: 'jewelry', label: 'Silver Jhumkas' },
    { id: 'beauty', label: 'Press-On Nails' },
    { id: 'keepsake', label: 'Mini Frames' },
    { id: 'treat', label: 'Candles & Sweets' },
  ];

  const filteredGoodies =
    activeCategory === 'all'
      ? HAMPER_GOODIES
      : HAMPER_GOODIES.filter((g) => g.category === activeCategory);

  const WAX_SEALS = [
    { name: 'Ruby Red', color: '#991b1b' },
    { name: 'Antique Gold', color: '#d97706' },
    { name: 'Sage Green', color: '#4d7c0f' },
    { name: 'Dusty Rose', color: '#db2777' },
    { name: 'Midnight Wine', color: '#4a044e' },
  ];

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-roseGold-light/40">
          <div>
            <button
              onClick={onBackToShop}
              className="text-xs text-wine-900/60 hover:text-blush-600 flex items-center gap-1 mb-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
            <h1 className="font-serif text-2xl sm:text-4xl text-wine-900 font-normal">
              Build Your Own Custom Hamper 🎀
            </h1>
            <p className="text-xs sm:text-sm text-wine-900/70 mt-1">
              Handpick the box style, fill it with your favorite goodies, and seal it with a handwritten wax note.
            </p>
          </div>

          {/* Dynamic Price Tally Card */}
          <div className="bg-white px-5 py-3 rounded-2xl border border-blush-200 shadow-soft flex items-center gap-4 self-start sm:self-auto">
            <div>
              <p className="text-[10px] text-wine-900/60 uppercase tracking-wider font-semibold">
                Live Hamper Total
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-wine-900 font-serif">
                  {formatPrice(hamperTotal)}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">
                  ({selectedGoodies.length} items inside)
                </span>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 bg-blush-600 hover:bg-blush-700 text-white rounded-xl text-xs font-semibold shadow transition"
            >
              Review Hamper
            </button>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="py-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto">
            {[
              { num: 1, label: 'Choose Box', desc: selectedBox.name.split(' ')[0] },
              { num: 2, label: 'Pick Goodies', desc: `${selectedGoodies.length} Selected` },
              { num: 3, label: 'Wax-Seal Card', desc: waxSealColor },
              { num: 4, label: 'Review & Add', desc: formatPrice(hamperTotal) },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition cursor-pointer ${
                    isActive
                      ? 'border-charcoal bg-blush-100/40 shadow-sm ring-2 ring-roseGold/20'
                      : isPast
                      ? 'border-sage-400 bg-sage-50 text-sage-900'
                      : 'border-taupe-200/60 bg-white/70 hover:border-roseGold'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive
                          ? 'bg-charcoal text-[#FDFCF5]'
                          : isPast
                          ? 'bg-sage-600 text-white'
                          : 'bg-cream-200 text-charcoal/70'
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3" /> : step.num}
                    </span>
                    <span className="text-xs font-bold text-charcoal hidden sm:inline">
                      {step.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-charcoal/60 mt-1 truncate pl-0.5">
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Interactive Customization Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* STEP 1: Select Box */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-charcoal font-semibold">
                    Step 1: Choose Your Keepsake Box Style
                  </h3>
                  <span className="text-xs text-charcoal/60">
                    All boxes include crinkle paper filler & ribbon
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HAMPER_BOX_OPTIONS.map((box) => {
                    const isSelected = selectedBox.id === box.id;
                    return (
                      <div
                        key={box.id}
                        onClick={() => setSelectedBox(box)}
                        className={`p-4 rounded-3xl border transition duration-200 cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'border-roseGold bg-blush-100/25 shadow-md ring-2 ring-roseGold/20'
                            : 'border-taupe-200/80 bg-white hover:border-roseGold'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100">
                            <img
                              src={box.image}
                              alt={box.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute top-2 right-2">
                              {isSelected ? (
                                <span className="w-6 h-6 rounded-full bg-roseGold text-white flex items-center justify-center shadow">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-white/80 border border-stone-300 flex items-center justify-center" />
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif text-base font-bold text-charcoal">
                                {box.name}
                              </h4>
                              <span className="font-bold text-sm text-roseGold">
                                {formatPrice(box.price)}
                              </span>
                            </div>
                            <p className="text-xs text-charcoal/65 mt-1">{box.subtitle}</p>
                            <p className="text-[10px] text-charcoal/50 mt-1 font-mono">
                              Dimensions: {box.dimensions}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-taupe-200/40 flex items-center justify-between text-xs">
                          <span className="text-charcoal/60">Selected packaging</span>
                          <button
                            type="button"
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isSelected
                                ? 'bg-roseGold text-white'
                                : 'bg-cream-100 text-charcoal/80 group-hover:bg-blush-100'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select Box'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-full text-xs sm:text-sm font-semibold shadow transition flex items-center gap-2"
                  >
                    <span>Proceed to Pick Goodies</span>
                    <ArrowRight className="w-4 h-4 text-roseGold-light" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Pick Goodies */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl text-charcoal font-semibold">
                      Step 2: Add Boutique Goodies To Your Box
                    </h3>
                    <p className="text-xs text-taupe-700 mt-0.5">
                      Toggle treats inside. Real-time box preview updates on the right!
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {goodieCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`text-[11px] px-3.5 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
                          activeCategory === cat.id
                            ? 'bg-charcoal text-[#FDFCF5] font-semibold shadow-sm'
                            : 'bg-cream-100/90 text-charcoal/80 border border-taupe-200/80 hover:bg-blush-100/60 hover:text-charcoal'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goodies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGoodies.map((goodie) => {
                    const selected = isGoodieSelected(goodie.id);
                    const selectedItem = selectedGoodies.find((g) => g.goodie.id === goodie.id);
                    const qty = selectedItem ? selectedItem.quantity : 0;

                    return (
                      <div
                        key={goodie.id}
                        className={`p-3.5 rounded-3xl border transition duration-200 flex flex-col justify-between ${
                          selected
                            ? 'border-roseGold bg-blush-100/25 shadow-luxury ring-1 ring-roseGold/30'
                            : 'border-taupe-200/80 bg-white hover:border-roseGold/60 hover:shadow-soft'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100/70">
                            <img
                              src={goodie.image}
                              alt={goodie.name}
                              className="w-full h-full object-cover"
                            />
                            {goodie.tag && (
                              <span className="absolute top-2 left-2 bg-[#FDFCF5]/95 text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-taupe-200/50">
                                {goodie.tag}
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-serif text-sm font-bold text-charcoal leading-snug">
                                {goodie.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-taupe-700 line-clamp-2 mt-1">
                              {goodie.description}
                            </p>
                            <p className="text-xs font-bold text-roseGold mt-1">
                              {formatPrice(goodie.price)}
                            </p>
                          </div>
                        </div>

                        {/* Action: Toggle or Qty */}
                        <div className="mt-3 pt-2.5 border-t border-taupe-200/60">
                          {selected ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-sage-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                                <span>In Hamper</span>
                              </span>
                              <div className="flex items-center gap-2 bg-white border border-roseGold/40 rounded-full px-2 py-0.5 shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(goodie.id, -1)}
                                  className="text-charcoal/70 hover:text-roseGold p-0.5"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-charcoal min-w-[14px] text-center">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(goodie.id, 1)}
                                  className="text-charcoal/70 hover:text-roseGold p-0.5"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleGoodie(goodie)}
                              className="w-full py-2 bg-cream-100 hover:bg-blush-100/70 text-charcoal border border-taupe-200/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-roseGold" />
                              <span>Add to Box</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 text-xs font-medium text-charcoal/70 hover:text-charcoal flex items-center gap-1 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Box</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-full text-xs sm:text-sm font-semibold shadow transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Card & Wax Seal</span>
                    <ArrowRight className="w-4 h-4 text-roseGold-light" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Wax-Seal Card & Note */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-serif text-xl text-charcoal font-semibold">
                    Step 3: Handwritten Greeting Note & Wax Seal
                  </h3>
                  <p className="text-xs text-taupe-700 mt-0.5">
                    We hand-transcribe your letter in elegant cursive and stamp it with an authentic hot wax seal.
                  </p>
                </div>

                {/* Wax seal color picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Select Wax Seal Color
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {WAX_SEALS.map((seal) => {
                      const isSelected = waxSealColor === seal.name;
                      return (
                        <button
                          key={seal.name}
                          type="button"
                          onClick={() => setWaxSealColor(seal.name)}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs transition cursor-pointer ${
                            isSelected
                              ? 'border-roseGold bg-blush-100/30 text-charcoal font-bold shadow-sm ring-1 ring-roseGold/40'
                              : 'border-taupe-200/80 bg-white text-charcoal/80 hover:border-roseGold/50'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full shadow-inner border border-black/10"
                            style={{ backgroundColor: seal.color }}
                          />
                          <span>{seal.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Note Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                        Recipient Name (To) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. My Dearest Riya"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full text-xs bg-white border border-taupe-200 rounded-xl px-3 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-roseGold/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                        Sender Sign-Off (From) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Yours Always, Kabir"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full text-xs bg-white border border-taupe-200 rounded-xl px-3 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-roseGold/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                      Heartfelt Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write your note here... (we transcribe this word-for-word onto luxury cotton paper)"
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      className="w-full text-xs bg-white border border-taupe-200 rounded-xl px-3 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-roseGold/40"
                    />
                  </div>
                </div>

                {/* Live Card Preview with Cursive Script */}
                <div className="p-6 bg-[#F9F7EF] rounded-3xl border border-taupe-200 shadow-inner relative overflow-hidden">
                  <div className="max-w-md mx-auto bg-[#FFFDF9] p-6 rounded-2xl shadow-luxury border border-taupe-200/60 space-y-3 relative">
                    {/* Wax seal stamp simulation */}
                    <div
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-[#FDFCF5] text-[10px] font-serif border border-white/40"
                      style={{
                        backgroundColor:
                          WAX_SEALS.find((s) => s.name === waxSealColor)?.color || '#991b1b',
                      }}
                    >
                      <span>A&R</span>
                    </div>

                    <p className="font-script text-xl text-charcoal">
                      Dear {recipientName || 'Love'},
                    </p>
                    <p className="font-script text-lg text-charcoal/90 leading-relaxed">
                      {cardMessage || 'Your sweet message will appear here in handwritten calligraphy.'}
                    </p>
                    <p className="font-script text-xl text-charcoal text-right pt-2">
                      {senderName || 'Forever & Always'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 text-xs font-medium text-charcoal/70 hover:text-charcoal flex items-center gap-1 cursor-pointer transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Goodies</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-full text-xs sm:text-sm font-semibold shadow transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Final Review & Checkout</span>
                    <ArrowRight className="w-4 h-4 text-roseGold-light" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Hamper */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl p-6 border border-taupe-200/80 shadow-luxury space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-taupe-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-roseGold uppercase tracking-wider">
                        Bespoke Hamper Ready
                      </span>
                      <h3 className="font-serif text-2xl text-charcoal font-bold">
                        {selectedBox.name}
                      </h3>
                    </div>
                    <span className="text-2xl font-bold font-serif text-charcoal">
                      {formatPrice(hamperTotal)}
                    </span>
                  </div>

                  {/* Hamper contents checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Hamper Inclusions ({selectedGoodies.length + 2} items):
                    </h4>

                    <div className="space-y-2 text-xs text-charcoal/80">
                      <div className="flex items-center justify-between p-2.5 bg-cream-50 rounded-xl border border-taupe-200/40">
                        <span className="font-medium">🎁 {selectedBox.name}</span>
                        <span className="font-bold text-charcoal">{formatPrice(selectedBox.price)}</span>
                      </div>

                      {selectedGoodies.map((item) => (
                        <div
                          key={item.goodie.id}
                          className="flex items-center justify-between p-2.5 bg-cream-50 rounded-xl border border-taupe-200/40"
                        >
                          <span className="font-medium">
                            🌸 {item.goodie.name} (x{item.quantity})
                          </span>
                          <span className="font-bold text-charcoal">
                            {formatPrice(item.goodie.price * item.quantity)}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between p-2.5 bg-[#E4F0E9] text-sage-900 rounded-xl border border-sage/40">
                        <span className="font-medium">
                          💌 Wax-Sealed Greeting Card ({waxSealColor} Wax)
                        </span>
                        <span className="font-bold text-sage-800">FREE</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Actions */}
                  <div className="pt-4 border-t border-taupe-200/60 space-y-3">
                    <button
                      type="button"
                      onClick={() => handleCompleteHamper('cart')}
                      className="w-full py-4 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl font-semibold text-sm shadow-luxury active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-roseGold-light" />
                      <span>Add Complete Hamper to Bag ({formatPrice(hamperTotal)})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteHamper('whatsapp')}
                      className="w-full py-3.5 bg-sage hover:bg-sage-600 text-charcoal rounded-2xl font-semibold text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant Order on WhatsApp 💬</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Box Simulation (Items nested inside) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-taupe-200/80 shadow-luxury space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-roseGold" />
                  <span>Visual Box Unboxing Preview</span>
                </span>
                <span className="text-[10px] bg-blush-100 text-charcoal px-2.5 py-0.5 rounded-full font-bold border border-roseGold/20">
                  {selectedGoodies.length} Items
                </span>
              </div>

              {/* Hamper Box Visual Container */}
              <div
                className="w-full aspect-[4/4] rounded-2xl p-3 flex flex-col justify-between relative shadow-inner border-2 overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: selectedBox.colorHex || '#fdfbf7',
                  borderColor: 'rgba(0,0,0,0.1)',
                }}
              >
                {/* Crinkle Paper Filler Background Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#b76e79_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none" />

                {/* Box Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-[#FDFCF5]/95 backdrop-blur-sm text-charcoal text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-taupe-200/50">
                    {selectedBox.name}
                  </span>
                  <span className="text-[9px] bg-charcoal text-[#FDFCF5] px-2 py-0.5 rounded-full font-medium">
                    {formatPrice(hamperTotal)}
                  </span>
                </div>

                {/* Items Inside Box Grid */}
                <div className="relative z-10 grid grid-cols-3 gap-1.5 my-auto">
                  {selectedGoodies.map((item) => (
                    <div
                      key={item.goodie.id}
                      className="aspect-square bg-white/95 backdrop-blur-sm p-1 rounded-xl shadow border border-taupe-200/50 flex flex-col items-center justify-center text-center transform hover:scale-105 transition"
                    >
                      <img
                        src={item.goodie.image}
                        alt={item.goodie.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                      />
                      <span className="text-[8px] font-bold text-charcoal truncate w-full mt-0.5">
                        {item.goodie.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}

                  {selectedGoodies.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-taupe-700 text-xs">
                      Box is currently empty! Add goodies from step 2.
                    </div>
                  )}
                </div>

                {/* Wax Seal Card Representation */}
                <div className="relative z-10 bg-white/95 p-1.5 rounded-xl shadow-sm border border-taupe-200/60 flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          WAX_SEALS.find((s) => s.name === waxSealColor)?.color || '#991b1b',
                      }}
                    />
                    <span className="truncate font-serif italic text-charcoal">
                      To: {recipientName}
                    </span>
                  </div>
                  <span className="text-[8px] text-sage-800 font-bold uppercase">Included</span>
                </div>
              </div>

              {/* Tally Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal/80 pt-2 border-t border-taupe-200/60">
                <div className="flex justify-between">
                  <span>Box Style:</span>
                  <span className="font-semibold text-charcoal">{formatPrice(selectedBox.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Goodies Subtotal:</span>
                  <span className="font-semibold text-charcoal">{formatPrice(goodiesPrice)}</span>
                </div>
                <div className="flex justify-between text-sage-800 font-medium">
                  <span>Wax-Sealed Card:</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-taupe-200/60 text-sm font-bold text-charcoal font-serif">
                  <span>Total Hamper Price:</span>
                  <span>{formatPrice(hamperTotal)}</span>
                </div>
              </div>

              {/* Progress CTA */}
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="w-full py-2.5 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-xl text-xs font-semibold shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-roseGold-light" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
