import React, { useState } from 'react';
import { STORY_HIGHLIGHTS } from '../../data/products';
import { StoryHighlight } from '../../types/product';
import { StoryViewerModal } from '../ui/StoryViewerModal';

interface StoryHighlightsProps {
  onShopCollection: (category: string) => void;
}

export const StoryHighlights: React.FC<StoryHighlightsProps> = ({ onShopCollection }) => {
  const [activeHighlight, setActiveHighlight] = useState<StoryHighlight | null>(null);

  return (
    <section className="py-4 border-b border-roseGold-light/30 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 justify-start sm:justify-center">
          {STORY_HIGHLIGHTS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveHighlight(item)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              {/* Story Ring */}
              <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-blush-500 to-roseGold group-hover:scale-105 transition duration-300 shadow-sm">
                <div className="p-0.5 bg-white rounded-full">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover group-hover:brightness-95 transition"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-wine-900/90 group-hover:text-blush-600 transition tracking-tight">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <StoryViewerModal
        highlight={activeHighlight}
        onClose={() => setActiveHighlight(null)}
        onShopCollection={(highlightId) => {
          if (highlightId === 'magazines') onShopCollection('prod-mag-01');
          else if (highlightId === 'frames') onShopCollection('frames');
          else if (highlightId === 'newspaper') onShopCollection('prod-news-01');
          else if (highlightId === 'unboxing') onShopCollection('prod-hamper-01');
          else onShopCollection('all');
        }}
      />
    </section>
  );
};
