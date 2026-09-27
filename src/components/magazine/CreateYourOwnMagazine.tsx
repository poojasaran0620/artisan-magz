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
  Info,
  ExternalLink,
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

interface CreateYourOwnMagazineProps {
  onBack: () => void;
  onCheckout: () => void;
}

export const CreateYourOwnMagazine: React.FC<CreateYourOwnMagazineProps> = ({
  onBack,
  onCheckout,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // State
  const [selectedOccasionId, setSelectedOccasionId] = useState<CustomOccasionId | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('mag-12p');
  const [selectedSpreadIds, setSelectedSpreadIds] = useState<string[]>([]);
  const [selectedAddOnId, setSelectedAddOnId] = useState<string>('none');
  const [pendingOccasionId, setPendingOccasionId] = useState<CustomOccasionId | null>(null);
  const [showOccasionChangeModal, setShowOccasionChangeModal] = useState<boolean>(false);

  // References for smooth scrolling
  const previewSectionRef = useRef<HTMLDivElement>(null);
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

  // Pricing
  const basePrice = currentPackage.price;
  const addOnPrice = currentAddOn.price;
  const totalPrice = basePrice + addOnPrice;

  // Handle Occasion Selection
  const handleSelectOccasion = (occasionId: CustomOccasionId) => {
    if (selectedOccasionId === occasionId) return;

    if (selectedSpreadIds.length > 0) {
      setPendingOccasionId(occasionId);
      setShowOccasionChangeModal(true);
    } else {
      setSelectedOccasionId(occasionId);
    }
  };

  const confirmOccasionChange = () => {
    if (pendingOccasionId) {
      setSelectedOccasionId(pendingOccasionId);
      setSelectedSpreadIds([]);
      setPendingOccasionId(null);
      showToast('Occasion updated. Template selections have been reset.', 'info');
    }
    setShowOccasionChangeModal(false);
  };

  const cancelOccasionChange = () => {
    setPendingOccasionId(null);
    setShowOccasionChangeModal(false);
  };

  // Handle Package Selection
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
    }
    setSelectedPackageId(pkg.id);
  };

  // Handle Template Selection
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
      setSelectedSpreadIds((prev) => [...prev, template.id]);
      showToast(`Added "${template.name}" to Spread ${selectedSpreadIds.length + 1}!`, 'success');

      // If this completes the layout, smoothly scroll to completion/Add-ons
      if (selectedSpreadIds.length + 1 === requiredSpreadsCount) {
        setTimeout(() => {
          addOnsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
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

  // Add Custom Magazine to Cart
  const handleAddToCartAndCheckout = (directCheckout = true) => {
    if (!selectedOccasionId) {
      showToast('Please choose an occasion for your magazine first.', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE YOUR OCCASION */}
        {/* ========================================================================= */}
        <section id="step-1-occasion" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-taupe-200/60 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold">
                Step 1 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                What is your magazine for?
              </h2>
            </div>
            {currentOccasion && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-roseGold">
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
                  className={`group relative text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-full ${
                    isSelected
                      ? 'border-roseGold bg-roseGold/5 shadow-md ring-1 ring-roseGold'
                      : 'border-taupe-200/80 bg-white hover:border-roseGold/50 hover:shadow-sm'
                  }`}
                >
                  {occ.badge && (
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

                  <div className="mt-4 pt-3 border-t border-taupe-200/40 flex items-center justify-between text-xs font-semibold">
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
        {/* STEP 2: CHOOSE YOUR MAGAZINE SIZE */}
        {/* ========================================================================= */}
        <section id="step-2-package" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-taupe-200/60 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold">
                Step 2 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                Choose Your Magazine Size
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70">
              <Layers className="w-3.5 h-3.5 text-roseGold" />
              Formula: (Total Pages - 2) / 2 spreads
            </span>
          </div>

          <p className="text-sm text-charcoal/70 max-w-3xl font-sans">
            Every magazine features <strong>2 fixed cover pages</strong> (1 Front Cover + 1 Back
            Cover). Inside pages are curated as <strong>2-page side-by-side spreads</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CUSTOM_MAGAZINE_PACKAGES.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`group text-left p-5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-roseGold bg-roseGold/5 shadow-md ring-1 ring-roseGold'
                      : 'border-taupe-200/80 bg-white hover:border-roseGold/50 hover:shadow-sm'
                  }`}
                >
                  {pkg.badge && (
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                    <p className="text-xs font-bold text-roseGold uppercase tracking-wide mt-0.5">
                      {pkg.spreadsCount} Customizable Spreads
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-wine-900 tabular-nums">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-charcoal/50 line-through tabular-nums">
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

                  <div className="mt-5 pt-3 border-t border-taupe-200/40 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-roseGold font-bold' : 'text-charcoal/60'}>
                      {isSelected ? 'Active Package' : 'Select Package'}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-roseGold" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE MAGAZINE PREVIEW (CRITICAL VISUAL COMPONENT) */}
        {/* ========================================================================= */}
        <section
          ref={previewSectionRef}
          id="live-magazine-preview"
          className="bg-white rounded-2xl border border-taupe-200/80 p-5 sm:p-7 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-taupe-200/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-roseGold">
                  Live Magazine Preview
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-wine-900 mt-1">
                Your Magazine Layout Sequence
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-wine-900 font-sans">
                  {selectedSpreadIds.length} of {requiredSpreadsCount} Spreads Selected
                </p>
                <p className="text-[11px] text-charcoal/60 font-sans tabular-nums">
                  {selectedSpreadIds.length * 2 + 2} of {currentPackage.totalPages} Pages Filled
                </p>
              </div>

              {/* Visual Progress Bar */}
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

          {!selectedOccasionId || !currentOccasion ? (
            <div className="py-12 px-4 text-center rounded-xl bg-[#FAF2EC]/60 border border-dashed border-roseGold/30">
              <BookOpen className="w-10 h-10 text-roseGold/60 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-wine-900">
                Choose an Occasion to View Your Magazine Layout
              </h3>
              <p className="text-xs text-charcoal/70 mt-1 max-w-md mx-auto font-sans">
                Please select an occasion category above (Step 1) to generate your custom front cover,
                inside spreads, and back cover.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('step-1-occasion');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-roseGold hover:underline"
              >
                Go to Step 1 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div>
              {/* Horizontal Scrollable Spread Carousel */}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-taupe-200">
                {/* 1. FIXED FRONT COVER */}
                <div className="flex-shrink-0 w-44 sm:w-52 flex flex-col">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-wine-900/20 bg-taupe-100 shadow-sm group">
                    <img
                      src={currentOccasion.frontCoverImage}
                      alt={currentOccasion.frontCoverTitle}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between">
                      <span className="self-start text-[9px] font-bold bg-white/90 text-wine-900 px-2 py-0.5 rounded shadow">
                        Fixed Front Cover
                      </span>
                      <div>
                        <p className="text-[10px] text-white/80 font-sans">Page 1</p>
                        <h4 className="font-serif font-bold text-white text-xs sm:text-sm leading-tight">
                          {currentOccasion.frontCoverTitle}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-wine-900 text-center mt-2 font-serif">
                    [ FRONT COVER ]
                  </p>
                  <p className="text-[10px] text-charcoal/60 text-center font-sans">
                    Pre-designed Cover
                  </p>
                </div>

                {/* 2. CUSTOMIZABLE INSIDE SPREADS */}
                {Array.from({ length: requiredSpreadsCount }).map((_, spreadIdx) => {
                  const template = selectedSpreadTemplates[spreadIdx];
                  const spreadNum = spreadIdx + 1;
                  const leftPageNum = spreadIdx * 2 + 2;
                  const rightPageNum = spreadIdx * 2 + 3;

                  return (
                    <div key={`spread-slot-${spreadNum}`} className="flex-shrink-0 w-64 sm:w-72 flex flex-col">
                      {template ? (
                        // FILLED SPREAD
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border-2 border-roseGold bg-[#FAF2EC] shadow-sm flex flex-col justify-between p-2 group">
                          {/* Side by side mini pages */}
                          <div className="grid grid-cols-2 gap-1.5 h-full">
                            <div className="relative rounded overflow-hidden bg-white border border-taupe-200">
                              <img
                                src={template.leftPageImage}
                                alt={template.leftPageTitle}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute bottom-1 left-1 right-1 bg-black/60 rounded px-1 py-0.5 text-[8px] text-white truncate font-sans">
                                p.{leftPageNum} {template.leftPageTitle}
                              </div>
                            </div>

                            <div className="relative rounded overflow-hidden bg-white border border-taupe-200">
                              <img
                                src={template.rightPageImage}
                                alt={template.rightPageTitle}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute bottom-1 left-1 right-1 bg-black/60 rounded px-1 py-0.5 text-[8px] text-white truncate font-sans">
                                p.{rightPageNum} {template.rightPageTitle}
                              </div>
                            </div>
                          </div>

                          {/* Quick Remove Button */}
                          <button
                            onClick={() => handleRemoveSpreadByIndex(spreadIdx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 hover:bg-rose-50 text-charcoal/70 hover:text-rose-600 shadow transition-colors"
                            title="Remove this spread"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        // EMPTY SPREAD PLACEHOLDER
                        <button
                          onClick={() => {
                            templatesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="aspect-[16/10] rounded-lg border-2 border-dashed border-taupe-300 hover:border-roseGold bg-taupe-50/50 hover:bg-roseGold/5 transition-all flex flex-col items-center justify-center p-4 text-center group"
                        >
                          <div className="w-8 h-8 rounded-full bg-white group-hover:bg-roseGold group-hover:text-white text-roseGold flex items-center justify-center shadow-sm transition-colors mb-2">
                            <Plus className="w-4 h-4" />
                          </div>
                          <span className="font-serif font-bold text-xs sm:text-sm text-wine-900 group-hover:text-roseGold">
                            [+] Choose Design
                          </span>
                          <span className="text-[10px] text-charcoal/60 mt-0.5 font-sans">
                            Spread {spreadNum} (Pages {leftPageNum}–{rightPageNum})
                          </span>
                        </button>
                      )}

                      <p className="text-[11px] font-bold text-wine-900 text-center mt-2 font-serif truncate">
                        {template ? template.name : `[ Spread ${spreadNum} ]`}
                      </p>
                      <p className="text-[10px] text-charcoal/60 text-center font-sans">
                        Pages {leftPageNum} & {rightPageNum}
                      </p>
                    </div>
                  );
                })}

                {/* 3. FIXED BACK COVER */}
                <div className="flex-shrink-0 w-44 sm:w-52 flex flex-col">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-wine-900/20 bg-taupe-100 shadow-sm group">
                    <img
                      src={currentOccasion.backCoverImage}
                      alt="Back Cover"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between">
                      <span className="self-start text-[9px] font-bold bg-white/90 text-wine-900 px-2 py-0.5 rounded shadow">
                        Fixed Back Cover
                      </span>
                      <div>
                        <p className="text-[10px] text-white/80 font-sans">
                          Page {currentPackage.totalPages}
                        </p>
                        <h4 className="font-serif font-bold text-white text-xs sm:text-sm leading-tight">
                          Artisan Magz Studio
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-wine-900 text-center mt-2 font-serif">
                    [ BACK COVER ]
                  </p>
                  <p className="text-[10px] text-charcoal/60 text-center font-sans">
                    Pre-designed Back
                  </p>
                </div>
              </div>

              {/* Layout Helper Note */}
              <div className="mt-4 pt-3 border-t border-taupe-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/70 gap-2 font-sans">
                <span className="inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-roseGold" />
                  Inside spreads are displayed in the exact order selected below.
                </span>
                {isComplete ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> All {requiredSpreadsCount} Spreads Selected!
                  </span>
                ) : (
                  <span className="text-roseGold font-semibold">
                    {remainingSpreads} more {remainingSpreads === 1 ? 'spread' : 'spreads'} needed
                  </span>
                )}
              </div>
            </div>
          )}
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
              <p className="text-sm text-charcoal/70 font-sans">
                Templates are filtered based on your occasion. Please{' '}
                <button
                  onClick={() => {
                    const el = document.getElementById('step-1-occasion');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-roseGold font-bold underline"
                >
                  choose an occasion in Step 1
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
                    <p className="text-[10px] text-charcoal/60">Includes all taxes</p>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2.5">
                <button
                  onClick={() => handleAddToCartAndCheckout(true)}
                  disabled={!isComplete}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isComplete
                      ? 'bg-roseGold hover:bg-roseGold-dark text-white hover:shadow-lg'
                      : 'bg-taupe-200 text-charcoal/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Continue to Checkout</span>
                </button>

                {!isComplete && (
                  <p className="text-[11px] text-rose-600 text-center font-sans font-medium">
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
