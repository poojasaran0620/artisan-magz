import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export type OrderStatusFilter = 'all' | 'placed' | 'printing' | 'dispatched' | 'delivered';
export type SortOrder = 'newest' | 'oldest';

interface AdminOrderFiltersProps {
  statusFilter: OrderStatusFilter;
  onStatusFilterChange: (status: OrderStatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  totalCount: number;
}

const STATUS_TABS: { value: OrderStatusFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'bg-charcoal text-white' },
  { value: 'placed', label: 'Placed', color: 'bg-amber-500 text-white' },
  { value: 'printing', label: 'Printing', color: 'bg-pink-500 text-white' },
  { value: 'dispatched', label: 'Dispatched', color: 'bg-blue-500 text-white' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-500 text-white' },
];

export const AdminOrderFilters: React.FC<AdminOrderFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortOrderChange,
  totalCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by order number, customer name, or city…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-taupe-200/80 rounded-xl text-xs text-charcoal placeholder:text-taupe-400 focus:outline-none focus:ring-2 focus:ring-roseGold/30 focus:border-roseGold transition"
        />
      </div>

      {/* Status Filter Tabs + Sort */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onStatusFilterChange(tab.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  isActive
                    ? tab.color
                    : 'bg-cream-100 text-taupe-600 hover:bg-cream-200 border border-taupe-200/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-taupe-500 font-sans tabular-nums">{totalCount} orders</span>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-taupe-200/60 text-[11px] text-taupe-600 hover:bg-cream-100 transition cursor-pointer"
            title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
