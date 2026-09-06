import React, { useState } from 'react';
import { Product, ProductVariant, CustomizationData } from '../../../types/product';
import { formatPrice } from '../../../utils/formatters';
import { Upload, Eye, Check, Calendar, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';

interface FrameCustomizerProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  customization: CustomizationData;
  onChange: (data: Partial<CustomizationData>) => void;
}

export const FrameCustomizer: React.FC<FrameCustomizerProps> = ({
  product,
  selectedVariant,
  onVariantChange,
  customization,
  onChange,
}) => {
  const [showLivePreview, setShowLivePreview] = useState(true);

  const FRAME_STYLES = [
    { id: 'Classic Black', name: 'Classic Black Gallery', bg: '#1c1917', border: 'border-stone-900', ring: 'ring-stone-900' },
    { id: 'Minimalist Oak', name: 'Minimalist Natural Oak', bg: '#c49a6c', border: 'border-[#b88c5d]', ring: 'ring-[#c49a6c]' },
    { id: 'White Wood', name: 'Nordic White Wood', bg: '#f5f5f4', border: 'border-stone-300', ring: 'ring-stone-400' },
    { id: 'Acrylic Glass', name: 'Frameless Clear Acrylic', bg: '#e0f2fe', border: 'border-sky-300', ring: 'ring-sky-400' },
  ];

  const COLLAGE_STYLES = [
    { id: 'playing-cards', name: 'Playing Card Collage', desc: 'Trending "How Lucky Are We?" 9-card layout' },
    { id: 'grid9', name: '9-Photo Polaroid Grid', desc: 'Grid of 9 memories (Customer Top Pick)' },
    { id: 'single', name: 'Single Hero Focus', desc: '1 Stunning high-res portrait' },
    { id: 'cutout', name: 'Cutout Pop-up Collage', desc: 'Background grid with elevated pop-out sticker' },
  ];

  const selectedFrameStyle = customization.frameStyle || 'Classic Black';
  const orientation = customization.orientation || 'portrait';
  const collageStyle = customization.collageStyle || 'playing-cards';
  const currentPhoto = customization.uploadedPhotos?.[0] || '/products/playing_cards_frame.jpg';

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    onChange({
      uploadedPhotos: [url, ...(customization.uploadedPhotos || []).slice(1)],
      uploadedPhotoCount: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Size Variant */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 1: Select Frame Size
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariant.id;
            const sizeLabel = v.name.match(/\((.*?)\)/)?.[1] || v.name.split(' ')[0];
            const titleLabel = v.name.split('(')[0].trim();
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onVariantChange(v);
                  onChange({ frameSize: v.name });
                }}
                className={`p-3 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blush-600 bg-blush-50/80 ring-2 ring-blush-500/20'
                    : 'border-roseGold-light/60 bg-white hover:border-blush-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-wine-900">{sizeLabel}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blush-600" />}
                  </div>
                  <p className="text-[10px] text-wine-900/70 mt-0.5 font-medium">{titleLabel}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-roseGold-light/30">
                  <span className="text-xs font-bold text-blush-700">{formatPrice(v.price)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Frame Finish & Style */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 2: Choose Frame Finish
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FRAME_STYLES.map((fs) => {
            const isSelected = selectedFrameStyle === fs.id;
            return (
              <button
                key={fs.id}
                type="button"
                onClick={() => onChange({ frameStyle: fs.id })}
                className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-blush-600 bg-blush-50/60 ring-2 ring-blush-400/30'
                    : 'border-roseGold-light/60 bg-white hover:border-blush-200'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border shadow-inner shrink-0"
                  style={{ backgroundColor: fs.bg }}
                />
                <span className="text-xs font-semibold text-wine-900 truncate">
                  {fs.name.split(' ')[0]} {fs.name.split(' ')[1] || ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Collage Style & Orientation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Collage Style */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
            Collage Layout
          </label>
          <div className="space-y-1.5">
            {COLLAGE_STYLES.map((cs) => (
              <button
                key={cs.id}
                type="button"
                onClick={() => onChange({ collageStyle: cs.id as any })}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                  collageStyle === cs.id
                    ? 'border-blush-600 bg-blush-50/80 font-bold text-wine-900'
                    : 'border-roseGold-light/60 bg-white text-wine-900/70 hover:border-blush-300'
                }`}
              >
                <div>
                  <p className="font-semibold">{cs.name}</p>
                  <p className="text-[10px] text-wine-900/50 font-normal">{cs.desc}</p>
                </div>
                {collageStyle === cs.id && <Check className="w-4 h-4 text-blush-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
            Display Orientation
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange({ orientation: 'portrait' })}
              className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                orientation === 'portrait'
                  ? 'border-blush-600 bg-blush-50 font-bold text-blush-700'
                  : 'border-roseGold-light/60 bg-white text-wine-900/70'
              }`}
            >
              <div className="w-6 h-9 border-2 border-current rounded mx-auto mb-1" />
              <span className="text-xs">Portrait</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ orientation: 'landscape' })}
              className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                orientation === 'landscape'
                  ? 'border-blush-600 bg-blush-50 font-bold text-blush-700'
                  : 'border-roseGold-light/60 bg-white text-wine-900/70'
              }`}
            >
              <div className="w-9 h-6 border-2 border-current rounded mx-auto mb-2 mt-1.5" />
              <span className="text-xs">Landscape</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 4: Photo Upload & Caption */}
      <div className="space-y-4 pt-1">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 4: Upload Photo & Engraving Caption
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-1/2 border-2 border-dashed border-blush-200 hover:border-blush-400 bg-blush-50/40 rounded-2xl p-3 text-center transition relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleSimulatedUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-2 pointer-events-none text-blush-700">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-semibold">Upload Photo / Collage</span>
            </div>
            <p className="text-[9px] text-wine-900/50 mt-1">
              (You can send remaining collage photos on WhatsApp)
            </p>
          </div>

          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Caption/Date (e.g. Forever & Always • 14.02.2024)"
              value={customization.captionDate || ''}
              onChange={(e) => onChange({ captionDate: e.target.value })}
              className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>
        </div>
      </div>

      {/* Live Frame Mockup Preview */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-wine-900 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blush-600" />
            <span>Interactive Frame Preview:</span>
          </span>
          <span className="text-[10px] text-wine-900/50">
            {selectedFrameStyle} • {selectedVariant.name.split(' ')[0]} • {orientation}
          </span>
        </div>

        <div className="p-6 bg-stone-100 rounded-3xl flex items-center justify-center border border-stone-200 shadow-inner">
          {/* Outer Frame */}
          <div
            className={`transition-all duration-300 shadow-2xl p-4 sm:p-6 rounded-md flex flex-col items-center justify-center relative ${
              orientation === 'portrait' ? 'w-56 sm:w-64 h-72 sm:h-80' : 'w-72 sm:w-80 h-56 sm:h-64'
            }`}
            style={{
              backgroundColor:
                selectedFrameStyle === 'Classic Black'
                  ? '#171717'
                  : selectedFrameStyle === 'Minimalist Oak'
                  ? '#c89e6f'
                  : selectedFrameStyle === 'White Wood'
                  ? '#fbfbfb'
                  : '#dbeafe',
              border:
                selectedFrameStyle === 'Acrylic Glass'
                  ? '4px solid rgba(255,255,255,0.8)'
                  : '8px solid rgba(0,0,0,0.15)',
            }}
          >
            {/* White Mount / Matting */}
            <div className="w-full h-full bg-white p-2 rounded shadow-inner flex flex-col justify-between overflow-hidden relative">
              {/* Photo Area */}
              <div className="w-full flex-1 rounded overflow-hidden relative bg-stone-100 flex items-center justify-center">
                <img
                  src={currentPhoto}
                  alt="Frame preview"
                  className="w-full h-full object-contain"
                />

                {/* Simulated 9-photo polaroid overlay if selected */}
                {collageStyle === 'grid9' && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 bg-black/10">
                    {[...Array(9)].map((_, idx) => (
                      <div key={idx} className="border border-white/40 overflow-hidden">
                        <img
                          src={currentPhoto}
                          alt="grid"
                          className="w-full h-full object-cover filter contrast-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inscribed Caption */}
              <div className="pt-2 text-center">
                <p className="font-serif text-[10px] text-stone-800 font-medium tracking-wide">
                  {customization.captionDate || 'Forever & Always • Special Milestone'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
