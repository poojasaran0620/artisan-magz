import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  ShieldCheck,
  ShoppingBag,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  MessageCircle,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { OrderRecord } from '../../context/AuthContext';
import { ADMIN_EMAILS, isAdminEmail } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  city?: string;
  state?: string;
  role: 'admin' | 'customer';
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  firstSeenDate: string;
  recentOrders: {
    orderNumber: string;
    date: string;
    totalAmount: number;
    status: OrderRecord['status'];
  }[];
}

interface AdminProfilesTabProps {
  orders: OrderRecord[];
  onSelectCustomerOrders?: (customerEmail: string) => void;
}

export const AdminProfilesTab: React.FC<AdminProfilesTabProps> = ({
  orders,
  onSelectCustomerOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'buyers' | 'admins' | 'registered'>('all');
  const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'recent' | 'name'>('spent');
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);

  // Compile profiles by aggregating Orders + Admin accounts + Local Auth
  const profiles = useMemo<CustomerProfile[]>(() => {
    const profileMap = new Map<string, CustomerProfile>();

    // 1. Seed Known Admin Accounts
    ADMIN_EMAILS.forEach((email, idx) => {
      const name = email.split('@')[0].replace(/[0-9]/g, '');
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1) + ' (Admin)';
      profileMap.set(email.toLowerCase().trim(), {
        id: `admin-${idx + 1}`,
        email: email.toLowerCase().trim(),
        name: formattedName,
        role: 'admin',
        ordersCount: 0,
        totalSpent: 0,
        firstSeenDate: '2026-01-01T00:00:00.000Z',
        recentOrders: [],
      });
    });

    // 2. Aggregate from Orders
    orders.forEach((order) => {
      const email = (order.deliveryAddress?.email || `${order.deliveryAddress?.phone || 'customer'}@artisanmagz.in`)
        .toLowerCase()
        .trim();
      const name = order.deliveryAddress?.recipientName || 'Keepsake Customer';
      const phone = order.deliveryAddress?.phone;
      const city = order.deliveryAddress?.city;
      const state = order.deliveryAddress?.state;

      const existing = profileMap.get(email);
      const isAdm = isAdminEmail(email);

      const orderSummary = {
        orderNumber: order.orderNumber,
        date: order.createdAt,
        totalAmount: order.totalAmount,
        status: order.status,
      };

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += order.totalAmount || 0;
        if (!existing.phone && phone) existing.phone = phone;
        if (!existing.city && city) existing.city = city;
        if (!existing.state && state) existing.state = state;
        existing.recentOrders.push(orderSummary);

        if (!existing.lastOrderDate || new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
        }
      } else {
        profileMap.set(email, {
          id: `cust-${profileMap.size + 1}`,
          email,
          name,
          phone,
          city,
          state,
          role: isAdm ? 'admin' : 'customer',
          ordersCount: 1,
          totalSpent: order.totalAmount || 0,
          firstSeenDate: order.createdAt,
          lastOrderDate: order.createdAt,
          recentOrders: [orderSummary],
        });
      }
    });

    // 3. Fallback sample profiles if list is empty (e.g. fresh environment)
    if (profileMap.size <= ADMIN_EMAILS.length) {
      const demoSamples: CustomerProfile[] = [
        {
          id: 'demo-1',
          email: 'priya.sharma@gmail.com',
          name: 'Priya Sharma',
          phone: '9876543210',
          city: 'Bengaluru',
          state: 'Karnataka',
          role: 'customer',
          ordersCount: 3,
          totalSpent: 4297,
          firstSeenDate: '2026-08-10T10:30:00.000Z',
          lastOrderDate: '2026-09-12T14:20:00.000Z',
          recentOrders: [
            {
              orderNumber: 'AM-2026-8942',
              date: '2026-09-12T14:20:00.000Z',
              totalAmount: 1499,
              status: 'delivered',
            },
            {
              orderNumber: 'AM-2026-7811',
              date: '2026-08-28T09:15:00.000Z',
              totalAmount: 1899,
              status: 'delivered',
            },
            {
              orderNumber: 'AM-2026-6204',
              date: '2026-08-10T10:30:00.000Z',
              totalAmount: 899,
              status: 'delivered',
            },
          ],
        },
        {
          id: 'demo-2',
          email: 'rohan.roy@outlook.com',
          name: 'Rohan Roy',
          phone: '9812345678',
          city: 'Mumbai',
          state: 'Maharashtra',
          role: 'customer',
          ordersCount: 2,
          totalSpent: 3198,
          firstSeenDate: '2026-08-18T16:45:00.000Z',
          lastOrderDate: '2026-09-08T11:10:00.000Z',
          recentOrders: [
            {
              orderNumber: 'AM-2026-8102',
              date: '2026-09-08T11:10:00.000Z',
              totalAmount: 2199,
              status: 'dispatched',
            },
            {
              orderNumber: 'AM-2026-7019',
              date: '2026-08-18T16:45:00.000Z',
              totalAmount: 999,
              status: 'delivered',
            },
          ],
        },
        {
          id: 'demo-3',
          email: 'aarav.mehta@gmail.com',
          name: 'Aarav Mehta',
          phone: '9765432109',
          city: 'Delhi',
          state: 'Delhi',
          role: 'customer',
          ordersCount: 1,
          totalSpent: 1299,
          firstSeenDate: '2026-09-05T18:00:00.000Z',
          lastOrderDate: '2026-09-05T18:00:00.000Z',
          recentOrders: [
            {
              orderNumber: 'AM-2026-8450',
              date: '2026-09-05T18:00:00.000Z',
              totalAmount: 1299,
              status: 'printing',
            },
          ],
        },
      ];

      demoSamples.forEach((sample) => {
        if (!profileMap.has(sample.email)) {
          profileMap.set(sample.email, sample);
        }
      });
    }

    return Array.from(profileMap.values());
  }, [orders]);

  // Key KPI calculations
  const totalProfilesCount = profiles.length;
  const activeBuyersCount = profiles.filter((p) => p.ordersCount > 0).length;
  const totalCustomerSpend = profiles.reduce((acc, p) => acc + p.totalSpent, 0);
  const adminProfilesCount = profiles.filter((p) => p.role === 'admin').length;

  // Filter and Sort profiles
  const filteredProfiles = useMemo(() => {
    let list = [...profiles];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone && p.phone.includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.state && p.state.toLowerCase().includes(q))
      );
    }

    // Role filter
    if (roleFilter === 'buyers') {
      list = list.filter((p) => p.ordersCount > 0);
    } else if (roleFilter === 'admins') {
      list = list.filter((p) => p.role === 'admin');
    } else if (roleFilter === 'registered') {
      list = list.filter((p) => p.role !== 'admin');
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'orders') return b.ordersCount - a.ordersCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      const dateA = new Date(a.lastOrderDate || a.firstSeenDate).getTime();
      const dateB = new Date(b.lastOrderDate || b.firstSeenDate).getTime();
      return dateB - dateA;
    });

    return list;
  }, [profiles, searchQuery, roleFilter, sortBy]);

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'CU';
  };

  return (
    <div className="space-y-6">
      {/* ── KPI Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-100 rounded-2xl p-4 border border-taupe-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-charcoal shadow-2xs">
            <Users className="w-5 h-5 text-roseGold" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-taupe-500 uppercase tracking-wider block">
              Total Profiles
            </span>
            <span className="font-sans font-bold tabular-nums text-lg sm:text-xl text-charcoal">
              {totalProfilesCount}
            </span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-2xs">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Active Buyers
            </span>
            <span className="font-sans font-bold tabular-nums text-lg sm:text-xl text-emerald-950">
              {activeBuyersCount}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-700 shadow-2xs">
            <IndianRupee className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Total Customer Value
            </span>
            <span className="font-sans font-bold tabular-nums text-lg sm:text-xl text-amber-950">
              {formatPrice(totalCustomerSpend)}
            </span>
          </div>
        </div>

        <div className="bg-roseGold/10 rounded-2xl p-4 border border-roseGold/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-roseGold shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-roseGold" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-roseGold uppercase tracking-wider block">
              Admin Accounts
            </span>
            <span className="font-sans font-bold tabular-nums text-lg sm:text-xl text-charcoal">
              {adminProfilesCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-taupe-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-taupe-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, or city..."
              className="w-full text-xs bg-cream-50/50 border border-taupe-200/80 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-roseGold focus:ring-1 focus:ring-roseGold/30 text-charcoal"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-taupe-500 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-taupe-200/80 rounded-xl px-3 py-2 text-charcoal font-medium outline-none focus:border-roseGold cursor-pointer"
            >
              <option value="spent">Highest Spend</option>
              <option value="orders">Most Orders</option>
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-taupe-100">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'all'
                ? 'bg-charcoal text-white shadow-2xs'
                : 'bg-cream-100 text-charcoal/80 hover:bg-cream-200'
            }`}
          >
            <span>All Profiles</span>
            <span className="text-[10px] font-sans font-bold tabular-nums opacity-75">
              {profiles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('buyers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'buyers'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span>Active Buyers</span>
            <span className="text-[10px] font-sans font-bold tabular-nums opacity-75">
              {activeBuyersCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('admins')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'admins'
                ? 'bg-roseGold text-white shadow-2xs'
                : 'bg-roseGold/10 text-roseGold hover:bg-roseGold/20'
            }`}
          >
            <span>Admins</span>
            <span className="text-[10px] font-sans font-bold tabular-nums opacity-75">
              {adminProfilesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('registered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'registered'
                ? 'bg-charcoal text-white shadow-2xs'
                : 'bg-cream-100 text-charcoal/80 hover:bg-cream-200'
            }`}
          >
            <span>Customers Only</span>
            <span className="text-[10px] font-sans font-bold tabular-nums opacity-75">
              {profiles.length - adminProfilesCount}
            </span>
          </button>
        </div>
      </div>

      {/* ── Profiles List ────────────────────────────────────────── */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-taupe-200/80 shadow-2xs space-y-2">
          <User className="w-8 h-8 text-taupe-400 mx-auto" />
          <h3 className="font-serif text-base font-bold text-charcoal">No customer profiles found</h3>
          <p className="text-xs text-taupe-500 max-w-sm mx-auto">
            Try adjusting your search query or role filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProfiles.map((profile) => {
            const isExpanded = expandedProfileId === profile.id;
            const cleanPhone = profile.phone ? profile.phone.replace(/\D/g, '') : '';
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hi ${profile.name}! Thank you for shopping with Artisan Magz.`
                )}`
              : null;

            return (
              <div
                key={profile.id}
                className="bg-white rounded-2xl border border-taupe-200/80 shadow-2xs overflow-hidden transition-all hover:border-roseGold/40"
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Avatar & Core Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                        profile.role === 'admin'
                          ? 'bg-gradient-to-br from-amber-500 to-roseGold text-white'
                          : profile.ordersCount > 0
                          ? 'bg-cream-200 text-charcoal border border-roseGold/30'
                          : 'bg-cream-100 text-taupe-600 border border-taupe-200/60'
                      }`}
                    >
                      {getInitials(profile.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-sans text-sm font-bold text-charcoal truncate">
                          {profile.name}
                        </h4>

                        {profile.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                            <ShieldCheck className="w-3 h-3 text-amber-700" />
                            <span>Admin</span>
                          </span>
                        ) : profile.ordersCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>Customer</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cream-100 text-taupe-600 border border-taupe-200/60">
                            <User className="w-3 h-3 text-taupe-400" />
                            <span>Registered</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-taupe-600 mt-1">
                        <span className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-taupe-400 shrink-0" />
                          <a
                            href={`mailto:${profile.email}`}
                            className="hover:text-charcoal hover:underline"
                          >
                            {profile.email}
                          </a>
                        </span>

                        {profile.phone && (
                          <span className="flex items-center gap-1.5 font-mono text-charcoal/80">
                            <Phone className="w-3 h-3 text-taupe-400 shrink-0" />
                            <a href={`tel:${profile.phone}`} className="hover:text-charcoal">
                              {profile.phone}
                            </a>
                          </span>
                        )}

                        {(profile.city || profile.state) && (
                          <span className="flex items-center gap-1 text-taupe-500">
                            <MapPin className="w-3 h-3 text-roseGold shrink-0" />
                            <span>
                              {[profile.city, profile.state].filter(Boolean).join(', ')}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spend, Order Count & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-taupe-100">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-taupe-500 uppercase tracking-wider font-semibold">
                        Lifetime Spend
                      </div>
                      <div className="font-sans font-bold tabular-nums text-sm sm:text-base text-charcoal">
                        {formatPrice(profile.totalSpent)}
                      </div>
                      <div className="text-[11px] text-taupe-500">
                        <span className="font-sans font-bold tabular-nums">{profile.ordersCount}</span>{' '}
                        {profile.ordersCount === 1 ? 'order' : 'orders'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-sage-50 text-sage-800 hover:bg-sage-100 border border-sage-200 transition"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-sage" />
                        </a>
                      )}

                      <a
                        href={`mailto:${profile.email}?subject=Artisan Magz Support`}
                        className="p-2 rounded-xl bg-cream-100 text-charcoal hover:bg-cream-200 border border-taupe-200 transition"
                        title="Email Customer"
                      >
                        <Mail className="w-3.5 h-3.5 text-roseGold" />
                      </a>

                      {profile.recentOrders.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandedProfileId(isExpanded ? null : profile.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-cream-100 text-charcoal text-xs font-semibold hover:bg-cream-200 border border-taupe-200 flex items-center gap-1 transition cursor-pointer"
                        >
                          <span>Orders</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Order History Drawer */}
                {isExpanded && profile.recentOrders.length > 0 && (
                  <div className="bg-cream-50/70 p-4 border-t border-taupe-200/80 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider">
                        Order History ({profile.recentOrders.length})
                      </span>
                      {onSelectCustomerOrders && (
                        <button
                          type="button"
                          onClick={() => onSelectCustomerOrders(profile.email)}
                          className="text-[11px] text-roseGold hover:text-wine-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>View in Orders Tab</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {profile.recentOrders.map((ord) => (
                        <div
                          key={ord.orderNumber}
                          className="bg-white rounded-xl p-3 border border-taupe-200/80 shadow-2xs space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-charcoal text-[11px]">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'dispatched'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'printing'
                                  ? 'bg-pink-100 text-pink-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-taupe-600 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-taupe-400" />
                              <span className="font-mono">
                                {new Date(ord.date).toLocaleDateString('en-IN')}
                              </span>
                            </span>
                            <span className="font-sans font-bold tabular-nums text-charcoal">
                              {formatPrice(ord.totalAmount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
