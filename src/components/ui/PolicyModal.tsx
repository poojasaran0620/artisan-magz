import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Truck, HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ_DATA } from '../../data/faqData';

interface PolicyModalProps {
  policy: string | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policy, onClose }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FCFAF7] rounded-3xl w-full max-w-lg shadow-2xl border border-roseGold-light overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-white border-b border-roseGold-light/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {policy === 'cancellation' && <ShieldCheck className="w-5 h-5 text-blush-600" />}
            {policy === 'shipping' && <Truck className="w-5 h-5 text-blush-600" />}
            {policy === 'privacy' && <Lock className="w-5 h-5 text-blush-600" />}
            {policy === 'faq' && <HelpCircle className="w-5 h-5 text-blush-600" />}
            <h3 className="font-serif text-lg font-bold text-wine-900 capitalize">
              {policy === 'cancellation' && 'Cancellation & Replacement Policy'}
              {policy === 'shipping' && 'Shipping & Transit Timelines'}
              {policy === 'privacy' && 'Photo Privacy & Data Protection'}
              {policy === 'faq' && 'Frequently Asked Questions'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-wine-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-wine-900/80 leading-relaxed">
          {policy === 'cancellation' && (
            <>
              <p>
                <strong>Personalized & Made-to-Order Items:</strong> Because all our magazines, frames, newspaper editions, and bespoke hampers are custom-crafted with your personal photos and engraved text, orders <strong>cannot be cancelled or returned once printing has started</strong>.
              </p>
              <p>
                <strong>Cancellation Window:</strong> You may cancel or amend your order within <strong>2 hours</strong> of placing it by pinging our WhatsApp team at +91 98765 43210.
              </p>
              <p>
                <strong>Damaged in Transit Guarantee:</strong> If your product arrives damaged, broken, or with any typographical error caused by our team, we will replace it <strong>100% free of charge</strong>. Simply send an unboxing video to our WhatsApp support within 48 hours of delivery.
              </p>
            </>
          )}

          {policy === 'shipping' && (
            <>
              <p>
                <strong>Production & Typesetting:</strong> Each gift is individually designed by our graphic artists. Design proof creation takes 24–48 hours.
              </p>
              <p>
                <strong>Dispatch:</strong> Standard orders dispatch within <strong>3 to 4 business days</strong>. Rush orders can be requested on WhatsApp.
              </p>
              <p>
                <strong>Express Delivery:</strong> Metro cities (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai) typically receive delivery in <strong>4 to 5 business days</strong>. Rest of India in <strong>5 to 7 days</strong>.
              </p>
              <p>
                <strong>Packaging:</strong> All frames and glass items are encased in triple-layer shockproof air bubble wrap and heavy corrugated shipping cartons.
              </p>
            </>
          )}

          {policy === 'privacy' && (
            <>
              <p>
                <strong>Your Moments Are Sacred:</strong> We understand the deep intimacy of personal couple, family, and celebration photos.
              </p>
              <p>
                <strong>Zero Commercial Use:</strong> We will <em>never</em> display your personal photographs on our social media or advertisements without your explicit written consent.
              </p>
              <p>
                <strong>Automated Deletion:</strong> All customer media files and high-res uploads are strictly encrypted and automatically wiped clean from our production drives 14 days after delivery confirmation.
              </p>
            </>
          )}

          {policy === 'faq' && (
            <div className="divide-y divide-taupe-200/80 border-y border-taupe-200/80">
              {FAQ_DATA.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full py-3.5 flex items-center justify-between text-left cursor-pointer group gap-3"
                    >
                      <span
                        className={`text-xs font-semibold transition-colors ${
                          isOpen ? 'text-roseGold' : 'text-charcoal group-hover:text-roseGold'
                        }`}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-roseGold' : 'text-taupe-400 group-hover:text-charcoal'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3.5 text-xs text-charcoal/70 leading-relaxed animate-in fade-in duration-200">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-cream-50 border-t border-roseGold-light/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-wine-900 text-white text-xs font-semibold rounded-xl hover:bg-wine-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
