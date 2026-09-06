import React, { useState } from 'react';
import { Product, ProductVariant, CustomizationData } from '../../../types/product';
import { MAGAZINE_TEMPLATES } from '../../../data/products';
import { formatPrice } from '../../../utils/formatters';
import { Upload, Music, Image as ImageIcon, Eye, Check, Sparkles, X } from 'lucide-react';

interface MagazineCustomizerProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  customization: CustomizationData;
  onChange: (data: Partial<CustomizationData>) => void;
}

export const MagazineCustomizer: React.FC<MagazineCustomizerProps> = ({
  product,
  selectedVariant,
  onVariantChange,
  customization,
  onChange,
}) => {
  const maxPhotos = selectedVariant.recommendedPhotos || 8;
  const currentPhotos = customization.uploadedPhotos || [];
  const [showLivePreview, setShowLivePreview] = useState(false);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    // Convert to object URLs for instantaneous high fidelity preview
    const newUrls = files.map((file) => URL.createObjectURL(file));
    const combined = [...currentPhotos, ...newUrls].slice(0, maxPhotos);
    
    onChange({
      uploadedPhotos: combined,
      uploadedPhotoCount: combined.length,
    });
  };

  const handleRemovePhoto = (index: number) => {
    const updated = currentPhotos.filter((_, i) => i !== index);
    onChange({
      uploadedPhotos: updated,
      uploadedPhotoCount: updated.length,
    });
  };

  // Preset headline suggestions
  const headlineSuggestions = [
    'The Girl Who Stole My Heart',
    'A Decade Of Unconditional Love',
    'Chapter 25: The Golden Birthday Edition',
    'Saral & Pakhhi: Love Is Real',
  ];

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 1: Select Edition & Page Count
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariant.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onVariantChange(v);
                  if (v.recommendedPhotos && currentPhotos.length > v.recommendedPhotos) {
                    const trimmed = currentPhotos.slice(0, v.recommendedPhotos);
                    onChange({
                      uploadedPhotos: trimmed,
                      uploadedPhotoCount: trimmed.length,
                    });
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blush-600 bg-blush-50/80 ring-2 ring-blush-500/20'
                    : 'border-roseGold-light/60 bg-white hover:border-blush-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-wine-900">{v.name.split(' ')[0]} {v.name.split(' ')[1]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blush-600" />}
                  </div>
                  <p className="text-[10px] text-wine-900/60 mt-0.5">
                    {v.recommendedPhotos} Photos
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-roseGold-light/30">
                  <span className="text-xs font-bold text-blush-700">
                    {formatPrice(v.price)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {selectedVariant.description && (
          <p className="text-[11px] text-wine-900/70 italic bg-cream-50 p-2.5 rounded-xl border border-cream-200">
            ✨ {selectedVariant.description}
          </p>
        )}
      </div>

      {/* Step 2: Choose Magazine Template Provided by Us */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-wine-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blush-600" />
            <span>Step 2: Choose Design Template</span>
          </label>
          <span className="text-[11px] text-wine-900/60">
            5 Curated Themes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MAGAZINE_TEMPLATES.map((tmpl) => {
            const isSelected = customization.selectedTemplate === tmpl.id || (!customization.selectedTemplate && tmpl.id === 'tmpl-vogue');
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ selectedTemplate: tmpl.id })}
                className={`p-2 rounded-xl border text-left transition duration-200 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-blush-600 bg-blush-50 ring-2 ring-blush-500/30'
                    : 'border-roseGold-light/50 bg-white hover:border-blush-300'
                }`}
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-cream-100 mb-1.5 relative">
                  <img src={tmpl.coverImage} alt={tmpl.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-blush-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="font-serif font-bold text-[11px] text-wine-900 block truncate">
                    {tmpl.name}
                  </span>
                  <span className="text-[9px] text-blush-700 block truncate">
                    {tmpl.suitableFor.split(',')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Upload Section with Dynamic Counter */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-wine-900 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blush-600" />
            <span>Step 2: Upload Your Photos</span>
          </label>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            currentPhotos.length >= maxPhotos
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-blush-100 text-blush-800'
          }`}>
            {currentPhotos.length} of {maxPhotos} photos selected
          </span>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-blush-200 hover:border-blush-400 bg-blush-50/30 rounded-2xl p-4 text-center transition group relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleSimulatedFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={currentPhotos.length >= maxPhotos}
          />
          <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blush-600 group-hover:scale-110 transition">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-wine-900">
              Click or drag photos to upload
            </p>
            <p className="text-[10px] text-wine-900/60">
              Supports JPEG, PNG, HEIC. You can also finalize/send more high-res photos via WhatsApp after ordering.
            </p>
          </div>
        </div>

        {/* Uploaded Thumbnails Grid */}
        {currentPhotos.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {currentPhotos.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-cream-100 border border-blush-200 group">
                <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editorial Text Inputs */}
      <div className="space-y-4 pt-2">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 3: Personalize Headlines & Story
        </label>

        <div>
          <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
            Occasion / Magazine Edition Title *
          </label>
          <input
            type="text"
            placeholder="e.g. 5th Anniversary Special, Priya's 21st Birthday"
            value={customization.occasion || ''}
            onChange={(e) => onChange({ occasion: e.target.value })}
            className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-wine-900/80">
              Front Cover Main Headline *
            </label>
            <span className="text-[10px] text-wine-900/50">Keep it punchy & romantic</span>
          </div>
          <input
            type="text"
            placeholder="e.g. The Girl Who Stole My Heart"
            value={customization.headline || ''}
            onChange={(e) => onChange({ headline: e.target.value })}
            className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
          />

          {/* Preset tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {headlineSuggestions.map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange({ headline: tag })}
                className="text-[10px] bg-cream-100 hover:bg-blush-100 text-wine-900/80 px-2.5 py-1 rounded-full border border-cream-200 transition"
              >
                + "{tag}"
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
            Your Love Letter / Story / Dedication Message
          </label>
          <textarea
            rows={3}
            placeholder="Write your heartfelt message, favorite memories, inside jokes, or travel milestones to be printed inside the editorial spreads..."
            value={customization.storyMessage || ''}
            onChange={(e) => onChange({ storyMessage: e.target.value })}
            className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-400"
          />
        </div>

        {/* Optional Spotify Link with QR preview badge */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Music className="w-3.5 h-3.5 text-emerald-600" />
            <label className="text-[11px] font-semibold text-wine-900/80">
              Spotify Song Link (Optional - Printed as Scannable QR Code)
            </label>
          </div>
          <input
            type="url"
            placeholder="e.g. https://open.spotify.com/track/..."
            value={customization.spotifyLink || ''}
            onChange={(e) => onChange({ spotifyLink: e.target.value })}
            className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-400"
          />
        </div>
      </div>

      {/* Live Preview Toggle Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowLivePreview(!showLivePreview)}
          className="w-full py-2.5 bg-cream-100 hover:bg-cream-200 text-wine-900 border border-cream-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Eye className="w-3.5 h-3.5 text-blush-600" />
          <span>{showLivePreview ? 'Hide Magazine Mockup' : '✨ Preview Front Cover Mockup'}</span>
        </button>

        {/* Live Magazine Cover Mockup */}
        {showLivePreview && (
          <div className="mt-4 p-4 bg-[#210c14] rounded-2xl shadow-xl flex justify-center animate-fadeIn">
            <div className="w-64 aspect-[3/4] bg-white rounded-lg shadow-2xl overflow-hidden relative border border-white/20 flex flex-col justify-between p-3 select-none">
              {/* Cover background image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={currentPhotos[0] || product.images[0]}
                  alt="Cover preview"
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
              </div>

              {/* Masthead */}
              <div className="relative z-10 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/80 font-mono">
                  {customization.occasion || 'SPECIAL EDITION'}
                </p>
                <h2 className="font-serif text-3xl font-bold tracking-widest text-white uppercase mt-0.5 drop-shadow-md">
                  VOGUE
                </h2>
                <div className="w-16 h-0.5 bg-blush-400 mx-auto mt-1" />
              </div>

              {/* Bottom Editorial Headlines */}
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[9px] bg-blush-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Exclusive Cover Story
                </span>
                <h3 className="font-serif text-lg font-bold leading-tight drop-shadow-lg">
                  {customization.headline || 'The Girl Who Stole My Heart'}
                </h3>
                <p className="text-[9px] text-white/80 line-clamp-2 drop-shadow">
                  {customization.storyMessage || 'A retrospective of laughter, late-night coffees, and adventures together.'}
                </p>
                {customization.spotifyLink && (
                  <div className="pt-1 flex items-center gap-1 text-[8px] text-emerald-400">
                    <Music className="w-2.5 h-2.5" />
                    <span>Scannable Spotify Code Included</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
