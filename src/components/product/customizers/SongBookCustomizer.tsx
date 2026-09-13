import React, { useState } from 'react';
import { Product, ProductVariant, CustomizationData } from '../../../types/product';
import { formatPrice } from '../../../utils/formatters';
import { Music, Upload, Eye, Check, Play, Pause, Disc } from 'lucide-react';

interface SongBookCustomizerProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  customization: CustomizationData;
  onChange: (data: Partial<CustomizationData>) => void;
}

export const SongBookCustomizer: React.FC<SongBookCustomizerProps> = ({
  product,
  selectedVariant,
  onVariantChange,
  customization,
  onChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const songTitle = customization.songTitle || 'Until I Found You';
  const artistName = customization.artistName || 'Stephen Sanchez';
  const coverImage = customization.uploadedPhotos?.[0] || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    onChange({
      uploadedPhotos: [url],
      uploadedPhotoCount: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Variant Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 1: Choose Display Style
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

      {/* Song Details Form */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-wine-900 uppercase tracking-wider">
          Step 2: Song & Dedication Details
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
              Song Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Perfect, Kesariya, Golden Hour"
              value={customization.songTitle || ''}
              onChange={(e) => onChange({ songTitle: e.target.value })}
              className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
              Artist Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Ed Sheeran, Arijit Singh, JVKE"
              value={customization.artistName || ''}
              onChange={(e) => onChange({ artistName: e.target.value })}
              className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
            Spotify Track or Playlist URL *
          </label>
          <input
            type="url"
            placeholder="https://open.spotify.com/track/..."
            value={customization.spotifyLink || ''}
            onChange={(e) => onChange({ spotifyLink: e.target.value })}
            className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blush-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-wine-900/80 mb-1">
            Dedicated Lyrics / Sweet Milestone Quote
          </label>
          <textarea
            rows={2}
            placeholder="e.g. 'I would never fall in love until I found her...'"
            value={customization.playlistDedication || ''}
            onChange={(e) => onChange({ playlistDedication: e.target.value })}
            className="w-full text-xs bg-white border border-roseGold-light rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-400"
          />
        </div>

        {/* Photo Upload */}
        <div className="border border-dashed border-blush-200 bg-blush-50/40 rounded-2xl p-3 text-center relative cursor-pointer hover:border-blush-400 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleSimulatedUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-4 h-4 mx-auto text-blush-600 mb-1" />
          <p className="text-xs font-semibold text-wine-900">Upload Album Cover Photo</p>
          <p className="text-[10px] text-wine-900/50">Your photo replaces the standard album art</p>
        </div>
      </div>

      {/* Live Acrylic Plaque Mockup */}
      <div className="pt-2">
        <span className="text-xs font-bold text-wine-900 flex items-center gap-1 mb-2">
          <Disc className="w-3.5 h-3.5 text-blush-600" />
          <span>Interactive Acrylic Plaque Preview:</span>
        </span>

        <div className="p-6 bg-stone-900 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
          {/* Acrylic Sheet with Glassmorphism */}
          <div className="w-64 sm:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-2xl text-white space-y-3">
            {/* Album Cover */}
            <div className="aspect-square rounded-xl overflow-hidden shadow-md relative bg-black/40">
              <img
                src={coverImage}
                alt="Album Cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center transition"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </div>
              </button>
            </div>

            {/* Song Meta */}
            <div>
              <h4 className="font-bold text-sm truncate">{songTitle}</h4>
              <p className="text-xs text-white/70 truncate">{artistName}</p>
              {customization.playlistDedication && (
                <p className="font-serif italic text-[10px] text-blush-200 mt-1 truncate">
                  "{customization.playlistDedication}"
                </p>
              )}
            </div>

            {/* Progress Bar & Spotify Barcode */}
            <div className="space-y-1 pt-1">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-emerald-400 transition-all ${
                    isPlaying ? 'w-2/3 duration-1000' : 'w-1/3'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[8px] text-white/60 font-mono">
                <span>1:24</span>
                <span>3:48</span>
              </div>
            </div>

            {/* Spotify Code Bar */}
            <div className="flex items-center justify-center gap-1 py-1 bg-black/40 rounded-lg px-2">
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 flex items-center gap-1 font-mono">
                <Music className="w-3 h-3 text-emerald-400" />
                <span>SPOTIFY SCAN CODE</span>
              </span>
            </div>
          </div>

          {/* Wooden Base Stand */}
          <div className="w-48 sm:w-56 h-5 bg-[#b88c5d] rounded-t shadow-2xl mt-1 border-t border-[#d5a878]" />
        </div>
      </div>
    </div>
  );
};
