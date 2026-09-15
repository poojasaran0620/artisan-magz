import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Sparkles, Building2, Home, Briefcase, Heart, Navigation, Search, Loader2 } from 'lucide-react';
import type { SavedAddress } from '../../context/AuthContext';
import { INDIAN_STATES, getPincodeHint } from '../../data/indiaLocations';
import { modalBackdropVariants, modalDialogVariants } from '../../styles/motion';
import { searchLocationIQ, LocationSuggestion } from '../../services/locationService';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: Omit<SavedAddress, 'id'>) => void;
  initialValues?: Partial<SavedAddress>;
  title?: string;
}

const ADDRESS_TAGS = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Work', label: 'Work', icon: Briefcase },
  { id: 'Partner', label: "Partner's Place", icon: Heart },
  { id: 'Other', label: 'Other', icon: Navigation },
] as const;

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
  title = 'Add Delivery Address',
}) => {
  const [label, setLabel] = useState<SavedAddress['label']>(initialValues?.label || 'Home');
  const [recipientName, setRecipientName] = useState(initialValues?.recipientName || '');
  const [phone, setPhone] = useState(initialValues?.phone || '');
  const [houseFlat, setHouseFlat] = useState(initialValues?.houseFlat || '');
  const [areaStreet, setAreaStreet] = useState(initialValues?.areaStreet || '');
  const [landmark, setLandmark] = useState(initialValues?.landmark || '');
  const [city, setCity] = useState(initialValues?.city || '');
  const [state, setState] = useState(initialValues?.state || 'Karnataka');
  const [pincode, setPincode] = useState(initialValues?.pincode || '');
  const [isDefault, setIsDefault] = useState(initialValues?.isDefault || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // LocationIQ Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced LocationIQ search effect
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const abortCtrl = new AbortController();
    setIsSearching(true);

    const timer = setTimeout(async () => {
      const results = await searchLocationIQ(searchQuery, abortCtrl.signal);
      setSuggestions(results);
      setIsSearching(false);
      setShowSuggestions(results.length > 0);
    }, 320);

    return () => {
      clearTimeout(timer);
      abortCtrl.abort();
    };
  }, [searchQuery]);

  // Close suggestions if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (sug: LocationSuggestion) => {
    if (sug.houseFlat && !houseFlat) setHouseFlat(sug.houseFlat);
    if (sug.areaStreet) setAreaStreet(sug.areaStreet);
    if (sug.landmark && !landmark) setLandmark(sug.landmark);
    if (sug.city) setCity(sug.city);
    if (sug.state) setState(sug.state);
    if (sug.pincode) setPincode(sug.pincode);

    setShowSuggestions(false);
    setSearchQuery('');
  };

  // Auto-fill city/state when pincode is typed
  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);

    if (clean.length === 6) {
      const hint = getPincodeHint(clean);
      if (hint) {
        if (hint.state) setState(hint.state);
        if (hint.city && !city) setCity(hint.city);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!recipientName.trim()) newErrors.recipientName = 'Recipient name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Valid 10-digit mobile number required';
    }
    if (!houseFlat.trim()) newErrors.houseFlat = 'Flat / House No. / Building is required';
    if (!areaStreet.trim()) newErrors.areaStreet = 'Area / Colony / Street is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!pincode.trim() || pincode.length !== 6) newErrors.pincode = '6-digit PIN code required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({
      label,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      houseFlat: houseFlat.trim(),
      areaStreet: areaStreet.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
          onClick={onClose}
        >
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-lg bg-[#FCFAF7] rounded-3xl shadow-luxury border border-roseGold-light/60 overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 bg-white border-b border-roseGold-light/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cream-100 flex items-center justify-center text-charcoal border border-taupe-200/60">
                  <MapPin className="w-4 h-4 text-roseGold" />
                </div>
                <div>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-charcoal">{title}</h3>
                  <p className="text-[11px] text-taupe-600">Enter accurate details for smooth gift delivery</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              {/* LocationIQ Street / Locality Search Bar (Zomato-style) */}
              <div ref={searchContainerRef} className="relative">
                <label className="block text-[11px] font-bold text-charcoal/80 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-roseGold" />
                    <span>Search Locality / Apartment / Street</span>
                  </span>
                  <span className="text-[10px] text-taupe-500 lowercase font-normal">auto-fills address</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-taupe-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="e.g. Indiranagar 14th Main, Hiranandani Gardens, Cyber Hub..."
                    className="w-full text-xs bg-white border border-roseGold/40 focus:border-roseGold rounded-xl pl-9 pr-8 py-2.5 shadow-2xs outline-none focus:ring-1 focus:ring-roseGold/30"
                  />
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 text-roseGold animate-spin absolute right-3 top-3.5" />
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="text-taupe-400 hover:text-charcoal absolute right-3 top-3"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-luxury border border-taupe-200/90 z-50 overflow-hidden divide-y divide-taupe-100 max-h-56 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
                    {suggestions.map((sug) => (
                      <button
                        key={sug.placeId}
                        type="button"
                        onClick={() => handleSelectSuggestion(sug)}
                        className="w-full px-3.5 py-2.5 text-left hover:bg-cream-100 flex items-start gap-2.5 transition cursor-pointer group"
                      >
                        <MapPin className="w-3.5 h-3.5 text-roseGold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-charcoal truncate">
                            {sug.name || sug.displayName.split(',')[0]}
                          </div>
                          <div className="text-[11px] text-taupe-600 line-clamp-1">
                            {sug.displayName}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Address Tag Selector (Zomato-style) */}
              <div>
                <label className="block text-[11px] font-bold text-charcoal/80 uppercase tracking-wider mb-2">
                  Save Address As
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ADDRESS_TAGS.map((tag) => {
                    const Icon = tag.icon;
                    const isSelected = label === tag.id;
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setLabel(tag.id)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-roseGold/10 border-roseGold text-roseGold font-bold shadow-2xs'
                            : 'bg-white border-taupe-200/80 hover:bg-cream-100 text-charcoal/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{tag.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className={`w-full text-xs bg-white border rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none ${
                      errors.recipientName ? 'border-red-400 bg-red-50/20' : 'border-taupe-300/80'
                    }`}
                  />
                  {errors.recipientName && (
                    <p className="text-[10px] text-red-600 mt-1">{errors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full text-xs bg-white border rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-taupe-300/80'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Granular Address Line 1: House / Flat / Building */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                  Flat / House No. / Apartment / Building *
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-taupe-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Lotus Residency, 3rd Floor"
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    className={`w-full text-xs bg-white border rounded-xl pl-9 pr-3 py-2.5 focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none ${
                      errors.houseFlat ? 'border-red-400 bg-red-50/20' : 'border-taupe-300/80'
                    }`}
                  />
                </div>
                {errors.houseFlat && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.houseFlat}</p>
                )}
              </div>

              {/* Granular Address Line 2: Area / Colony / Street */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                  Area / Colony / Street / Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14th Main Road, HAL 2nd Stage, Indiranagar"
                  value={areaStreet}
                  onChange={(e) => setAreaStreet(e.target.value)}
                  className={`w-full text-xs bg-white border rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none ${
                    errors.areaStreet ? 'border-red-400 bg-red-50/20' : 'border-taupe-300/80'
                  }`}
                />
                {errors.areaStreet && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.areaStreet}</p>
                )}
              </div>

              {/* Landmark (Optional) */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                  Nearby Landmark <span className="text-taupe-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Starbucks / Near Indiranagar Metro"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs bg-white border border-taupe-300/80 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none"
                />
              </div>

              {/* PIN Code, City, State Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6 digits"
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className={`w-full text-xs bg-white border rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none ${
                      errors.pincode ? 'border-red-400 bg-red-50/20' : 'border-taupe-300/80'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-[10px] text-red-600 mt-1">{errors.pincode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full text-xs bg-white border rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none ${
                      errors.city ? 'border-red-400 bg-red-50/20' : 'border-taupe-300/80'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs bg-white border border-taupe-300/80 rounded-xl px-2.5 py-2.5 focus:ring-1 focus:ring-roseGold focus:border-roseGold outline-none"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Set as Default Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="set-as-default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-taupe-300 text-roseGold focus:ring-roseGold cursor-pointer"
                />
                <label htmlFor="set-as-default" className="text-xs text-charcoal/80 cursor-pointer">
                  Make this my default delivery address
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-taupe-200/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-taupe-300/80 text-xs font-semibold text-charcoal hover:bg-cream-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-wine-900 hover:bg-wine-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blush-200" />
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
