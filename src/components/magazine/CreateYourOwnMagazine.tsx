import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  BookOpen,
  Gift,
  AlertCircle,
  ShoppingBag,
  Layers,
  ChevronRight,
  ChevronLeft,
  Info,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  CUSTOM_MAGAZINE_OCCASIONS,
  CUSTOM_MAGAZINE_PACKAGES,
  CUSTOM_MAGAZINE_ADDONS,
  CUSTOM_MAGAZINE_SPREADS,
  CustomOccasionId,
  OccasionOption,
  MagazinePackage,
  SpreadTemplate,
  CustomAddOn,
  calculateSpreadsCount,
} from '../../data/customMagazineTemplates';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { PRODUCTS } from '../../data/products';
import { CustomizationData } from '../../types/product';
import { BookPage } from '../../types/book';
import { InteractiveFlipBook } from '../book/InteractiveFlipBook';

interface CreateYourOwnMagazineProps {
  onBack: () => void;
  onCheckout: () => void;
}

export const CreateYourOwnMagazine: React.FC<CreateYourOwnMagazineProps> = ({
  onBack,
  onCheckout,
}) => {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  // State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('mag-12p');
  const [selectedOccasionId, setSelectedOccasionId] = useState<CustomOccasionId | null>(null);
  const [selectedSpreadIds, setSelectedSpreadIds] = useState<string[]>([]);
  const [selectedAddOnId, setSelectedAddOnId] = useState<string>('none');
  const [pendingOccasionId, setPendingOccasionId] = useState<CustomOccasionId | null>(null);
  const [showOccasionChangeModal, setShowOccasionChangeModal] = useState<boolean>(false);
  const [targetFlipPage, setTargetFlipPage] = useState<number | undefined>(undefined);

  // References for smooth scrolling
  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const bookSpreadSectionRef = useRef<HTMLDivElement>(null);
  const occasionSectionRef = useRef<HTMLDivElement>(null);
  const templatesSectionRef = useRef<HTMLDivElement>(null);
  const addOnsSectionRef = useRef<HTMLDivElement>(null);
  const summarySectionRef = useRef<HTMLDivElement>(null);

  // Selected Objects
  const currentOccasion = useMemo(() => {
    return CUSTOM_MAGAZINE_OCCASIONS.find((o) => o.id === selectedOccasionId) || null;
  }, [selectedOccasionId]);

  const currentPackage = useMemo(() => {
    return (
      CUSTOM_MAGAZINE_PACKAGES.find((p) => p.id === selectedPackageId) ||
      CUSTOM_MAGAZINE_PACKAGES[1]
    );
  }, [selectedPackageId]);

  const currentAddOn = useMemo(() => {
    return (
      CUSTOM_MAGAZINE_ADDONS.find((a) => a.id === selectedAddOnId) ||
      CUSTOM_MAGAZINE_ADDONS[0]
    );
  }, [selectedAddOnId]);

  // Available spread templates for current occasion
  const availableTemplates = useMemo(() => {
    if (!selectedOccasionId) return [];
    return CUSTOM_MAGAZINE_SPREADS[selectedOccasionId] || [];
  }, [selectedOccasionId]);

  // Required spreads count for the selected package
  const requiredSpreadsCount = currentPackage.spreadsCount;

  // Selected spread template objects in order
  const selectedSpreadTemplates = useMemo(() => {
    if (!selectedOccasionId) return [];
    const templateMap = new Map(availableTemplates.map((t) => [t.id, t]));
    return selectedSpreadIds
      .map((id) => templateMap.get(id))
      .filter((t): t is SpreadTemplate => Boolean(t));
  }, [selectedSpreadIds, availableTemplates, selectedOccasionId]);

  const isComplete = selectedSpreadIds.length === requiredSpreadsCount;
  const remainingSpreads = Math.max(0, requiredSpreadsCount - selectedSpreadIds.length);

  // Dynamic Book Pages for the 3D FlipBook
  // Dynamically matches the exact selected package size (8, 12, 16, or 20 pages)
  const dynamicBookPages = useMemo<BookPage[]>(() => {
    const totalPages = currentPackage.totalPages;
    const spreadsCount = currentPackage.spreadsCount;
    const pagesList: BookPage[] = [];

    // 1. Page 1: Fixed Front Cover
    pagesList.push({
      id: `custom-cover-front-${currentOccasion?.id || 'studio'}`,
      pageNumber: 1,
      side: 'standalone',
      templateId: 'cover',
      title: currentOccasion?.frontCoverTitle || 'Custom Keepsake Magazine',
      referenceImage: currentOccasion?.frontCoverImage || '/products/magazine_vogue_cover.jpg',
      photos: [],
      texts: [],
      decorations: {
        showFolio: false,
      },
    });

    // 2. Pages 2 to totalPages - 1: Inside Spreads (Pairs of Left & Right Pages)
    for (let sIdx = 0; sIdx < spreadsCount; sIdx++) {
      const leftPageNum = sIdx * 2 + 2;
      const rightPageNum = sIdx * 2 + 3;
      const template = selectedSpreadTemplates[sIdx];

      if (template) {
        // FILLED Left Page
        pagesList.push({
          id: `custom-spread-${sIdx + 1}-left-${template.id}`,
          pageNumber: leftPageNum,
          side: 'left',
          templateId: template.id,
          title: template.leftPageTitle,
          referenceImage: template.leftPageImage,
          photos: [],
          texts: [],
          decorations: {
            showFolio: true,
            folioText: `${template.name} • Spread ${sIdx + 1}`,
          },
        });

        // FILLED Right Page
        pagesList.push({
          id: `custom-spread-${sIdx + 1}-right-${template.id}`,
          pageNumber: rightPageNum,
          side: 'right',
          templateId: template.id,
          title: template.rightPageTitle,
          referenceImage: template.rightPageImage,
          photos: [],
          texts: [],
          decorations: {
            showFolio: true,
            folioText: `${template.name} • Spread ${sIdx + 1}`,
          },
        });
      } else {
        // EMPTY Left Page Slot
        pagesList.push({
          id: `custom-spread-${sIdx + 1}-left-empty`,
          pageNumber: leftPageNum,
          side: 'left',
          templateId: 'empty-slot',
          title: `Spread ${sIdx + 1} (Left Page)`,
          photos: [],
          texts: [],
          decorations: {
            showFolio: true,
            folioText: `Spread ${sIdx + 1} of ${spreadsCount}`,
          },
        });

        // EMPTY Right Page Slot
        pagesList.push({
          id: `custom-spread-${sIdx + 1}-right-empty`,
          pageNumber: rightPageNum,
          side: 'right',
          templateId: 'empty-slot',
          title: `Spread ${sIdx + 1} (Right Page)`,
          photos: [],
          texts: [],
          decorations: {
            showFolio: true,
            folioText: `Spread ${sIdx + 1} of ${spreadsCount}`,
          },
        });
      }
    }

    // 3. Page totalPages: Fixed Back Cover
    pagesList.push({
      id: `custom-cover-back-${currentOccasion?.id || 'studio'}`,
      pageNumber: totalPages,
      side: 'standalone',
      templateId: 'back-cover',
      title: 'Artisan Magz Studio Back Cover',
      referenceImage: currentOccasion?.backCoverImage || '/products/artisan_logo_horizontal.png',
      photos: [],
      texts: [],
      decorations: {
        showFolio: false,
      },
    });

    return pagesList;
  }, [currentPackage, currentOccasion, selectedSpreadTemplates]);

  // Pricing
  const basePrice = currentPackage.price;
  const addOnPrice = currentAddOn.price;
  const totalPrice = basePrice + addOnPrice;

  // Handle Package Selection (Step 1)
  const handleSelectPackage = (pkg: MagazinePackage) => {
    if (pkg.id === selectedPackageId) return;

    const newSpreadCount = pkg.spreadsCount;
    if (selectedSpreadIds.length > newSpreadCount) {
      // Trimming excess spreads
      const trimmed = selectedSpreadIds.slice(0, newSpreadCount);
      setSelectedSpreadIds(trimmed);
      showToast(
        `Switched to ${pkg.name}. Kept first ${newSpreadCount} spreads.`,
        'info'
      );
    } else {
      showToast(`Updated magazine size to ${pkg.name} (${pkg.totalPages} Pages).`, 'info');
    }
    setSelectedPackageId(pkg.id);
    setTargetFlipPage(0);
  };

  // Handle Occasion Selection (Step 2)
  const handleSelectOccasion = (occasionId: CustomOccasionId) => {
    if (selectedOccasionId === occasionId) return;

    if (selectedSpreadIds.length > 0) {
      setPendingOccasionId(occasionId);
      setShowOccasionChangeModal(true);
    } else {
      setSelectedOccasionId(occasionId);
      showToast(`Occasion set to ${CUSTOM_MAGAZINE_OCCASIONS.find(o => o.id === occasionId)?.name}!`, 'info');
    }
  };

  const confirmOccasionChange = () => {
    if (pendingOccasionId) {
      setSelectedOccasionId(pendingOccasionId);
      setSelectedSpreadIds([]);
      setPendingOccasionId(null);
      showToast('Occasion updated. Spread selections have been reset.', 'info');
    }
    setShowOccasionChangeModal(false);
  };

  const cancelOccasionChange = () => {
    setPendingOccasionId(null);
    setShowOccasionChangeModal(false);
  };

  // Handle Template Selection (Step 3)
  const handleToggleTemplate = (template: SpreadTemplate) => {
    const isAlreadySelected = selectedSpreadIds.includes(template.id);

    if (isAlreadySelected) {
      // Remove
      setSelectedSpreadIds((prev) => prev.filter((id) => id !== template.id));
      showToast(`Removed "${template.name}" from your layout.`, 'info');
    } else {
      // Add
      if (selectedSpreadIds.length >= requiredSpreadsCount) {
        showToast(
          `All ${requiredSpreadsCount} spread slots are full. Remove one to replace it.`,
          'info'
        );
        return;
      }
      const newIndex = selectedSpreadIds.length;
      setSelectedSpreadIds((prev) => [...prev, template.id]);
      showToast(`Added "${template.name}" to Spread ${newIndex + 1}!`, 'success');

      // Flip 3D viewer directly to the new spread (page 2*newIndex + 2)
      setTargetFlipPage(newIndex * 2 + 1);

      // If this completes the layout, smoothly scroll to completion/Add-ons
      if (newIndex + 1 === requiredSpreadsCount) {
        setTimeout(() => {
          addOnsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 600);
      }
    }
  };

  // Remove specific spread from layout
  const handleRemoveSpreadByIndex = (index: number) => {
    const removedTemplateId = selectedSpreadIds[index];
    const removedTemplate = availableTemplates.find((t) => t.id === removedTemplateId);
    setSelectedSpreadIds((prev) => prev.filter((_, i) => i !== index));
    if (removedTemplate) {
      showToast(`Removed "${removedTemplate.name}" from Spread ${index + 1}.`, 'info');
    }
  };

  // Add Custom Magazine to Cart or Direct Checkout
  const handleAddToCartAndCheckout = (directCheckout = true) => {
    if (!selectedOccasionId) {
      showToast('Please choose an occasion for your magazine first in Step 2.', 'info');
      occasionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isComplete) {
      showToast(
        `Please select all ${requiredSpreadsCount} spreads before checking out (${remainingSpreads} remaining).`,
        'info'
      );
      templatesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const baseProduct = PRODUCTS.find((p) => p.id === 'prod-mag-01') || PRODUCTS[0];
    const matchingVariant = baseProduct.variants.find((v) => v.id === currentPackage.id);

    const spreadNames = selectedSpreadTemplates.map(
      (t, idx) => `Spread ${idx + 1} (p.${idx * 2 + 2}-${idx * 2 + 3}): ${t.name}`
    );

    const customization: CustomizationData = {
      variantId: currentPackage.id,
      variantName: `${currentPackage.name} Edition`,
      format: 'standard-a4',
      selectedPages: currentPackage.totalPages,
      selectedTemplates: spreadNames,
      selectedTemplate: `Custom Built: ${currentOccasion?.name} Edition (${currentPackage.totalPages} Pages)`,
      occasion: `${currentOccasion?.name} Celebration`,
      headline: currentOccasion?.frontCoverTitle || 'Custom Editorial Keepsake',
      storyMessage: `Custom ${currentOccasion?.name} Magazine (${currentPackage.totalPages} Pages, ${requiredSpreadsCount} spreads)`,
      addOns: {
        giftWrap: selectedAddOnId === 'gift-box' || selectedAddOnId === 'combo',
        handwrittenLetter: selectedAddOnId === 'handwritten-letter' || selectedAddOnId === 'combo',
        combo: selectedAddOnId === 'combo',
      },
      addOnPrice: addOnPrice,
      specialInstructions: `Add-on: ${currentAddOn.name}. Sequence: Front Cover -> ${spreadNames.join(
        ' -> '
      )} -> Back Cover.`,
    };

    addToCart(baseProduct, matchingVariant, customization, 1);
    showToast('✨ Custom Magazine added to your bag!', 'success');

    if (directCheckout) {
      onCheckout();
    } else {
      openCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] pb-28 text-charcoal">
      {/* 1. Header & Navigation */}
      <section className="bg-gradient-to-b from-[#FAF2EC] to-[#FDFCF5] border-b border-taupe-200/60 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-wine-900/70 hover:text-wine-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-roseGold/10 text-roseGold border border-roseGold/20">
              <Sparkles className="w-3.5 h-3.5 text-roseGold" />
              Bespoke Magazine Studio
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-wine-900 tracking-tight leading-tight">
              Create Your Own Magazine
            </h1>
            <p className="mt-3 text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
              Choose your occasion, pick your pages, and build a magazine filled with your
              favourite memories.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* HOW IT WORKS PROCESS SECTION (Directly after heading & supporting text) */}
          {/* ========================================================================= */}
          <div className="mt-8 pt-8 border-t border-taupe-200/60">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 gap-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-roseGold" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-wine-900">
                  How It Works
                </h2>
              </div>
              <p className="text-xs text-charcoal/60 font-sans">
                Follow these 5 simple steps to craft your bespoke print keepsake
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Step 1 Card */}
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-taupe-200/80 shadow-2xs hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-roseGold text-white text-xs font-bold font-sans flex items-center justify-center tabular-nums">
                    1
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold font-sans">
                    Step 1
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-wine-900 mb-1">
                  Select Pages
                </h3>
                <p className="text-xs text-charcoal/70 font-sans leading-relaxed">
                  Choose 8, 12, 16, or 20 total pages for your custom magazine size.
                </p>
              </div>

              {/* Step 2 Card */}
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-taupe-200/80 shadow-2xs hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-roseGold text-white text-xs font-bold font-sans flex items-center justify-center tabular-nums">
                    2
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold font-sans">
                    Step 2
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-wine-900 mb-1">
                  Choose Occasion
                </h3>
                <p className="text-xs text-charcoal/70 font-sans leading-relaxed">
                  Pick Birthday, Couple, Friends, Wedding, Travel, or Just Because.
                </p>
              </div>

              {/* Step 3 Card */}
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-taupe-200/80 shadow-2xs hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-roseGold text-white text-xs font-bold font-sans flex items-center justify-center tabular-nums">
                    3
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold font-sans">
                    Step 3
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-wine-900 mb-1">
                  Pick Templates
                </h3>
                <p className="text-xs text-charcoal/70 font-sans leading-relaxed">
                  Select curated 2-page spreads that match your chosen total pages.
                </p>
              </div>

              {/* Step 4 Card */}
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-taupe-200/80 shadow-2xs hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-roseGold text-white text-xs font-bold font-sans flex items-center justify-center tabular-nums">
                    4
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold font-sans">
                    Step 4
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-wine-900 mb-1">
                  Add Gifting Extras
                </h3>
                <p className="text-xs text-charcoal/70 font-sans leading-relaxed">
                  Opt for a luxury gift box or wax-sealed letter for an unforgettable gift.
                </p>
              </div>

              {/* Step 5 Card */}
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-taupe-200/80 shadow-2xs hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-wine-900 text-white text-xs font-bold font-sans flex items-center justify-center tabular-nums">
                    5
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-wine-900 font-sans">
                    Step 5
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-wine-900 mb-1">
                  Live 3D Book &amp; Print
                </h3>
                <p className="text-xs text-charcoal/70 font-sans leading-relaxed">
                  Watch your book fill up in real time, place order, and we print &amp; deliver.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE YOUR MAGAZINE SIZE (NUMBER OF PAGES) */}
        {/* ========================================================================= */}
        <section ref={sizeSectionRef} id="step-1-size" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-taupe-200/60 pb-3 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold font-sans">
                Step 1 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                Choose Your Magazine Size
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 font-sans">
              <Layers className="w-3.5 h-3.5 text-roseGold" />
              Formula: (Total Pages - 2) / 2 spreads
            </span>
          </div>

          <p className="text-sm text-charcoal/70 max-w-3xl font-sans">
            Every magazine features <strong>2 fixed cover pages</strong> (1 Front Cover + 1 Back
            Cover). Inside pages are curated as <strong>2-page side-by-side spreads</strong>.
            Select your preferred length below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CUSTOM_MAGAZINE_PACKAGES.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`group text-left p-5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-roseGold bg-roseGold/5 shadow-md ring-1 ring-roseGold'
                      : 'border-taupe-200/80 bg-white hover:border-roseGold/50 hover:shadow-sm'
                  }`}
                >
                  {pkg.badge && (
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ${
                        isSelected ? 'bg-roseGold text-white' : 'bg-blush-100 text-roseGold'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-wine-900">
                      {pkg.name}
                    </h3>
                    <p className="text-xs font-bold text-roseGold uppercase tracking-wide mt-0.5 font-sans">
                      {pkg.spreadsCount} Customizable Spreads
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-wine-900 tabular-nums">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-charcoal/50 line-through tabular-nums font-sans">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-4 p-2.5 rounded-lg bg-[#FAF2EC] text-xs text-wine-900/80 leading-relaxed font-sans">
                      <p className="font-medium text-wine-900">
                        {pkg.spreadsCount} Spreads = {pkg.spreadsCount * 2} Inside Pages
                      </p>
                      <p className="text-[11px] text-charcoal/70 mt-0.5">
                        + 1 Front Cover + 1 Back Cover
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-taupe-200/40 flex items-center justify-between text-xs font-semibold font-sans">
                    <span className={isSelected ? 'text-roseGold font-bold' : 'text-charcoal/60'}>
                      {isSelected ? 'Active Selection' : 'Select Size'}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-roseGold" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* INTERACTIVE 3D BOOK SPREAD (Directly below Number of Pages option) */}
          {/* Dynamically scales to 8, 12, 16, or 20 pages; starts empty & fills up */}
          {/* ========================================================================= */}
          <div
            ref={bookSpreadSectionRef}
            className="mt-8 rounded-3xl bg-white border border-taupe-200/90 p-5 sm:p-8 shadow-soft"
          >
            {/* Header / Spread Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe-200/70 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-roseGold animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-roseGold font-sans">
                    Interactive 3D Book Spread
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mt-1">
                  {currentPackage.name} Magazine ({currentPackage.totalPages} Pages Spread)
                </h3>
                <p className="text-xs text-charcoal/70 mt-0.5 font-sans">
                  {selectedSpreadIds.length === 0
                    ? `Currently showing empty layout. As you select templates in Step 3, they will appear here in real-time!`
                    : `${selectedSpreadIds.length} of ${requiredSpreadsCount} inside spreads filled. Drag page corners or click arrows to flip!`}
                </p>
              </div>

              {/* Progress Counters & Bar */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-wine-900 font-sans tabular-nums">
                    {selectedSpreadIds.length} / {requiredSpreadsCount} Spreads Selected
                  </p>
                  <p className="text-[11px] text-charcoal/60 font-sans tabular-nums">
                    {selectedSpreadIds.length * 2 + 2} of {currentPackage.totalPages} Pages Filled
                  </p>
                </div>

                <div className="w-24 sm:w-32 bg-taupe-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-roseGold h-full transition-all duration-300"
                    style={{
                      width: `${(selectedSpreadIds.length / requiredSpreadsCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* The 3D Page-Flip Book Stage (Tu Chahiye Magazine component) */}
            <div className="py-4">
              <InteractiveFlipBook
                pages={dynamicBookPages}
                targetPage={targetFlipPage}
                isEditable={false}
              />
            </div>

            {/* Quick Spread Navigation Jump Pills */}
            <div className="mt-4 pt-4 border-t border-taupe-200/60">
              <div className="flex items-center justify-between text-xs text-charcoal/70 mb-2 font-sans">
                <span className="font-semibold text-wine-900">Jump to Spread:</span>
                <span className="text-[11px] text-charcoal/50">Click any spread to inspect</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-taupe-200">
                {/* Front Cover Button */}
                <button
                  type="button"
                  onClick={() => setTargetFlipPage(0)}
                  className="px-3 py-1.5 rounded-lg border border-taupe-200 bg-white hover:bg-cream-100 text-xs font-sans font-medium text-charcoal whitespace-nowrap cursor-pointer transition shadow-2xs active:scale-95"
                >
                  Page 1 (Front Cover)
                </button>

                {/* Inside Spreads Buttons */}
                {Array.from({ length: requiredSpreadsCount }).map((_, sIdx) => {
                  const isFilled = Boolean(selectedSpreadTemplates[sIdx]);
                  const leftP = sIdx * 2 + 2;
                  const rightP = sIdx * 2 + 3;
                  const targetPageIdx = sIdx * 2 + 1;

                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setTargetFlipPage(targetPageIdx)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-sans whitespace-nowrap cursor-pointer transition shadow-2xs active:scale-95 flex items-center gap-1.5 ${
                        isFilled
                          ? 'border-roseGold bg-roseGold/10 text-wine-900 font-semibold'
                          : 'border-dashed border-taupe-300 bg-white text-charcoal/60 hover:text-charcoal'
                      }`}
                    >
                      <span className="tabular-nums">Spread {sIdx + 1} (p.{leftP}–{rightP})</span>
                      {isFilled ? (
                        <Check className="w-3 h-3 text-roseGold" />
                      ) : (
                        <span className="text-[10px] text-rose-500 font-medium">Empty</span>
                      )}
                    </button>
                  );
                })}

                {/* Back Cover Button */}
                <button
                  type="button"
                  onClick={() => setTargetFlipPage(currentPackage.totalPages - 1)}
                  className="px-3 py-1.5 rounded-lg border border-taupe-200 bg-white hover:bg-cream-100 text-xs font-sans font-medium text-charcoal whitespace-nowrap cursor-pointer transition shadow-2xs active:scale-95"
                >
                  Page {currentPackage.totalPages} (Back Cover)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: CHOOSE YOUR OCCASION */}
        {/* ========================================================================= */}
        <section ref={occasionSectionRef} id="step-2-occasion" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-taupe-200/60 pb-3 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold font-sans">
                Step 2 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                What is your magazine for?
              </h2>
            </div>
            {currentOccasion && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-roseGold font-sans">
                <Check className="w-3.5 h-3.5 text-roseGold" />
                {currentOccasion.name} Selected
              </span>
            )}
          </div>

          <p className="text-sm text-charcoal/70 max-w-2xl font-sans">
            Select one occasion category. Each occasion features hand-crafted, editorial-grade
            inside spread layouts tailored to your celebration.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CUSTOM_MAGAZINE_OCCASIONS.map((occ) => {
              const isSelected = selectedOccasionId === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleSelectOccasion(occ.id)}
                  className={`group relative text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-full cursor-pointer ${
                    isSelected
                      ? 'border-roseGold bg-roseGold/5 shadow-md ring-1 ring-roseGold'
                      : 'border-taupe-200/80 bg-white hover:border-roseGold/50 hover:shadow-sm'
                  }`}
                >
                  {occ.badge && (
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ${
                        isSelected
                          ? 'bg-roseGold text-white'
                          : 'bg-taupe-100 text-charcoal/70 group-hover:bg-roseGold/10 group-hover:text-roseGold'
                      }`}
                    >
                      {occ.badge}
                    </span>
                  )}

                  <div>
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                        isSelected ? 'bg-roseGold text-white' : 'bg-blush-50 text-wine-900'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>

                    <h3 className="font-serif font-bold text-base text-wine-900 group-hover:text-roseGold transition-colors">
                      {occ.name}
                    </h3>

                    <p className="text-xs text-charcoal/70 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {occ.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-taupe-200/40 flex items-center justify-between text-xs font-semibold font-sans">
                    <span className={isSelected ? 'text-roseGold font-bold' : 'text-charcoal/60'}>
                      {isSelected ? 'Selected' : 'Choose'}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-roseGold" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: CHOOSE YOUR DESIGNS (INSIDE SPREADS) */}
        {/* ========================================================================= */}
        <section ref={templatesSectionRef} id="step-3-templates" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-taupe-200/60 pb-3 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold">
                Step 3 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                Choose Your Designs
              </h2>
            </div>

            {selectedOccasionId && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-roseGold/10 text-roseGold border border-roseGold/20 font-sans tabular-nums">
                  {selectedSpreadIds.length} of {requiredSpreadsCount} spreads selected
                </span>
              </div>
            )}
          </div>

          {!selectedOccasionId ? (
            <div className="p-8 text-center rounded-xl bg-white border border-taupe-200/80 shadow-sm">
              <BookOpen className="w-8 h-8 text-roseGold/60 mx-auto mb-2" />
              <p className="text-sm text-charcoal/70 font-sans">
                Inside spread templates are filtered based on your occasion. Please{' '}
                <button
                  onClick={() => {
                    occasionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-roseGold font-bold underline cursor-pointer"
                >
                  choose an occasion in Step 2
                </button>{' '}
                to reveal curated spread templates.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-charcoal/70 font-sans">
                Curated 2-page spreads for your <strong>{currentOccasion?.name}</strong> magazine.
                Each card shows the side-by-side layout (left & right page). Select{' '}
                <strong>{requiredSpreadsCount} spreads</strong> to complete your layout.
              </p>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTemplates.map((template) => {
                  const isSelected = selectedSpreadIds.includes(template.id);
                  const selectedOrder = selectedSpreadIds.indexOf(template.id);
                  const isFull = selectedSpreadIds.length >= requiredSpreadsCount;

                  return (
                    <div
                      key={template.id}
                      className={`group rounded-xl border transition-all overflow-hidden flex flex-col justify-between bg-white ${
                        isSelected
                          ? 'border-roseGold ring-1 ring-roseGold shadow-md'
                          : 'border-taupe-200/80 hover:border-roseGold/60 hover:shadow-md'
                      }`}
                    >
                      {/* Top: 2-Page Visual Spread Miniature */}
                      <div className="relative aspect-[16/10] bg-[#FAF2EC] p-3 border-b border-taupe-200/60">
                        {/* Side by side pages */}
                        <div className="grid grid-cols-2 gap-2 h-full">
                          {/* Left Page */}
                          <div className="relative rounded overflow-hidden shadow-sm bg-white border border-taupe-200 group-hover:scale-[1.02] transition-transform">
                            <img
                              src={template.leftPageImage}
                              alt={template.leftPageTitle}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-2 flex flex-col justify-end">
                              <span className="text-[8px] uppercase tracking-wider text-roseGold-light font-bold">
                                Left Page
                              </span>
                              <p className="text-[10px] font-bold text-white leading-tight truncate">
                                {template.leftPageTitle}
                              </p>
                            </div>
                          </div>

                          {/* Right Page */}
                          <div className="relative rounded overflow-hidden shadow-sm bg-white border border-taupe-200 group-hover:scale-[1.02] transition-transform">
                            <img
                              src={template.rightPageImage}
                              alt={template.rightPageTitle}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-2 flex flex-col justify-end">
                              <span className="text-[8px] uppercase tracking-wider text-roseGold-light font-bold">
                                Right Page
                              </span>
                              <p className="text-[10px] font-bold text-white leading-tight truncate">
                                {template.rightPageTitle}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Spread Number & Selection Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[9px] font-bold bg-white/90 text-wine-900 px-2 py-0.5 rounded shadow">
                            Design #{template.spreadNumber}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <span className="text-[9px] font-bold bg-roseGold text-white px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                              <Check className="w-3 h-3" /> Spread {selectedOrder + 1}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-serif font-bold text-base text-wine-900">
                            {template.name}
                          </h3>
                          <p className="text-xs text-charcoal/70 mt-1 leading-relaxed font-sans">
                            {template.subtitle}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {template.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-semibold bg-taupe-100 text-charcoal/70 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          {isSelected ? (
                            <button
                              onClick={() => handleToggleTemplate(template)}
                              className="w-full py-2.5 px-4 rounded-lg bg-roseGold text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-roseGold-dark transition-colors shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              Selected (Spread {selectedOrder + 1}) — Click to Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleTemplate(template)}
                              disabled={isFull}
                              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                isFull
                                  ? 'bg-taupe-100 text-charcoal/40 cursor-not-allowed'
                                  : 'bg-wine-900 text-white hover:bg-roseGold hover:shadow'
                              }`}
                            >
                              {isFull ? (
                                'All Slots Filled'
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  Select Spread
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion Banner */}
              {isComplete && (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-emerald-950">
                        Your magazine layout is complete!
                      </h4>
                      <p className="text-xs text-emerald-800 font-sans mt-0.5">
                        You have selected all {requiredSpreadsCount} customizable spreads for your{' '}
                        {currentPackage.name} magazine.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addOnsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-2.5 px-6 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Continue to Add-ons</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* STEP 4: ADD SOMETHING EXTRA? (ADD-ONS) */}
        {/* ========================================================================= */}
        <section ref={addOnsSectionRef} id="step-4-addons" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-taupe-200/60 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold">
                Step 4 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                Add Something Extra?
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70">
              <Gift className="w-3.5 h-3.5 text-roseGold" />
              Optional Gifting Upgrades
            </span>
          </div>

          <p className="text-sm text-charcoal/70 max-w-2xl font-sans">
            Choose an optional presentation upgrade to turn your magazine into an unforgettable
            gifting moment. Select one or keep standard protective packaging.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CUSTOM_MAGAZINE_ADDONS.map((addon) => {
              const isSelected = selectedAddOnId === addon.id;
              return (
                <button
                  key={addon.id}
                  onClick={() => setSelectedAddOnId(addon.id)}
                  className={`group text-left p-5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-roseGold bg-roseGold/5 shadow-md ring-1 ring-roseGold'
                      : 'border-taupe-200/80 bg-white hover:border-roseGold/50 hover:shadow-sm'
                  }`}
                >
                  {addon.badge && (
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-roseGold text-white' : 'bg-blush-100 text-roseGold'
                      }`}
                    >
                      {addon.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-serif font-bold text-base text-wine-900">
                      {addon.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-serif text-xl font-bold text-wine-900 tabular-nums">
                        {addon.price === 0 ? 'Free' : `+₹${addon.price}`}
                      </span>
                      {addon.originalPrice && (
                        <span className="text-xs text-charcoal/50 line-through tabular-nums">
                          ₹{addon.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-charcoal/70 mt-2 font-sans leading-relaxed">
                      {addon.description}
                    </p>

                    <ul className="mt-3 space-y-1.5 text-[11px] text-charcoal/75 font-sans">
                      {addon.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-roseGold flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-3 border-t border-taupe-200/40 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-roseGold font-bold' : 'text-charcoal/60'}>
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-roseGold" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 5: ORDER SUMMARY & CALL TO ACTION */}
        {/* ========================================================================= */}
        <section
          ref={summarySectionRef}
          id="step-5-summary"
          className="bg-white rounded-2xl border border-taupe-200/80 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="border-b border-taupe-200/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-roseGold">
              Step 5 of 5
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
              Your Magazine Order Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Specification Breakdown */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-xl bg-[#FAF2EC]/50 border border-taupe-200/60 p-4 sm:p-5 space-y-3 font-sans">
                <div className="flex items-center justify-between text-sm py-1 border-b border-taupe-200/40">
                  <span className="text-charcoal/70">Occasion:</span>
                  <span className="font-bold text-wine-900 font-serif">
                    {currentOccasion ? currentOccasion.name : 'Not Selected'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm py-1 border-b border-taupe-200/40">
                  <span className="text-charcoal/70">Package / Total Pages:</span>
                  <span className="font-bold text-wine-900">
                    {currentPackage.name} ({currentPackage.totalPages} Total Pages)
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm py-1 border-b border-taupe-200/40">
                  <span className="text-charcoal/70">Customizable Spreads:</span>
                  <span className="font-bold text-wine-900 tabular-nums">
                    {selectedSpreadIds.length} of {requiredSpreadsCount} Spreads Selected
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-charcoal/70">Packaging / Add-on:</span>
                  <span className="font-bold text-wine-900">
                    {currentAddOn.name}{' '}
                    {currentAddOn.price > 0 && `(+₹${currentAddOn.price})`}
                  </span>
                </div>
              </div>

              {/* Spread Sequence Manifest */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-wine-900">
                  Layout Page Breakdown ({currentPackage.totalPages} Pages Total):
                </h4>
                <div className="bg-white rounded-lg border border-taupe-200 p-3 space-y-1.5 text-xs text-charcoal/80 font-sans">
                  <div className="flex items-center justify-between py-1 border-b border-taupe-100">
                    <span className="font-medium text-wine-900">Page 1: [ FRONT COVER ]</span>
                    <span className="text-charcoal/60">
                      {currentOccasion?.frontCoverTitle || 'Pre-designed Front Cover'}
                    </span>
                  </div>

                  {Array.from({ length: requiredSpreadsCount }).map((_, idx) => {
                    const template = selectedSpreadTemplates[idx];
                    const leftPage = idx * 2 + 2;
                    const rightPage = idx * 2 + 3;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 border-b border-taupe-100"
                      >
                        <span className="font-medium text-charcoal">
                          Pages {leftPage}–{rightPage} (Spread {idx + 1}):
                        </span>
                        <span
                          className={
                            template ? 'text-wine-900 font-semibold' : 'text-rose-600 italic'
                          }
                        >
                          {template ? template.name : 'Slot Not Selected Yet'}
                        </span>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between py-1">
                    <span className="font-medium text-wine-900">
                      Page {currentPackage.totalPages}: [ BACK COVER ]
                    </span>
                    <span className="text-charcoal/60">
                      Artisan Magz Studio Back Cover
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Checkout CTA */}
            <div className="rounded-xl border border-roseGold/30 bg-[#FAF2EC]/40 p-5 sm:p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3 font-sans">
                <h4 className="font-serif font-bold text-lg text-wine-900">
                  Payment Summary
                </h4>

                <div className="space-y-2 text-xs pt-2 border-t border-taupe-200/60">
                  <div className="flex items-center justify-between text-charcoal/70">
                    <span>Base Magazine ({currentPackage.name})</span>
                    <span className="font-semibold text-charcoal tabular-nums">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal/70">
                    <span>Add-on ({currentAddOn.name})</span>
                    <span className="font-semibold text-charcoal tabular-nums">
                      {addOnPrice === 0 ? 'Free' : `₹${addOnPrice}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal/70">
                    <span>Standard Shipping</span>
                    <span className="font-semibold text-emerald-700">
                      {totalPrice >= 1499 ? 'Free Shipping 🚚' : '₹99 (Calculated at checkout)'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-taupe-200/80 flex items-baseline justify-between">
                  <span className="font-serif font-bold text-base text-wine-900">Total Price:</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-wine-900 tabular-nums">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-charcoal/60 font-sans">Includes all taxes</p>
                  </div>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleAddToCartAndCheckout(false)}
                  disabled={!isComplete}
                  className={`w-full py-3 px-5 rounded-xl font-semibold text-xs border-2 transition-all flex items-center justify-center gap-2 font-sans cursor-pointer ${
                    isComplete
                      ? 'border-charcoal bg-white text-charcoal hover:bg-cream-100'
                      : 'border-taupe-200 bg-taupe-50 text-charcoal/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCartAndCheckout(true)}
                  disabled={!isComplete}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 font-sans ${
                    isComplete
                      ? 'bg-roseGold hover:bg-roseGold-dark text-white hover:shadow-lg cursor-pointer'
                      : 'bg-taupe-200 text-charcoal/40 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4 text-roseGold-light" />
                  <span>Buy It Now &amp; Checkout</span>
                </button>

                {!isComplete && (
                  <p className="text-[11px] text-rose-600 text-center font-sans font-medium tabular-nums">
                    ⚠️ Complete all {requiredSpreadsCount} spreads to proceed ({remainingSpreads}{' '}
                    remaining)
                  </p>
                )}

                <p className="text-[11px] text-charcoal/60 text-center font-sans leading-tight">
                  ✨ High-resolution print preview & photo uploads will be coordinated with our design team.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* OCCASION CHANGE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showOccasionChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-taupe-200 space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <h3 className="font-serif font-bold text-lg text-wine-900">
                  Change Occasion Category?
                </h3>
              </div>

              <p className="text-xs text-charcoal/80 font-sans leading-relaxed">
                You have already selected <strong>{selectedSpreadIds.length} inside spreads</strong>.
                Changing your occasion to{' '}
                <strong>
                  {CUSTOM_MAGAZINE_OCCASIONS.find((o) => o.id === pendingOccasionId)?.name}
                </strong>{' '}
                will clear your current spread selections so you can pick from the new category.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-taupe-100">
                <button
                  onClick={cancelOccasionChange}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-charcoal/70 hover:bg-taupe-100 transition-colors"
                >
                  Keep Current
                </button>
                <button
                  onClick={confirmOccasionChange}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-roseGold hover:bg-roseGold-dark text-white shadow transition-colors"
                >
                  Reset & Change Occasion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
