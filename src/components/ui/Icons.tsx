import React from 'react';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.031 2C6.505 2 2.02 6.484 2.02 12.008c0 1.899.53 3.682 1.451 5.209L2.08 22l4.954-1.35c1.47.828 3.167 1.357 4.997 1.357 5.525 0 10.01-4.484 10.01-10.008C22.04 6.484 17.555 2 12.031 2zm5.834 14.288c-.244.686-1.22 1.328-1.748 1.411-.476.076-1.077.108-3.486-.889-2.883-1.192-4.724-4.135-4.869-4.327-.145-.192-1.162-1.547-1.162-2.952 0-1.405.736-2.098.997-2.385.26-.288.57-.36.76-.36.19 0 .38.002.546.01.176.009.412-.067.644.49.244.584.829 2.022.902 2.167.072.146.12.316.024.509-.096.192-.144.312-.288.483-.144.17-.304.382-.435.513-.145.145-.296.302-.128.591.168.289.749 1.235 1.608 2.001 1.107.986 2.04 1.291 2.33 1.436.289.145.457.12.625-.072.168-.193.72-.84.912-1.129.193-.288.385-.24.649-.144.264.096 1.679.792 1.968.936.288.145.48.216.552.336.072.12.072.71-.172 1.396z" />
  </svg>
);

export const UserProfileIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="7.25" r="4.25" />
    <path d="M4 20.5c0-4.4 3.6-6.5 8-6.5s8 2.1 8 6.5z" />
  </svg>
);

export const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 8.5V6.8a3.5 3.5 0 0 1 7 0v1.7" />
    <path d="M6.5 8.5h11a1.2 1.2 0 0 1 1.2 1.3l-1.3 9.4a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5.3 9.8a1.2 1.2 0 0 1 1.2-1.3z" />
  </svg>
);
