import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';

export const InstagramFeedSection: React.FC = () => {
  const posts = [
    {
      id: 1,
      image: '/products/media_1788608467331.jpg',
      likes: 428,
      comments: 34,
      tag: '#CustomHamper',
    },
    {
      id: 2,
      image: '/products/media_1788608467346.jpg',
      likes: 892,
      comments: 67,
      tag: '#BreakingNewsFrame',
    },
    {
      id: 3,
      image: '/products/media_1788608467332.jpg',
      likes: 615,
      comments: 42,
      tag: '#PolaroidCollage',
    },
    {
      id: 4,
      image: '/products/media_1788608467334.jpg',
      likes: 387,
      comments: 29,
      tag: '#MiniFrameLove',
    },
  ];

  return (
    <section className="py-14 bg-cream-50/50 border-t border-roseGold-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blush-600 text-xs font-semibold uppercase tracking-wider">
              <InstagramIcon className="w-4 h-4" />
              <span>@artisanmagz.studio</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-wine-900 mt-1">
              Follow Our Gifting Journey on Instagram
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-gradient-to-r from-blush-600 to-roseGold text-white rounded-full text-xs font-semibold shadow-soft hover:shadow-soft-lg active:scale-95 transition flex items-center gap-1.5"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-cream-100 shadow-sm border border-roseGold-light/40"
            >
              <img
                src={post.image}
                alt="Instagram gifting post"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {/* Hover overlay with likes and comments */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center text-white space-y-2 p-2 text-center">
                <span className="text-xs font-serif italic text-blush-200">{post.tag}</span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
