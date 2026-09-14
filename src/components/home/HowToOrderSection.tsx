import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Palette,
  Gift,
  Truck,
  CheckCircle2,
  UploadCloud,
  MessageCircle,
  Eye,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { springs, luxuryEase } from '../../styles/motion';

export const HowToOrderSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Select pages',
      desc: 'Choose the number of pages you want for your magazine (8, 12, 16, or 20), frame style, or hamper box.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Pick templates',
      desc: 'Select your favorite editorial cover style, customize headline texts, dates, and couple dedications.',
      icon: Palette,
    },
    {
      step: '03',
      title: 'Add extras',
      desc: 'Add optional add-ons like luxury gift wrapping, wax-sealed greeting letter, or custom Spotify plaque.',
      icon: Gift,
    },
    {
      step: '04',
      title: 'Choose delivery',
      desc: 'Pick your preferred delivery: Express Nationwide Shipping or Standard Shipping (Free over ₹1,499).',
      icon: Truck,
    },
    {
      step: '05',
      title: 'Checkout & confirm',
      desc: 'Add to cart, complete checkout, and send us a screenshot of your order summary on WhatsApp to confirm.',
      icon: CheckCircle2,
    },
  ];

  const uploadSteps = [
    {
      title: 'Instant WhatsApp Invoice',
      badge: 'Step 1',
      desc: 'You will receive an official invoice and confirmation of your order on WhatsApp once confirmed.',
      icon: MessageCircle,
      highlight: 'Instant Confirmation',
    },
    {
      title: 'Google Drive & WhatsApp Upload',
      badge: 'Step 2',
      desc: 'We send you a private Google Drive folder link & Google Form, or you can send high-res photos directly on WhatsApp.',
      icon: UploadCloud,
      highlight: 'Zero Quality Loss',
    },
    {
      title: 'Digital PDF Review & Approval',
      badge: 'Step 3',
      desc: 'Our design team layouts your pages and sends you a digital PDF preview within 2–3 days. Printing only begins after you approve!',
      icon: Eye,
      highlight: '100% Satisfaction',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF6F0] via-[#FDFCF5] to-[#FAF6F0] border-t border-taupe-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ========================================================================= */}
        {/* PART 1: PROCESS — HOW TO ORDER                                           */}
        {/* ========================================================================= */}
        <div className="space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-roseGold">
              P R O C E S S
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal">
              How to order
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70">
              Five simple steps from idea to doorstep.
            </p>
          </div>

          {/* 5 Numbered Step Cards with Staggered Scroll Entrance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.08, duration: 0.4, ease: luxuryEase }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-taupe-200/80 shadow-soft hover:shadow-luxury transition-shadow duration-300 flex flex-col justify-between group relative overflow-hidden cursor-default"
                >
                  {/* Top: Step Number & Dot */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-roseGold/90">
                      {s.step}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-roseGold/60 group-hover:bg-roseGold group-hover:scale-125 transition-all duration-300" />
                  </div>

                  {/* Body: Title & Description */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-1.5">
                      <IconComponent className="w-4 h-4 text-roseGold group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="font-sans text-sm sm:text-base font-bold text-charcoal leading-snug">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs text-charcoal/70 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 2: HOW TO UPLOAD PHOTOS                                             */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: luxuryEase }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-roseGold-light/40 shadow-luxury space-y-8"
        >
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-roseGold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-roseGold" />
              <span>Easy Submission</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              How to upload photos?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70">
              Simple, private, and flexible photo submission with digital approval before printing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {uploadSteps.map((u, idx) => {
              const IconComp = u.icon;
              return (
                <motion.div
                  key={u.badge}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: idx * 0.1, duration: 0.4, ease: luxuryEase }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="bg-[#FAF8F5] rounded-2xl p-5 border border-taupe-200/60 shadow-xs hover:shadow-soft-lg transition-shadow duration-300 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blush-100 text-roseGold border border-roseGold/20">
                        {u.badge}
                      </span>
                      <IconComp className="w-4 h-4 text-roseGold" />
                    </div>

                    <h4 className="font-sans text-sm sm:text-base font-bold text-charcoal">
                      {u.title}
                    </h4>

                    <p className="text-xs text-charcoal/70 leading-relaxed">
                      {u.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-taupe-200/40">
                    <span className="text-[10px] font-semibold text-roseGold flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{u.highlight}</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Reassurance Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cream-100 via-blush-50 to-cream-100 border border-roseGold-light/40 text-center text-xs text-charcoal/80 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="font-bold text-roseGold">🔒 Privacy Guaranteed:</span>
            <span>Your personal photos are kept strictly confidential, encrypted, and deleted after printing & delivery.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
