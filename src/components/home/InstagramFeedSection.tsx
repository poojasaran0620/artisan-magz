import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import {
  BEST_PERFORMING_REELS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  InstagramReel,
} from '../../data/instagramReels';

interface ReelCardProps {
  reel: InstagramReel;
  isGlobalMuted: boolean;
  onToggleMute: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, isGlobalMuted, onToggleMute }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure DOM properties are set for strict browser autoplay policies
    video.defaultMuted = true;
    video.muted = isGlobalMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser policy blocks autoplay, remain in paused state with play button
          setIsPlaying(false);
        });
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  // Update muted DOM property whenever isGlobalMuted changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
    }
  }, [isGlobalMuted]);

  // Pause when scrolled completely out of view, resume when back in view
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
  };

  return (
    <div
      ref={containerRef}
      className="flex-none w-[285px] sm:w-[315px] md:w-[325px] snap-start bg-white rounded-3xl border border-taupe-200/80 shadow-soft hover:shadow-luxury transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* 1. Card Top Bar: Profile of Artisan Magz (Click to visit Instagram profile) */}
      <a
        href={INSTAGRAM_PROFILE_URL}
        target="_blank"
        rel="noreferrer"
        title={`Visit @${INSTAGRAM_HANDLE} on Instagram`}
        className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAF6F0] hover:bg-[#F4ECE3] border-b border-taupe-200/60 transition-colors group/profile cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Instagram Story Gradient Ring Avatar */}
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 shadow-2xs group-hover/profile:scale-105 transition-transform">
            <img
              src="/artisan_logo_sharp.png"
              alt="Artisan Magz"
              className="w-full h-full object-cover rounded-full bg-white"
            />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-charcoal truncate group-hover/profile:text-roseGold transition-colors">
                @{INSTAGRAM_HANDLE}
              </span>
              <InstagramIcon className="w-3 h-3 text-roseGold shrink-0" />
            </div>
            <span className="text-[10px] text-charcoal/60 truncate">
              Artisan Magz • Follow
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-roseGold group-hover/profile:text-roseGold-dark bg-white px-2.5 py-1 rounded-full border border-taupe-200/80 shadow-2xs transition shrink-0">
          <span>Follow</span>
          <ExternalLink className="w-3 h-3 opacity-70 group-hover/profile:translate-x-0.5 transition-transform" />
        </div>
      </a>

      {/* 2. Interactive Video Screen */}
      <div
        onClick={togglePlay}
        className="relative h-[430px] sm:h-[460px] w-full bg-charcoal cursor-pointer overflow-hidden select-none"
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.poster}
          autoPlay
          muted={isGlobalMuted}
          playsInline
          loop
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setProgress(0)}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />

        {/* Top-Right Mute / Unmute Button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition pointer-events-auto cursor-pointer shadow-xs active:scale-90"
            title={isGlobalMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isGlobalMuted ? 'Unmute video audio' : 'Mute video audio'}
          >
            {isGlobalMuted ? (
              <VolumeX className="w-4 h-4 text-white/80" />
            ) : (
              <Volume2 className="w-4 h-4 text-roseGold-light" />
            )}
          </button>
        </div>

        {/* Center Animated Play / Pause Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px] z-10 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-roseGold text-white flex items-center justify-center shadow-luxury transform hover:scale-110 active:scale-95 transition">
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            </div>
            <span className="mt-2 text-xs font-semibold text-white tracking-wide drop-shadow-md">
              Tap to Play
            </span>
          </div>
        )}

        {/* Bottom Overlay inside video: Tag and Tap Instruction */}
        <div className="absolute inset-x-0 bottom-0 pt-12 pb-3 px-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none">
          <div className="flex items-center justify-between text-white text-xs">
            <span className="font-semibold text-roseGold-light text-[11px] tracking-wide">
              {reel.tag}
            </span>
            <span className="text-[10px] text-white/70">
              {isPlaying ? 'Tap to pause' : 'Tap to play'}
            </span>
          </div>
        </div>

        {/* Video Scrubber Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-20 overflow-hidden">
          <div
            className="h-full bg-roseGold transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 3. Dedicated Option JUST BELOW the video: View more on Instagram */}
      <div className="p-3 bg-white border-t border-taupe-200/60">
        <a
          href={reel.url}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-charcoal via-[#2A2624] to-charcoal hover:from-roseGold hover:via-roseGold hover:to-roseGold-dark text-[#FDFCF5] rounded-2xl text-xs font-bold shadow-soft hover:shadow-soft-lg active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-roseGold-light group-hover:text-white transition-colors" />
          <span>View more on Instagram</span>
          <ExternalLink className="w-3 h-3 text-white/70 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export const InstagramFeedSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 330;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="instagram-feed" className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] border-t border-taupe-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-roseGold/10 border border-roseGold/20 text-roseGold text-xs font-bold uppercase tracking-wider hover:bg-roseGold/20 transition cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@{INSTAGRAM_HANDLE}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              From Our Feed: Reels &amp; Stories
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70">
              Watch our best-performing reels directly on the site — unboxings, magazine flips, and behind-the-scenes handcrafting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Horizontal Scroll Navigation Arrows */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-taupe-200 shadow-xs">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll reels left"
                className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal hover:bg-cream-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll reels right"
                className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal hover:bg-cream-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Follow on Instagram Button */}
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-charcoal to-charcoal-dark hover:from-roseGold hover:to-roseGold-dark text-[#FDFCF5] rounded-full text-xs font-semibold shadow-soft hover:shadow-soft-lg active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-roseGold-light group-hover:text-white transition-colors" />
              <span>Follow @{INSTAGRAM_HANDLE}</span>
              <ExternalLink className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Horizontal Reels Track */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-taupe-300 scrollbar-track-transparent"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {BEST_PERFORMING_REELS.map((reel: InstagramReel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                isGlobalMuted={isGlobalMuted}
                onToggleMute={() => setIsGlobalMuted((prev) => !prev)}
              />
            ))}
          </div>
        </div>

        {/* End of Horizontal Reels Track */}
      </div>
    </section>
  );
};