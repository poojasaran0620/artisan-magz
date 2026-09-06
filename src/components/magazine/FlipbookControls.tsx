import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';

interface FlipbookControlsProps {
  currentSpreadIndex: number;
  totalSpreads: number;
  isMuted: boolean;
  isAutoPlaying: boolean;
  isFullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleMute: () => void;
  onToggleAutoPlay: () => void;
  onToggleFullscreen: () => void;
  spreadLabel: string;
}

export const FlipbookControls: React.FC<FlipbookControlsProps> = ({
  currentSpreadIndex,
  totalSpreads,
  isMuted,
  isAutoPlaying,
  isFullscreen,
  onPrev,
  onNext,
  onToggleMute,
  onToggleAutoPlay,
  onToggleFullscreen,
  spreadLabel,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-2 pt-3">
      {/* Main Pill Controls Bar */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-charcoal/90 backdrop-blur-md rounded-full shadow-luxury border border-white/10 text-white w-full sm:w-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={currentSpreadIndex === 0}
          className="p-1.5 rounded-full hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page / Spread indicator */}
        <div className="flex items-center gap-2 px-2 text-center">
          <span className="text-xs font-semibold text-[#FDFCF5] whitespace-nowrap">
            {spreadLabel}
          </span>
          <span className="text-[10px] text-taupe-300 font-mono hidden sm:inline">
            ({currentSpreadIndex + 1}/{totalSpreads})
          </span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={currentSpreadIndex >= totalSpreads - 1}
          className="p-1.5 rounded-full hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* Auto Tour Play/Pause */}
        <button
          type="button"
          onClick={onToggleAutoPlay}
          className={`p-1.5 rounded-full transition cursor-pointer ${
            isAutoPlaying
              ? 'bg-roseGold text-white shadow-sm'
              : 'hover:bg-white/10 text-white/80 hover:text-white'
          }`}
          title={isAutoPlaying ? 'Pause Auto-tour' : 'Start Auto-tour'}
          aria-label="Auto tour flipbook"
        >
          {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Sound Mute/Unmute */}
        <button
          type="button"
          onClick={onToggleMute}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
          title={isMuted ? 'Unmute paper sound' : 'Mute paper sound'}
          aria-label="Toggle paper sound"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-roseGold-light" /> : <Volume2 className="w-3.5 h-3.5 text-sage" />}
        </button>

        {/* Fullscreen Expand */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer hidden sm:flex items-center"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <div className="flex items-center gap-1 text-[11px] text-taupe-700">
        <Sparkles className="w-3 h-3 text-roseGold" />
        <span>Swipe edge, drag corner, or tap to flip pages</span>
      </div>
    </div>
  );
};
