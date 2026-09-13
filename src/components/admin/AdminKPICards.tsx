import React from 'react';
import { Package, Clock, Sparkles, Truck, CheckCircle2, IndianRupee } from 'lucide-react';
import type { OrderRecord } from '../../context/AuthContext';

interface AdminKPICardsProps {
  orders: OrderRecord[];
}

interface KPICard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const AdminKPICards: React.FC<AdminKPICardsProps> = ({ orders }) => {
  const total = orders.length;
  const placed = orders.filter((o) => o.status === 'placed').length;
  const printing = orders.filter((o) => o.status === 'printing').length;
  const dispatched = orders.filter((o) => o.status === 'dispatched').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards: KPICard[] = [
    {
      label: 'Total Orders',
      value: total,
      icon: <Package className="w-5 h-5" />,
      color: 'text-charcoal',
      bgColor: 'bg-cream-100',
      borderColor: 'border-taupe-200/60',
    },
    {
      label: 'Pending',
      value: placed,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/60',
    },
    {
      label: 'In Production',
      value: printing,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200/60',
    },
    {
      label: 'Dispatched',
      value: dispatched,
      icon: <Truck className="w-5 h-5" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/60',
    },
    {
      label: 'Delivered',
      value: delivered,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/60',
    },
    {
      label: 'Revenue',
      value: formatCurrency(revenue),
      icon: <IndianRupee className="w-5 h-5" />,
      color: 'text-sage-700',
      bgColor: 'bg-sage-50',
      borderColor: 'border-sage-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-4 flex flex-col gap-1.5 transition hover:shadow-soft`}
        >
          <div className={`${card.color} flex items-center gap-1.5`}>
            {card.icon}
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
              {card.label}
            </span>
          </div>
          <div className={`${card.color} font-sans font-bold tabular-nums text-xl sm:text-2xl`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};
