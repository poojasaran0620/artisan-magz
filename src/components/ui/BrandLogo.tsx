import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src="/artisan_logo_horizontal.png"
          alt="Artisan magz"
          className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition duration-300"
        />
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
        <img
          src="/artisan_logo_horizontal.png"
          alt="Artisan magz"
          className="h-20 sm:h-24 md:h-28 w-auto object-contain hover:scale-105 transition duration-300"
        />
      </div>
    );
  }

  // Default 'md' (Navbar / Header - Horizontal Watercolor Banner)
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src="/artisan_logo_horizontal.png"
        alt="Artisan magz"
        className="h-16 sm:h-20 w-auto max-w-[220px] sm:max-w-[280px] object-contain hover:scale-105 transition duration-300"
      />
    </div>
  );
};

