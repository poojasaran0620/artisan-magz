import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// ── Admin Access Control ───────────────────────────────────────────────
export const ADMIN_EMAILS: readonly string[] = [
  'poojasaran0620@gmail.com',
  'vijayrathod8422@gmail.com',
  'artisanmagz@gmail.com',
] as const;

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItemSummary {
  title: string;
  variantName?: string;
  quantity: number;
  price: number;
  image?: string;
  customizationSummary?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'placed' | 'printing' | 'dispatched' | 'delivered';
  items: OrderItemSummary[];
  totalAmount: number;
  deliveryAddress: {
    recipientName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Modal visibility controls
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isOrdersModalOpen: boolean;
  openOrdersModal: () => void;
  closeOrdersModal: () => void;
  isAddressesModalOpen: boolean;
  openAddressesModal: () => void;
  closeAddressesModal: () => void;

  // Addresses
  savedAddresses: SavedAddress[];
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => SavedAddress;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: OrderRecord[];
  recordOrder: (order: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => OrderRecord;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'artisan_magz_auth_user_v1';
const ADDRESSES_STORAGE_KEY = 'artisan_magz_addresses_v1';
const ORDERS_STORAGE_KEY = 'artisan_magz_orders_v1';

// Sample initial address for demo convenience
const INITIAL_SAMPLE_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-default',
    label: 'Home',
    recipientName: 'Priya Sharma',
    phone: '9876543210',
    streetAddress: 'Flat 402, Lotus Residency, 14th Main Road, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    isDefault: true,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState<boolean>(false);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ADDRESSES;
    } catch {
      return INITIAL_SAMPLE_ADDRESSES;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync Supabase Auth state if configured
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Keepsake Lover',
          avatarUrl: session.user.user_metadata?.avatar_url,
          phone: session.user.phone,
        };
        setUser(u);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Keepsake Lover',
          avatarUrl: session.user.user_metadata?.avatar_url,
          phone: session.user.phone,
        };
        setUser(u);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));

        // Sync profile to database
        if (supabase) {
          try {
            await supabase.from('profiles').upsert({
              id: u.id,
              email: u.email,
              full_name: u.name,
              avatar_url: u.avatarUrl,
              phone: u.phone,
            }, { onConflict: 'id' });
          } catch (err) {
            console.warn('Could not sync user to profiles table', err);
          }
          // Fetch remote addresses and orders
          syncUserData(u.id);
        }
      } else {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch remote user data from Supabase
  const syncUserData = async (userId: string) => {
    if (!supabase) return;
    try {
      const [addrRes, orderRes] = await Promise.all([
        supabase.from('saved_addresses').select('*').eq('user_id', userId),
        supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);

      if (addrRes.data && addrRes.data.length > 0) {
        const mapped: SavedAddress[] = addrRes.data.map((r: any) => ({
          id: r.id,
          label: r.label || 'Home',
          recipientName: r.recipient_name,
          phone: r.phone,
          streetAddress: r.street_address,
          city: r.city,
          pincode: r.pincode,
          isDefault: Boolean(r.is_default),
        }));
        setSavedAddresses(mapped);
      }

      if (orderRes.data && orderRes.data.length > 0) {
        const mappedOrders: OrderRecord[] = orderRes.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          createdAt: o.created_at,
          status: o.status,
          items: o.items || [],
          totalAmount: Number(o.total_amount) || 0,
          deliveryAddress: o.delivery_address || {
            recipientName: '',
            phone: '',
            address: '',
            city: '',
            pincode: '',
          },
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.warn('Could not sync user remote data:', err);
    }
  };

  // Save addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(savedAddresses));
    } catch (e) {
      console.error('Failed to save addresses', e);
    }
  }, [savedAddresses]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openOrdersModal = () => setIsOrdersModalOpen(true);
  const closeOrdersModal = () => setIsOrdersModalOpen(false);
  const openAddressesModal = () => setIsAddressesModalOpen(true);
  const closeAddressesModal = () => setIsAddressesModalOpen(false);

  // 1-Click Google Sign-In with real Google OAuth and graceful fallback
  const signInWithGoogle = async (customProfile?: { name: string; email: string }) => {
    setIsLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        return;
      }

      // Instant 1-Click Sign-In for offline / local preview
      await new Promise((r) => setTimeout(r, 400));
      const isCustomObj = customProfile && typeof customProfile === 'object' && 'email' in customProfile;
      const userEmail = isCustomObj ? customProfile.email : 'priya.sharma@gmail.com';
      const userName = isCustomObj ? customProfile.name : 'Priya Sharma';
      const demoUser: AuthUser = {
        id: `usr-google-${Date.now()}`,
        email: userEmail,
        name: userName,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName)}`,
        phone: '9876543210',
      };
      setUser(demoUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      setIsAuthModalOpen(false);
    } catch (err) {
      console.warn('Direct Google redirect encountered an issue, logging in with 1-click profile fallback:', err);
      const isCustomObj = customProfile && typeof customProfile === 'object' && 'email' in customProfile;
      const userEmail = isCustomObj ? customProfile.email : 'priya.sharma@gmail.com';
      const userName = isCustomObj ? customProfile.name : 'Priya Sharma';
      const demoUser: AuthUser = {
        id: `usr-google-${Date.now()}`,
        email: userEmail,
        name: userName,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName)}`,
        phone: '9876543210',
      };
      setUser(demoUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Address Management
  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>): SavedAddress => {
    const newAddress: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
      isDefault: savedAddresses.length === 0 ? true : addr.isDefault,
    };
    setSavedAddresses((prev) => [newAddress, ...prev]);

    if (supabase && user && user.id && !user.id.startsWith('usr-google-')) {
      supabase.from('saved_addresses').insert({
        user_id: user.id,
        label: newAddress.label,
        recipient_name: newAddress.recipientName,
        phone: newAddress.phone,
        street_address: newAddress.streetAddress,
        city: newAddress.city,
        pincode: newAddress.pincode,
        is_default: Boolean(newAddress.isDefault),
      }).then(({ error }) => {
        if (error) console.warn('Failed to insert address into Supabase:', error);
      });
    }

    return newAddress;
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (supabase && user && user.id && !user.id.startsWith('usr-google-')) {
      supabase.from('saved_addresses').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Failed to delete address from Supabase:', error);
      });
    }
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  // Record Order
  const recordOrder = (orderData: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'status'>): OrderRecord => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `AM-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'placed',
    };
    setOrders((prev) => [newOrder, ...prev]);

    if (supabase) {
      const isRealUser = user && user.id && !user.id.startsWith('usr-google-');
      supabase.from('orders').insert({
        order_number: newOrder.orderNumber,
        user_id: isRealUser ? user.id : null,
        status: newOrder.status,
        items: newOrder.items,
        total_amount: newOrder.totalAmount,
        delivery_address: newOrder.deliveryAddress,
      }).then(({ error }) => {
        if (error) console.warn('Failed to record order into Supabase:', error);
      });
    }

    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: isAdminEmail(user?.email),
        isLoading,
        signInWithGoogle,
        signOut,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isOrdersModalOpen,
        openOrdersModal,
        closeOrdersModal,
        isAddressesModalOpen,
        openAddressesModal,
        closeAddressesModal,
        savedAddresses,
        addSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        orders,
        recordOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
