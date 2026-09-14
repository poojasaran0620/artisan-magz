import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { MagazineTemplate } from '../../types/product';
import { InteractiveFlipbook } from '../magazine/InteractiveFlipbook';
import { MagazinePageContent } from '../magazine/MagazinePageSpread';
import { modalBackdropVariants, modalDialogVariants, buttonTapSpring } from '../../styles/motion';

interface TemplatePreviewModalProps {
  template: MagazineTemplate | null;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onSelectTemplate,
}) => {
  const isOpen = Boolean(template);

  // Convert template into rich MagazinePageContent structure
  const pages: MagazinePageContent[] = template
    ? [
        {
          id: `${template.id}-cover`,
          pageNumber: 1,
          type: 'cover',
          title: template.name,
          subtitle: template.tagline,
          date: 'Bespoke Studio Edition',
          image: template.coverImage,
        },
        ...template.previewPages.map((imgUrl, idx) => ({
          id: `${template.id}-p${idx + 2}`,
          pageNumber: idx + 2,
          type: (idx % 2 === 0 ? 'editorial' : 'collage') as MagazinePageContent['type'],
          title: idx % 2 === 0 ? 'Chapter of Us' : 'Memories Reel',
          caption: `Handcrafted layouts designed specifically for ${template.suitableFor.toLowerCase()}.`,
          image: imgUrl,
        })),
        {
          id: `${template.id}-back`,
          pageNumber: template.previewPages.length + 2,
          type: 'backCover',
          title: 'Artisan Magz Studio',
          image: '/artisan_logo_horizontal.png',
        },
      ]
    : [];

  return (
    <AnimatePresence>
      {isOpen && template && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 bg-charcoal/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={onClose}
        >
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-[#FDFCF5] rounded-3xl max-w-4xl w-full overflow-hidden shadow-luxury border border-taupe-200/80 relative flex flex-col max-h-[96vh]"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-taupe-200/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-blush-100 text-roseGold flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  {template.name}
                </h3>
                {template.badge && (
                  <span className="text-[10px] bg-blush-100 text-roseGold font-bold px-2.5 py-0.5 rounded-full border border-roseGold/20">
                    {template.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-taupe-700">{template.suitableFor}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-50 border border-taupe-200 flex items-center justify-center text-charcoal hover:text-roseGold hover:bg-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Interactive Flipbook Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-[#FDFCF5] to-cream-100 flex flex-col items-center justify-center">
          <InteractiveFlipbook
            pages={pages}
            magazineTitle={template.name}
            onCustomizeClick={() => {
              onSelectTemplate(template.id);
              onClose();
            }}
          />

          {/* Template Details Description */}
          <div className="mt-3 text-center max-w-lg">
            <p className="text-xs text-taupe-700 leading-relaxed italic font-serif">
              "{template.description}"
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-taupe-200/60 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-taupe-600 block font-medium">Available in:</span>
            <span className="text-xs font-semibold text-charcoal">
              8 Pages • 12 Pages • 16 Pages • 20 Pages (From ₹899)
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectTemplate(template.id);
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] text-xs sm:text-sm font-bold rounded-full shadow-luxury flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-roseGold-light" />
            <span>Customize with This Template</span>
          </button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
