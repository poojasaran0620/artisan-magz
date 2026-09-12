import React from 'react';
import { Heart, MessageCircle, Play, Eye, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';

export const InstagramFeedSection: React.FC = () => {
  const items = [
    {
      id: 1,
      type: 'reel' as const,
      image: '/products/magazine_vogue_cover.jpg',
      title: 'Flipping through 12 pages of memories',
      tag: '#ArtisanMagazine',
      views: '14.2K',
      likes: '1.2K',
      comments: 64,
      link: 'https://www.instagram.com',
    },
    {
      id: 2,
      type: 'reel' as const,
      image: '/products/gift_hamper_curated_box.jpg',
      title: 'Unboxing romance with wax seals & polaroids',
      tag: '#CuratedGiftHamper',
      views: '9.8K',
      likes: '890',
      comments: 42,
      link: 'https://www.instagram.com',
    },
    {
      id: 3,
      type: 'post' as const,
      image: '/products/playing_cards_frame.jpg',
      title: 'Queen & King of Hearts keepsake frame',
      tag: '#PlayingCardFrame',
      likes: '940',
      comments: 48,
      link: 'https://www.instagram.com',
    },
    {
      id: 4,
      type: 'post' as const,
      image: '/products/frame_newspaper_daily_slay.jpg',
      title: 'Vintage "Daily Slay" newspaper front page',
      tag: '#NewspaperKeepsake',
      likes: '780',
      comments: 36,
      link: 'https://www.instagram.com',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] border-t border-taupe-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-1.5 text-roseGold text-xs font-bold uppercase tracking-wider">
              <InstagramIcon className="w-4 h-4" />
              <span>@artisanmagz.studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              From Our Studio to Your Feed
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70">
              Watch customer unboxings, magazine flips, and behind-the-scenes handcrafting.
            </p>
          </div>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-charcoal to-charcoal-dark hover:from-roseGold hover:to-roseGold-dark text-[#FDFCF5] rounded-full text-xs font-semibold shadow-soft hover:shadow-soft-lg active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-roseGold-light group-hover:text-white transition-colors" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 4 Grid Cards: 2 Reels + 2 Posts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-3xl overflow-hidden bg-cream-100 shadow-soft hover:shadow-luxury transition-all duration-500 border border-taupe-200/60 block cursor-pointer hover:-translate-y-1"
            >
              {/* Product / Media Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
              />

              {/* Badge: Reel vs Post in Top Corner */}
              <div className="absolute top-3 left-3 z-10">
                {item.type === 'reel' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                    <Play className="w-2.5 h-2.5 fill-white text-white" />
                    <span>Reel</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                    <InstagramIcon className="w-2.5 h-2.5 text-roseGold-light" />
                    <span>Post</span>
                  </span>
                )}
              </div>

              {/* Bottom Subtle Gradient for readability */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none group-hover:opacity-0 transition duration-300" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-medium truncate pointer-events-none group-hover:opacity-0 transition duration-300">
                {item.tag}
              </div>

              {/* Hover Overlay with Stats & Caption */}
              <div className="absolute inset-0 bg-charcoal/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white text-center">
                <div className="flex items-center justify-end">
                  <ExternalLink className="w-3.5 h-3.5 text-roseGold-light" />
                </div>

                <div className="space-y-2">
                  <p className="font-serif italic text-xs text-[#FAF6F0] leading-snug line-clamp-2 px-1">
                    "{item.title}"
                  </p>
                  <span className="inline-block text-[10px] text-roseGold-light font-bold">
                    {item.tag}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-2 border-t border-white/15">
                  {item.type === 'reel' && (
                    <span className="flex items-center gap-1 text-[#FDFCF5]">
                      <Eye className="w-3.5 h-3.5 text-roseGold-light" />
                      {item.views}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[#FDFCF5]">
                    <Heart className="w-3.5 h-3.5 fill-roseGold-light text-roseGold-light" />
                    {item.likes}
                  </span>
                  <span className="flex items-center gap-1 text-[#FDFCF5]">
                    <MessageCircle className="w-3.5 h-3.5 text-[#FAF6F0]" />
                    {item.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
