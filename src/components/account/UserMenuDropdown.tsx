import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Package, MapPin, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

interface UserMenuDropdownProps {
  onNavigate?: (view: string) => void;
}

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ onNavigate }) => {
  const { user, signOut, openOrdersModal, openAddressesModal, orders, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const firstName = user.name.split(' ')[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-cream-100 hover:bg-cream-200 border border-taupe-200/80 px-2.5 py-1.5 rounded-full text-xs font-semibold text-charcoal transition cursor-pointer"
        aria-label="User profile menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover border border-roseGold/40"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-roseGold text-white flex items-center justify-center text-[11px] font-bold">
            {firstName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline font-medium max-w-[100px] truncate">{firstName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-taupe-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-luxury border border-taupe-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Header */}
          <div className="p-3 bg-cream-50 rounded-xl mb-1 border border-taupe-200/40">
            <div className="font-sans font-bold text-sm text-charcoal truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-taupe-600 truncate">{user.email}</div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            {/* Admin Dashboard — visible only to admin users */}
            {isAdmin && onNavigate && (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('admin');
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-charcoal hover:bg-roseGold/10 transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-roseGold" />
                  <span className="font-semibold">Admin Dashboard</span>
                </button>
                <div className="mx-2 border-b border-taupe-200/40" />
              </>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                openOrdersModal();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-charcoal hover:bg-cream-100 transition cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-roseGold" />
                <span>My Orders</span>
              </span>
              {orders.length > 0 && (
                <span className="bg-blush-100 text-charcoal font-bold text-[10px] px-2 py-0.5 rounded-full font-sans tabular-nums">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                openAddressesModal();
              }}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-charcoal hover:bg-cream-100 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-roseGold" />
              <span>Saved Addresses</span>
            </button>

            <div className="pt-1 mt-1 border-t border-taupe-200/50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-red-700 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
