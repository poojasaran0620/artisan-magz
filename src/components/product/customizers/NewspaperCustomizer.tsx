import React, { useState } from 'react';
import { Product, ProductVariant, CustomizationData } from '../../../types/product';
import { formatPrice } from '../../../utils/formatters';
import { Upload, Eye, Check, Sparkles, Newspaper, Calendar, MapPin } from 'lucide-react';

interface NewspaperCustomizerProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  customization: CustomizationData;
  onChange: (data: Partial<CustomizationData>) => void;
}

export const NewspaperCustomizer: React.FC<NewspaperCustomizerProps> = ({
  product,
  selectedVariant,
  onVariantChange,
  customization,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'inputs' | 'preview'>('inputs');

  const headline = customization.newspaperHeadline || 'BREAKING NEWS';
  const subheadline = customization.newspaperSubheadline || 'LOVE IS REAL!';
  const coupleNames = customization.coupleNames || 'Saral & Pakhhi';
  const anniversaryDate = customization.anniversaryDate || '17 OCT';
  const city = customization.city || 'Mumbai';
  const story =
    customization.articleStory ||
    `${coupleNames} aren't just a couple—they're each other's calm, chaos, and comfort. He brings her peace, she brings him purpose. He remembers the little things, she brews him coffee. They make his world warmer. Through storms, smiles, and endless phone calls—they're building forever. 🧿❤️`;

  const photo1 = customization.uploadedPhotos?.[0] || '/products/media_1788608467346.jpg';
  const photo2 = customization.uploadedPhotos?.[1] || '/products/media_1788608467334.jpg';

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const existing = customization.uploadedPhotos || [];
    const updated = [...existing];
    updated[slot] = url;
    onChange({
      uploadedPhotos: updated,
      uploadedPhotoCount: updated.filter(Boolean).length,
    });
  };

  return (
    <div className="space-y-6">
      {/* Variant Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 1: Select Newspaper Frame Edition
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariant.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onVariantChange(v)}
                className={`p-3 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blush-600 bg-blush-50/80 ring-2 ring-blush-500/20'
                    : 'border-roseGold-light/60 bg-white hover:border-blush-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-wine-900">{v.name.split('(')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blush-600" />}
                  </div>
                  <p className="text-[10px] text-wine-900/60 mt-0.5">{v.description}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-roseGold-light/30">
                  <span className="text-xs font-bold text-blush-700">{formatPrice(v.price)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs for Form vs Live Preview */}
      <div className="flex items-center justify-center p-1 bg-cream-100 rounded-xl border border-cream-200">
        <button
          type="button"
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'inputs' ? 'bg-white text-wine-900 shadow-sm' : 'text-wine-900/60'
          }`}
        >
          ✏️ Edit Newspaper Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'preview' ? 'bg-white text-wine-900 shadow-sm' : 'text-wine-900/60'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-blush-600" />
          <span>Live Broadsheet Mockup</span>
        </button>
      </div>

      {activeTab === 'inputs' ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Couple Names & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                Couple Names / Person Being Celebrated *
              </label>
              <input
                type="text"
                placeholder="e.g. Saral & Pakhhi"
                value={customization.coupleNames || ''}
                onChange={(e) => onChange({ coupleNames: e.target.value })}
                className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                City / Location Edition
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Delhi, Bangalore"
                value={customization.city || ''}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
              />
            </div>
          </div>

          {/* Main Headline & Subheadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                Top Headline (Gothic Bold) *
              </label>
              <input
                type="text"
                placeholder="e.g. Breaking News"
                value={customization.newspaperHeadline || ''}
                onChange={(e) => onChange({ newspaperHeadline: e.target.value })}
                className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
                Sub-Headline Banner *
              </label>
              <input
                type="text"
                placeholder="e.g. LOVE IS REAL!"
                value={customization.newspaperSubheadline || ''}
                onChange={(e) => onChange({ newspaperSubheadline: e.target.value })}
                className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
              />
            </div>
          </div>

          {/* Milestone Date & Quote */}
          <div>
            <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
              Milestone Commemorative Date *
            </label>
            <input
              type="text"
              placeholder="e.g. 17 OCT • The day he asked and she said yes"
              value={customization.anniversaryDate || ''}
              onChange={(e) => onChange({ anniversaryDate: e.target.value })}
              className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>

          {/* Article Story */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-wine-900/80">
                Front-Page Article Column Story
              </label>
              <span className="text-[10px] text-wine-900/50">Our editor polishes every story</span>
            </div>
            <textarea
              rows={4}
              placeholder="Describe how you met, your favorite date memories, the proposal day, or funny quirks..."
              value={customization.articleStory || ''}
              onChange={(e) => onChange({ articleStory: e.target.value })}
              className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400 font-sans"
            />
          </div>

          {/* Two Photo Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="border border-dashed border-blush-200 bg-blush-50/40 rounded-2xl p-3 text-center relative cursor-pointer hover:border-blush-400 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSimulatedUpload(e, 0)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-4 h-4 mx-auto text-blush-600 mb-1" />
              <p className="text-xs font-semibold text-wine-900">Upload Main Photo (Hero)</p>
              <p className="text-[10px] text-wine-900/50">Displayed in upper right broadsheet</p>
            </div>

            <div className="border border-dashed border-blush-200 bg-blush-50/40 rounded-2xl p-3 text-center relative cursor-pointer hover:border-blush-400 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSimulatedUpload(e, 1)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-4 h-4 mx-auto text-blush-600 mb-1" />
              <p className="text-xs font-semibold text-wine-900">Upload Candid Photo (Secondary)</p>
              <p className="text-[10px] text-wine-900/50">Displayed in lower candid frame</p>
            </div>
          </div>
        </div>
      ) : (
        /* Broadsheet Live Preview matching media_1788608467346.jpg */
        <div className="p-4 bg-stone-800 rounded-3xl flex items-center justify-center animate-fadeIn shadow-2xl">
          {/* Black Frame */}
          <div className="w-full max-w-sm bg-neutral-900 p-3 sm:p-4 rounded-xl shadow-2xl border-4 border-neutral-950">
            {/* White/Antique Parchment Sheet */}
            <div className="bg-[#FAF8F5] text-stone-900 p-4 rounded shadow-inner font-serif select-none border border-stone-300 space-y-2.5">
              {/* Masthead Header */}
              <div className="flex items-center justify-between text-[8px] uppercase tracking-wider text-stone-500 border-b border-stone-300 pb-1">
                <span>Special Edition</span>
                <span>❦ ❦ ❦</span>
                <span>{city}</span>
              </div>

              {/* Main Headline */}
              <div className="text-center py-1 border-b-2 border-stone-900">
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight uppercase leading-none">
                  {headline}
                </h2>
                <div className="mt-1 py-0.5 bg-stone-900 text-[#FAF8F5] text-[10px] font-bold tracking-[0.2em] uppercase">
                  {subheadline}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-12 gap-2 pt-1">
                {/* Left Column: Story */}
                <div className="col-span-5 space-y-1.5 text-[7px] sm:text-[8px] leading-tight font-serif text-stone-800 border-r border-stone-300 pr-1.5">
                  <p className="font-bold uppercase text-[8px] border-b border-stone-300 pb-0.5">
                    They found each other about them
                  </p>
                  <p className="text-justify">{story}</p>
                </div>

                {/* Right Top Column: Main Couple Photo */}
                <div className="col-span-7">
                  <div className="aspect-[4/3] bg-stone-200 rounded overflow-hidden border border-stone-400">
                    <img
                      src={photo1}
                      alt="Couple Hero"
                      className="w-full h-full object-cover grayscale contrast-110"
                    />
                  </div>
                </div>
              </div>

              {/* Lower Section */}
              <div className="grid grid-cols-12 gap-2 border-t border-stone-300 pt-1.5">
                {/* Lower Photo */}
                <div className="col-span-4 aspect-square bg-stone-200 rounded overflow-hidden border border-stone-400">
                  <img
                    src={photo2}
                    alt="Couple Candid"
                    className="w-full h-full object-cover grayscale contrast-110"
                  />
                </div>

                {/* Center Date Plaque */}
                <div className="col-span-4 border border-stone-900 p-1 flex flex-col items-center justify-center text-center">
                  <span className="text-sm sm:text-base font-black leading-none">
                    {anniversaryDate.split(' ')[0]}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider font-bold">
                    {anniversaryDate.split(' ')[1] || 'OCT'}
                  </span>
                  <p className="text-[6.5px] leading-none text-stone-600 mt-0.5">
                    The day he asked and she said yes
                  </p>
                </div>

                {/* Right Quote */}
                <div className="col-span-4 text-[7px] leading-tight font-serif text-stone-700 flex flex-col justify-center">
                  <p className="italic">"No perfect plans. No filters. Just choosing each other every single day."</p>
                  <p className="font-bold mt-1 text-[6.5px]">Forever 🧿❤️</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
