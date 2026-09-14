import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, MapPin, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { UserProfileIcon } from '../ui/Icons';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

interface UserMenuDropdownProps {
  onNavigate?: (view: string) => void;
}

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ onNavigate }) => {
  const { user, signOut, openOrdersModal, openAddressesModal, orders, isAdmin } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 bg-cream-100 hover:bg-cream-200 border border-taupe-200/80 px-2.5 py-1.5 rounded-full text-xs font-semibold text-charcoal transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-roseGold"
          aria-label="User profile menu"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-roseGold/40"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-roseGold/10 text-roseGold flex items-center justify-center border border-roseGold/30">
              <UserProfileIcon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="hidden sm:inline font-medium max-w-[100px] truncate">{firstName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-taupe-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 shadow-luxury border-taupe-200/80">
        {/* User Header */}
        <div className="p-3 bg-cream-50 rounded-xl mb-1 border border-taupe-200/40">
          <div className="font-sans font-bold text-sm text-charcoal truncate">
            {user.name}
          </div>
          <div className="text-[11px] text-taupe-600 truncate">{user.email}</div>
        </div>

        {/* Menu Items */}
        <div className="space-y-0.5">
          {isAdmin && onNavigate && (
            <>
              <DropdownMenuItem
                onClick={() => onNavigate('admin')}
                className="hover:bg-roseGold/10 cursor-pointer font-medium"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-roseGold" />
                <span className="font-semibold">Admin Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={() => openOrdersModal()}
            className="justify-between cursor-pointer font-medium"
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-roseGold" />
              <span>My Orders</span>
            </span>
            {orders.length > 0 && (
              <Badge variant="default" className="text-[10px] px-2 py-0.5 tabular-nums">
                {orders.length}
              </Badge>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openAddressesModal()}
            className="cursor-pointer font-medium gap-2"
          >
            <MapPin className="w-4 h-4 text-roseGold" />
            <span>Saved Addresses</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer font-medium text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
