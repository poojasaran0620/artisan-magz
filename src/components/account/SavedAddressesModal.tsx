import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SavedAddress } from '../../context/AuthContext';
import { X, MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Heart, Navigation } from 'lucide-react';
import { AddressFormModal } from './AddressFormModal';
import { modalBackdropVariants, modalDialogVariants } from '../../styles/motion';

export const SavedAddressesModal: React.FC = () => {
  const {
    isAddressesModalOpen,
    closeAddressesModal,
    savedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
  } = useAuth();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const getTagIcon = (label: string) => {
    switch (label) {
      case 'Work':
        return Briefcase;
      case 'Partner':
        return Heart;
      case 'Other':
        return Navigation;
      default:
        return Home;
    }
  };

  return (
    <>
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
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-roseGold/40 hover:border-roseGold bg-blush-50/40 hover:bg-blush-50 text-roseGold font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Delivery Address</span>
                </button>

                <div className="space-y-3">
                  {savedAddresses.map((addr) => {
                    const TagIcon = getTagIcon(addr.label);
                    return (
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
                            <span className="bg-cream-100 border border-taupe-200/60 text-charcoal text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                              <TagIcon className="w-3 h-3 text-roseGold" />
                              <span>{addr.label}</span>
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
                                className="text-[11px] text-roseGold hover:underline font-semibold px-2 py-1 cursor-pointer"
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

                        <div className="mt-2.5 space-y-1 text-xs text-charcoal">
                          <div className="font-bold text-sm text-charcoal">{addr.recipientName}</div>
                          <div className="text-charcoal/80 font-medium leading-relaxed">
                            {addr.houseFlat}, {addr.areaStreet}
                          </div>
                          {addr.landmark && (
                            <div className="text-taupe-600 text-[11px]">
                              Landmark: <span className="text-charcoal/80">{addr.landmark}</span>
                            </div>
                          )}
                          <div className="text-taupe-700 font-medium">
                            {addr.city}, {addr.state} – <span className="font-mono">{addr.pincode}</span>
                          </div>
                          <div className="text-[11px] text-taupe-500 pt-1 flex items-center gap-1">
                            <span>Phone:</span>
                            <span className="font-mono text-charcoal/80">+91 {addr.phone}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Granular Address Creation Form Modal */}
      <AddressFormModal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSave={(data) => {
          addSavedAddress(data);
        }}
      />
    </>
  );
};
