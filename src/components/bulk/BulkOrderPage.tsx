import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { WhatsAppIcon } from '../ui/Icons';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

interface BulkOrderPageProps {
  onBack: () => void;
}

export const BulkOrderPage: React.FC<BulkOrderPageProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occasion, setOccasion] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [kindOfGifts, setKindOfGifts] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [anyQuestions, setAnyQuestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your Name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your Email Address.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your Phone Number.');
      return;
    }
    if (!occasion.trim()) {
      setErrorMsg('Please enter the Occasion.');
      return;
    }
    if (!estimatedQuantity.trim()) {
      setErrorMsg('Please specify an Estimated Quantity.');
      return;
    }
    if (!kindOfGifts.trim()) {
      setErrorMsg('Please specify What Kind of Gifts you need.');
      return;
    }

    setIsSubmitting(true);

    const formattedPhone = `${countryCode} ${phoneNumber.trim()}`;

    // 1. Save lead to Database (Supabase) if configured
    if (supabase && isSupabaseConfigured) {
      try {
        const { error: dbErr } = await supabase.from('bulk_inquiries').insert({
          name: name.trim(),
          email: email.trim(),
          phone: formattedPhone,
          occasion: occasion.trim(),
          estimated_quantity: estimatedQuantity.trim(),
          kind_of_gifts: kindOfGifts.trim(),
          special_requirements: specialRequirements.trim() || null,
          any_questions: anyQuestions.trim() || null,
        });
        if (dbErr) {
          console.warn('Database error when saving bulk inquiry:', dbErr);
        }
      } catch (dbErr) {
        console.warn('Could not save inquiry to database:', dbErr);
      }
    }

    // 2. Save lead to local storage as backup
    const newInquiry = {
      id: `bulk-${Date.now()}`,
      date: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      phone: formattedPhone,
      occasion: occasion.trim(),
      estimatedQuantity: estimatedQuantity.trim(),
      kindOfGifts: kindOfGifts.trim(),
      specialRequirements: specialRequirements.trim(),
      anyQuestions: anyQuestions.trim(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('artisan_bulk_inquiries') || '[]');
      localStorage.setItem('artisan_bulk_inquiries', JSON.stringify([newInquiry, ...existing]));
    } catch {
      // Ignore storage errors
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCF5] via-cream-100/40 to-[#FAF6F0] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Soft Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-roseGold-light/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Back Button */}
        <div>
          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal/70 hover:text-roseGold transition cursor-pointer bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-taupe-200/70 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-roseGold" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* 1. Introductory Info Card */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF6F0] rounded-[2.5rem] p-6 sm:p-10 shadow-luxury border border-roseGold-light/50 text-center space-y-5">
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#D97C90] font-normal tracking-wide drop-shadow-xs">
            Bulk Orders ✨
          </h1>

          <div className="max-w-xl mx-auto space-y-4 text-charcoal/80 text-sm sm:text-base leading-relaxed">
            <p className="font-serif text-lg sm:text-xl text-charcoal font-medium">
              Planning a special event or need gifts in bulk?
            </p>
            <p>
              Artisan Magz can create personalised magazines in quantities to match your needs. 💌
            </p>
            <p className="font-serif italic text-roseGold font-medium">
              Perfect for weddings, birthdays, corporate events, farewell parties & more.
            </p>
            <p>
              Share your requirements with us, and we’ll take care of the customisation, design & delivery. 🤍
            </p>
            <p className="font-serif text-base sm:text-lg font-bold text-charcoal pt-2">
              Have a bulk order? Let’s create something memorable together! ✨
            </p>
          </div>
        </div>

        {/* 2. Form Card */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-luxury border border-roseGold-light/40 relative">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-bold">
                Inquiry Received! ✨
              </h2>
              <p className="text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-charcoal">{name}</strong>! Your bulk order inquiry has been submitted into our database. Our team will review your requirements and respond within 24 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-charcoal text-white hover:bg-charcoal-dark font-medium text-xs tracking-wider transition cursor-pointer shadow-soft"
                >
                  Return to Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhoneNumber('');
                    setOccasion('');
                    setEstimatedQuantity('');
                    setKindOfGifts('');
                    setSpecialRequirements('');
                    setAnyQuestions('');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-cream-100 text-charcoal hover:bg-cream-200 font-medium text-xs tracking-wider border border-taupe-200 transition cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-taupe-200/60 pb-4">
                <h2 className="font-serif text-3xl sm:text-4xl text-[#2B354F] font-normal">
                  Bulk Order
                </h2>
                <p className="text-xs text-charcoal/60 mt-1">
                  Fill out the form below to receive a custom quote and design consultation.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-blush-50 border border-blush-200 text-blush-900 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Name<span className="text-roseGold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Email<span className="text-roseGold">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Phone Number<span className="text-roseGold">*</span>
                </label>
                <div className="grid grid-cols-12 gap-2.5">
                  <div className="col-span-5 sm:col-span-4">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold text-xs sm:text-sm text-charcoal transition outline-none cursor-pointer"
                    >
                      <option value="+91">India +91</option>
                      <option value="+1">US/CA +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+971">UAE +971</option>
                      <option value="+65">Singapore +65</option>
                      <option value="+61">Australia +61</option>
                    </select>
                  </div>
                  <div className="col-span-7 sm:col-span-8">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder=""
                      className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Occasion */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Occasion<span className="text-roseGold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none"
                />
              </div>

              {/* Estimated Quantity */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Estimated Quantity<span className="text-roseGold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none"
                />
              </div>

              {/* What Kind of Gifts? */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  What Kind of Gifts?<span className="text-roseGold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kindOfGifts}
                  onChange={(e) => setKindOfGifts(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none"
                />
              </div>

              {/* Special Requirements */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Special Requirements
                </label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none resize-y"
                />
              </div>

              {/* Any Questions */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-serif text-xs sm:text-sm text-charcoal font-medium">
                  Any Questions
                </label>
                <textarea
                  rows={2}
                  value={anyQuestions}
                  onChange={(e) => setAnyQuestions(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-2.5 rounded-lg sm:rounded-xl bg-[#ECE8E1]/45 hover:bg-[#ECE8E1]/60 focus:bg-white border border-taupe-200/80 focus:border-roseGold focus:ring-2 focus:ring-roseGold/20 text-xs sm:text-sm text-charcoal transition outline-none resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-charcoal hover:bg-charcoal-dark disabled:opacity-60 text-white font-medium text-sm sm:text-base tracking-wide shadow-luxury hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Send className="w-4 h-4 text-roseGold group-hover:translate-x-0.5 transition-transform" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
                <p className="text-center text-[11px] text-taupe-600 mt-2">
                  🔒 We respect your privacy. Your inquiry will be submitted directly to our database.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button (As seen in screenshot) */}
      <a
        href="https://wa.me/919876543210?text=Hi%20Artisan%20Magz!%20I%20have%20an%20inquiry%20regarding%20Bulk%20Orders."
        target="_blank"
        rel="noreferrer"
        aria-label="Direct WhatsApp Chat"
        className="fixed bottom-6 right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-luxury transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  );
};
