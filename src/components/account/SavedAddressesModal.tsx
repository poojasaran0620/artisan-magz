import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SavedAddress } from '../../context/AuthContext';
import { X, MapPin, Plus, Trash2, CheckCircle2, Home } from 'lucide-react';
import { modalBackdropVariants, modalDialogVariants, buttonTapSpring } from '../../styles/motion';

export const SavedAddressesModal: React.FC = () => {
  const {
    isAddressesModalOpen,
    closeAddressesModal,
    savedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
  } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !streetAddress || !city || !pincode) {
      alert('Please fill out all address fields');
      return;
    }

    addSavedAddress({
      label: newLabel,
      recipientName,
      phone,
      streetAddress,
      city,
      pincode,
      isDefault: savedAddresses.length === 0,
    });

    // Reset form
    setRecipientName('');
    setPhone('');
    setStreetAddress('');
    setCity('');
    setPincode('');
    setIsAdding(false);
  };

  return (
    <AnimatePresence>
      {isAddressesModalOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeAddressesModal}
        >
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-luxury border border-white/80 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-taupe-200/60 flex items-center justify-between bg-cream-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cream-200 flex items-center justify-center text-charcoal">
              <MapPin className="w-5 h-5 text-roseGold" />
            </div>
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold text-charcoal">Saved Delivery Addresses</h2>
              <p className="text-xs text-taupe-600">Speed up checkout with saved addresses</p>
            </div>
          </div>

          <button
            onClick={closeAddressesModal}
            className="p-2 text-charcoal/50 hover:text-charcoal rounded-full hover:bg-cream-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {!isAdding ? (
            <>
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-roseGold/40 hover:border-roseGold bg-blush-50/40 hover:bg-blush-50 text-roseGold font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Delivery Address</span>
              </button>

              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      addr.isDefault
                        ? 'border-roseGold ring-1 ring-roseGold/30 shadow-xs'
                        : 'border-taupe-200/80 hover:border-taupe-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-cream-200 text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Default</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] text-roseGold hover:underline font-semibold px-2 py-1"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => deleteSavedAddress(addr.id)}
                          className="p-1.5 text-taupe-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 space-y-0.5 text-xs text-charcoal">
                      <div className="font-bold">{addr.recipientName}</div>
                      <div className="text-taupe-700 leading-relaxed">{addr.streetAddress}</div>
                      <div className="text-taupe-700">
                        {addr.city} - {addr.pincode}
                      </div>
                      <div className="text-[11px] text-taupe-500 pt-0.5">Phone: +91 {addr.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Add Address Form */
            <form onSubmit={handleSaveNew} className="space-y-3 bg-white p-4 rounded-2xl border border-taupe-200">
              <div className="flex items-center justify-between pb-2 border-b border-taupe-100">
                <h3 className="font-sans font-bold text-sm text-charcoal">New Delivery Address</h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-taupe-500 hover:text-charcoal"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-taupe-700 uppercase tracking-wider mb-1">
                  Address Label
                </label>
                <div className="flex gap-2">
                  {['Home', "Partner's", 'Office'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                        newLabel === lbl
                          ? 'bg-charcoal text-white'
                          : 'bg-cream-100 text-charcoal hover:bg-cream-200'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-taupe-700 uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-taupe-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-taupe-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 560038"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-taupe-700 uppercase tracking-wider mb-1">
                  Street Address / Flat / Floor
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat No, Building, Landmark, Street"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold/30 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-taupe-700 uppercase tracking-wider mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-taupe-300 focus:outline-none focus:ring-2 focus:ring-roseGold/30"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-charcoal text-white rounded-xl text-xs font-bold hover:bg-charcoal-dark transition cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
