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
  Eye,
  X,
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
  const [selectedOccasionId, setSelectedOccasionId] = useState<CustomOccasionId | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('mag-12p');
  const [selectedFormat, setSelectedFormat] = useState<'standard-a4' | 'mini-a5'>('standard-a4');
  const [selectedSpreadIds, setSelectedSpreadIds] = useState<string[]>([]);
  const [selectedAddOnId, setSelectedAddOnId] = useState<string>('none');
  const [pendingOccasionId, setPendingOccasionId] = useState<CustomOccasionId | null>(null);
  const [showOccasionChangeModal, setShowOccasionChangeModal] = useState<boolean>(false);
  const [targetFlipPage, setTargetFlipPage] = useState<number | undefined>(undefined);
  const [previewingTemplate, setPreviewingTemplate] = useState<SpreadTemplate | null>(null);
  const [previewingPackage, setPreviewingPackage] = useState<MagazinePackage | null>(null);

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

  // Randomise spreads selection (Matching reference Image 2)
  const handleRandomiseSpreads = () => {
    if (!selectedOccasionId || availableTemplates.length === 0) {
      showToast('Please choose an occasion first to randomise templates.', 'info');
      occasionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const shuffled = [...availableTemplates].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, requiredSpreadsCount).map((t) => t.id);
    setSelectedSpreadIds(picked);
    setTargetFlipPage(1);
    showToast(`🔀 Randomly selected ${picked.length} templates for you!`, 'success');
  };

  // Add Custom Magazine to Cart or Direct Checkout
  const handleAddToCartAndCheckout = (directCheckout = true) => {
    if (!selectedOccasionId) {
      showToast('Please choose an occasion for your magazine first in Step 1.', 'info');
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
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN BUILDER CONTAINER */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">

        {/* ========================================================================= */}
        {/* BOX 1: HOW IT WORKS (Compact Pink Box) */}
        {/* ========================================================================= */}
        <section
          id="how-it-works-box"
          className="rounded-3xl bg-[#963354] p-5 sm:p-7 text-white shadow-xl border border-white/10"
        >
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-roseGold-light/90 font-sans">
              The Process
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-sans mt-1 leading-relaxed">
              Follow these simple steps to build your custom magazine keepsake
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#963354] text-[11px] font-bold font-sans flex items-center justify-center tabular-nums">
                    1
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 font-sans">
                    Step 1
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-white mb-0.5">
                  Pick Occasion
                </h3>
                <p className="text-[11px] text-white/80 font-sans leading-tight">
                  Choose from 6 curated celebration themes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#963354] text-[11px] font-bold font-sans flex items-center justify-center tabular-nums">
                    2
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 font-sans">
                    Step 2
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-white mb-0.5">
                  Choose Pages
                </h3>
                <p className="text-[11px] text-white/80 font-sans leading-tight">
                  Select 8, 12, 16, or 20 total pages.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#963354] text-[11px] font-bold font-sans flex items-center justify-center tabular-nums">
                    3
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 font-sans">
                    Step 3
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-white mb-0.5">
                  Live 3D Spread
                </h3>
                <p className="text-[11px] text-white/80 font-sans leading-tight">
                  Watch pages fill dynamically in the flipbook.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#963354] text-[11px] font-bold font-sans flex items-center justify-center tabular-nums">
                    4
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 font-sans">
                    Step 4
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-white mb-0.5">
                  Pick Templates
                </h3>
                <p className="text-[11px] text-white/80 font-sans leading-tight">
                  Choose curated 2-page spreads or auto-randomise.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-white/15 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#963354] text-[11px] font-bold font-sans flex items-center justify-center tabular-nums">
                    5
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 font-sans">
                    Step 5
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-white mb-0.5">
                  Gifting &amp; Print
                </h3>
                <p className="text-[11px] text-white/80 font-sans leading-tight">
                  Add gift box or wax seal, review and order!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOX 2: CHOOSE YOUR OCCASION (Compact Pink Box) */}
        {/* ========================================================================= */}
        <section
          ref={occasionSectionRef}
          id="step-occasion-box"
          className="rounded-3xl bg-[#963354] p-5 sm:p-7 text-white shadow-xl border border-white/10 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/15 pb-3 gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80 font-sans">
                Step 1 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                What is your magazine for?
              </h2>
            </div>
            {currentOccasion ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-roseGold-light font-sans bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <Check className="w-3.5 h-3.5 text-white" />
                {currentOccasion.name} Selected
              </span>
            ) : (
              <span className="text-xs text-white/70 font-sans">
                Choose 1 celebration theme
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-sans max-w-2xl leading-relaxed">
            Select one occasion category. Each theme features hand-crafted, editorial-grade
            inside spread layouts tailored to your celebration.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CUSTOM_MAGAZINE_OCCASIONS.map((occ) => {
              const isSelected = selectedOccasionId === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleSelectOccasion(occ.id)}
                  className={`group relative text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between h-full cursor-pointer ${
                    isSelected
                      ? 'border-2 border-white ring-2 ring-white/50 bg-white/25 shadow-lg'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40'
                  }`}
                >
                  {occ.badge && (
                    <span
                      className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-sans ${
                        isSelected ? 'bg-white text-[#963354]' : 'bg-white/20 text-white'
                      }`}
                    >
                      {occ.badge}
                    </span>
                  )}

                  <div>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                        isSelected ? 'bg-white text-[#963354]' : 'bg-white/15 text-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>

                    <h3 className="font-serif font-bold text-sm text-white leading-tight">
                      {occ.name}
                    </h3>

                    <p className="text-[11px] text-white/80 mt-1 line-clamp-2 leading-tight font-sans">
                      {occ.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-semibold font-sans">
                    <span className={isSelected ? 'text-white font-bold' : 'text-white/70'}>
                      {isSelected ? 'Selected' : 'Choose'}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOX 3: CHOOSE YOUR PACKAGE / NUMBER OF PAGES (Pink Box - Image 1 Style) */}
        {/* ========================================================================= */}
        <section
          ref={sizeSectionRef}
          id="step-size-box"
          className="rounded-3xl bg-[#963354] p-5 sm:p-7 text-white shadow-xl border border-white/10 text-center space-y-4"
        >
          {/* Format Toggle Section */}
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80 font-sans block mb-2">
              CHOOSE YOUR FORMAT
            </span>
            <div className="inline-flex p-1 rounded-full bg-black/20 border border-white/20">
              <button
                type="button"
                onClick={() => setSelectedFormat('standard-a4')}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                  selectedFormat === 'standard-a4'
                    ? 'bg-white text-[#963354] font-bold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                STANDARD • A4
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('mini-a5')}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                  selectedFormat === 'mini-a5'
                    ? 'bg-white text-[#963354] font-bold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                MINI • A5
              </button>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Choose your package
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-sans mt-1">
              Pricing scales with page count. Front &amp; back covers included.
            </p>
          </div>

          {/* Packages 4-Column Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5 text-left">
            {CUSTOM_MAGAZINE_PACKAGES.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl border p-3 flex flex-col items-center justify-between transition-all bg-black/15 ${
                    isSelected
                      ? 'border-2 border-white ring-2 ring-white/50 bg-black/25 shadow-lg'
                      : 'border-white/20 hover:border-white/40 hover:bg-black/20'
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-[#963354] flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Thumbnail Preview Card */}
                  <div className="w-full aspect-[3/4] max-h-32 rounded-xl bg-amber-50/90 border border-amber-200/80 p-2 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#963354_1px,transparent_1px)] [background-size:8px_8px]" />
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#963354] uppercase tracking-wide relative z-10 leading-tight">
                      {pkg.totalPages} PAGES
                    </span>
                    <span className="text-[10px] font-sans font-semibold tracking-wider text-[#963354]/80 uppercase relative z-10">
                      MAGAZINE
                    </span>
                    <span className="text-[9px] text-charcoal/60 mt-1 relative z-10 font-sans">
                      {pkg.spreadsCount} Spreads
                    </span>
                  </div>

                  {/* Page Count */}
                  <span className="font-serif font-bold text-xs text-white uppercase tracking-wider mt-2.5">
                    {pkg.totalPages} PAGES
                  </span>

                  {/* White Rounded Price Tag Pill */}
                  <div className="mt-1.5 bg-white text-[#963354] font-bold text-xs sm:text-sm px-3.5 py-1 rounded-lg font-sans tabular-nums shadow-sm">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </div>

                  {/* Select & View Action Buttons */}
                  <div className="mt-3 flex items-center gap-1.5 w-full pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg)}
                      className={`flex-1 py-1.5 px-2 rounded-full text-[11px] font-sans font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-white text-[#963354] font-bold shadow-sm'
                          : 'border border-white/40 hover:border-white text-white hover:bg-white/10'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewingPackage(pkg)}
                      title="View package details"
                      className="p-1.5 rounded-full border border-white/40 hover:border-white text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-white/80 italic font-sans pt-1">
            more pages, more stories to tell
          </p>

          {/* Scroll Down to 3D Book & Pick Templates CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => bookSpreadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full max-w-md mx-auto py-3 px-6 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs tracking-wider uppercase border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Scroll Down To View 3D Book &amp; Pick Templates</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STAGE 4: INTERACTIVE 3D BOOK SPREAD (Directly below Number of Pages) */}
        {/* Dynamically scales to 8, 12, 16, or 20 pages; starts empty & fills up */}
        {/* ========================================================================= */}
        <section
          ref={bookSpreadSectionRef}
          id="interactive-3d-spread-stage"
          className="rounded-3xl bg-white border border-taupe-200/90 p-5 sm:p-8 shadow-soft"
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
                  ? `Currently showing empty layout. As you select templates in the pink box below, they will appear here in real-time!`
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
              <span className="text-[11px] text-charcoal/50">Click any spread to inspect in 3D</span>
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
        </section>

        {/* ========================================================================= */}
        {/* BOX 5: PICK YOUR TEMPLATES (Pink Box - Image 2 Style) */}
        {/* ========================================================================= */}
        <section
          ref={templatesSectionRef}
          id="step-templates-box"
          className="rounded-3xl bg-[#963354] p-5 sm:p-7 text-white shadow-xl border border-white/10 space-y-5"
        >
          {/* Header */}
          <div className="text-center max-w-xl mx-auto">
            <BookOpen className="w-6 h-6 text-white/90 mx-auto mb-1.5" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-widest text-white">
              RIGHT - LEFT SIDE TEMPLATES
            </h2>
            <p className="text-xs uppercase tracking-widest text-white/80 font-sans mt-1 tabular-nums">
              {selectedSpreadIds.length} OF {requiredSpreadsCount} SELECTED
            </p>

            {/* Randomise For Me Action Button */}
            <button
              type="button"
              onClick={handleRandomiseSpreads}
              className="mt-3.5 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white text-[#963354] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-cream-100 transition-all cursor-pointer active:scale-95"
            >
              <span>🔀 RANDOMISE FOR ME</span>
            </button>
          </div>

          {!selectedOccasionId ? (
            <div className="p-8 text-center rounded-2xl bg-white/10 border border-white/20">
              <BookOpen className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <p className="text-sm text-white/90 font-sans">
                Inside spread templates are filtered based on your occasion. Please{' '}
                <button
                  type="button"
                  onClick={() => {
                    occasionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white font-bold underline cursor-pointer hover:text-cream-100"
                >
                  choose an occasion in the box above
                </button>{' '}
                to reveal curated spread templates.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 2-Column Templates Grid (Image 2 style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                {availableTemplates.map((template) => {
                  const isSelected = selectedSpreadIds.includes(template.id);
                  const selectedOrder = selectedSpreadIds.indexOf(template.id);
                  const isFull = selectedSpreadIds.length >= requiredSpreadsCount;

                  return (
                    <div
                      key={template.id}
                      className={`relative rounded-2xl border p-3.5 sm:p-4 flex flex-col justify-between transition-all bg-black/15 ${
                        isSelected
                          ? 'border-2 border-white ring-2 ring-white/50 bg-black/25 shadow-lg'
                          : 'border-white/20 hover:border-white/40 hover:bg-black/20'
                      }`}
                    >
                      {/* Top: 2-Page Visual Spread Miniature */}
                      <div className="relative aspect-[16/10] bg-black/20 p-2 sm:p-2.5 rounded-xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-2 gap-1.5 h-full">
                          {/* Left Page */}
                          <div className="relative rounded overflow-hidden shadow-xs bg-white border border-white/10 group-hover:scale-[1.02] transition-transform">
                            <img
                              src={template.leftPageImage}
                              alt={template.leftPageTitle}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                              <span className="text-[7px] uppercase tracking-wider text-roseGold-light font-bold">
                                Left Page
                              </span>
                              <p className="text-[9px] font-bold text-white leading-tight truncate">
                                {template.leftPageTitle}
                              </p>
                            </div>
                          </div>

                          {/* Right Page */}
                          <div className="relative rounded overflow-hidden shadow-xs bg-white border border-white/10 group-hover:scale-[1.02] transition-transform">
                            <img
                              src={template.rightPageImage}
                              alt={template.rightPageTitle}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                              <span className="text-[7px] uppercase tracking-wider text-roseGold-light font-bold">
                                Right Page
                              </span>
                              <p className="text-[9px] font-bold text-white leading-tight truncate">
                                {template.rightPageTitle}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Spread Number & Selection Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="text-[9px] font-bold bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded shadow">
                            Template {String(template.spreadNumber).padStart(2, '0')}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <span className="text-[9px] font-bold bg-white text-[#963354] px-2 py-0.5 rounded-full shadow flex items-center gap-1 font-sans">
                              <Check className="w-3 h-3 stroke-[3]" /> Spread {selectedOrder + 1}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="mt-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                              Template {String(template.spreadNumber).padStart(2, '0')}: {template.name}
                            </h3>
                          </div>
                          <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1 leading-tight font-sans">
                            {template.subtitle}
                          </p>
                        </div>

                        {/* Action Buttons: Select & View */}
                        <div className="mt-3 pt-2 border-t border-white/15 flex items-center gap-2">
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={() => handleToggleTemplate(template)}
                              className="flex-1 py-1.5 px-3 rounded-full bg-white text-[#963354] text-xs font-bold font-sans flex items-center justify-center gap-1 shadow-sm hover:bg-cream-100 transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Selected (Spread {selectedOrder + 1})</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleTemplate(template)}
                              disabled={isFull}
                              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-sans font-semibold transition flex items-center justify-center gap-1 ${
                                isFull
                                  ? 'border border-white/20 text-white/40 cursor-not-allowed'
                                  : 'border border-white/50 hover:border-white text-white hover:bg-white/10 cursor-pointer'
                              }`}
                            >
                              {isFull ? (
                                'Slots Full'
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Select</span>
                                </>
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setPreviewingTemplate(template)}
                            className="py-1.5 px-3 rounded-full border border-white/40 hover:border-white text-white text-xs font-sans font-medium flex items-center justify-center gap-1 hover:bg-white/10 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion Banner */}
              {isComplete && (
                <div className="p-4 rounded-2xl bg-white text-[#963354] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#963354] text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#963354]">
                        Your magazine layout is complete!
                      </h4>
                      <p className="text-[11px] text-charcoal/80 font-sans mt-0.5">
                        All {requiredSpreadsCount} customizable spreads filled. Scroll down to add gifting upgrades &amp; checkout.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addOnsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-2 px-5 rounded-full bg-[#963354] hover:bg-[#852846] text-white text-xs font-bold shadow transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                  >
                    <span>Continue to Add-ons</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* BOX 6: ADD SOMETHING EXTRA? (ADD-ONS) */}
        {/* ========================================================================= */}
        <section ref={addOnsSectionRef} id="step-addons-box" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-taupe-200/60 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-roseGold font-sans">
                Step 4 of 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
                Add Something Extra?
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 font-sans">
              <Gift className="w-3.5 h-3.5 text-roseGold" />
              Optional Gifting Upgrades
            </span>
          </div>

          <p className="text-sm text-charcoal/70 max-w-2xl font-sans">
            Choose an optional presentation upgrade to turn your magazine into an unforgettable
            gifting moment. Select one or keep standard protective packaging.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CUSTOM_MAGAZINE_ADDONS.map((addon) => {
              const isSelected = selectedAddOnId === addon.id;
              return (
                <button
                  key={addon.id}
                  onClick={() => setSelectedAddOnId(addon.id)}
                  className={`group text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-roseGold bg-roseGold/5 shadow-md ring-1 ring-roseGold'
                      : 'border-taupe-200/80 bg-white hover:border-roseGold/50 hover:shadow-xs'
                  }`}
                >
                  {addon.badge && (
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ${
                        isSelected ? 'bg-roseGold text-white' : 'bg-blush-100 text-roseGold'
                      }`}
                    >
                      {addon.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-serif font-bold text-sm text-wine-900">
                      {addon.name}
                    </h3>

                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="font-serif text-lg font-bold text-wine-900 tabular-nums">
                        {addon.price === 0 ? 'Free' : `+₹${addon.price}`}
                      </span>
                      {addon.originalPrice && (
                        <span className="text-xs text-charcoal/50 line-through tabular-nums font-sans">
                          ₹{addon.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-charcoal/70 mt-1.5 font-sans leading-relaxed">
                      {addon.description}
                    </p>

                    <ul className="mt-2.5 space-y-1 text-[11px] text-charcoal/75 font-sans">
                      {addon.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-roseGold flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-taupe-200/40 flex items-center justify-between text-xs font-semibold font-sans">
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
          id="step-summary-box"
          className="bg-white rounded-3xl border border-taupe-200/80 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="border-b border-taupe-200/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-roseGold font-sans">
              Step 5 of 5
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
              Your Magazine Order Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Specification Breakdown */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl bg-[#FAF2EC]/50 border border-taupe-200/60 p-4 sm:p-5 space-y-3 font-sans">
                <div className="flex items-center justify-between text-sm py-1 border-b border-taupe-200/40">
                  <span className="text-charcoal/70">Occasion:</span>
                  <span className="font-bold text-wine-900 font-serif">
                    {currentOccasion ? currentOccasion.name : 'Not Selected'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm py-1 border-b border-taupe-200/40">
                  <span className="text-charcoal/70">Package / Format:</span>
                  <span className="font-bold text-wine-900">
                    {currentPackage.name} ({currentPackage.totalPages} Pages) • {selectedFormat === 'standard-a4' ? 'Standard A4' : 'Mini A5'}
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
                <div className="bg-white rounded-xl border border-taupe-200 p-3 space-y-1.5 text-xs text-charcoal/80 font-sans">
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
            <div className="rounded-2xl border border-roseGold/30 bg-[#FAF2EC]/40 p-5 sm:p-6 flex flex-col justify-between space-y-6">
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
                  ✨ High-resolution print preview &amp; photo uploads will be coordinated with our design team.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TEMPLATE PREVIEW MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl border border-taupe-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-taupe-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold font-sans">
                    Template {String(previewingTemplate.spreadNumber).padStart(2, '0')} Spread Preview
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-wine-900">
                    {previewingTemplate.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewingTemplate(null)}
                  className="w-8 h-8 rounded-full bg-taupe-100 hover:bg-taupe-200 text-charcoal flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2-Page Spread View */}
              <div className="grid grid-cols-2 gap-3 aspect-[16/10] bg-[#FAF2EC] p-3 rounded-2xl border border-taupe-200">
                <div className="relative rounded-lg overflow-hidden shadow-xs bg-white border border-taupe-200">
                  <img
                    src={previewingTemplate.leftPageImage}
                    alt={previewingTemplate.leftPageTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                    <span className="text-[9px] uppercase tracking-wider text-roseGold-light font-bold">
                      Left Page
                    </span>
                    <p className="text-xs font-bold text-white truncate">
                      {previewingTemplate.leftPageTitle}
                    </p>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden shadow-xs bg-white border border-taupe-200">
                  <img
                    src={previewingTemplate.rightPageImage}
                    alt={previewingTemplate.rightPageTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                    <span className="text-[9px] uppercase tracking-wider text-roseGold-light font-bold">
                      Right Page
                    </span>
                    <p className="text-xs font-bold text-white truncate">
                      {previewingTemplate.rightPageTitle}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-charcoal/80 font-sans leading-relaxed">
                {previewingTemplate.subtitle}
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-taupe-200">
                <button
                  type="button"
                  onClick={() => setPreviewingTemplate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/70 hover:bg-taupe-100 transition cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleTemplate(previewingTemplate);
                    setPreviewingTemplate(null);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow transition cursor-pointer flex items-center gap-1.5 ${
                    selectedSpreadIds.includes(previewingTemplate.id)
                      ? 'bg-roseGold text-white hover:bg-roseGold-dark'
                      : 'bg-wine-900 text-white hover:bg-wine-800'
                  }`}
                >
                  {selectedSpreadIds.includes(previewingTemplate.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Remove from Book</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select This Spread</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: PACKAGE PREVIEW MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewingPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-taupe-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-taupe-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-roseGold font-sans">
                    Package Details
                  </span>
                  <h3 className="font-serif font-bold text-xl text-wine-900">
                    {previewingPackage.name} Edition
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewingPackage(null)}
                  className="w-8 h-8 rounded-full bg-taupe-100 hover:bg-taupe-200 text-charcoal flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs text-charcoal/80">
                <div className="p-3.5 bg-[#FAF2EC] rounded-2xl space-y-1.5">
                  <p className="font-serif font-bold text-sm text-wine-900">
                    Total Pages: {previewingPackage.totalPages} Pages
                  </p>
                  <p className="text-charcoal/70">
                    Formula: (Total Pages - 2) / 2 = <strong>{previewingPackage.spreadsCount} Inside Spreads</strong>
                  </p>
                  <p className="text-charcoal/70">
                    Includes 1 Front Cover + 1 Back Cover + {previewingPackage.spreadsCount * 2} Interior Story Pages
                  </p>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-taupe-200">
                  <span className="font-medium text-charcoal">Package Price:</span>
                  <span className="font-serif font-bold text-xl text-wine-900 tabular-nums">
                    ₹{previewingPackage.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-taupe-200">
                <button
                  type="button"
                  onClick={() => setPreviewingPackage(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/70 hover:bg-taupe-100 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectPackage(previewingPackage);
                    setPreviewingPackage(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#963354] hover:bg-[#852846] text-white shadow transition cursor-pointer"
                >
                  Select Package
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: OCCASION CHANGE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showOccasionChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
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
                  Reset &amp; Change Occasion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
