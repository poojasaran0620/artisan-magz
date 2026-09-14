import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface CountingNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

interface DigitColumnProps {
  digit: number;
}

const DigitColumn: React.FC<DigitColumnProps> = memo(({ digit }) => {
  return (
    <span className="inline-block relative overflow-hidden h-[1.15em] align-baseline leading-none">
      <motion.span
        className="inline-flex flex-col"
        initial={false}
        animate={{ y: `-${digit * 10}%` }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24,
          mass: 0.7,
        }}
        style={{ height: '1000%' }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span
            key={num}
            className="h-[1.15em] flex items-center justify-center tabular-nums"
          >
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
});

DigitColumn.displayName = 'DigitColumn';

/**
 * CountingNumber component
 * Inspired by shadcn.io/text/counting-number & shadcn.io/text/sliding-number
 * 
 * Physically rolls each digit up or down on a mechanical wheel using spring physics.
 * Strict tabular-nums to eliminate horizontal layout shift (CLS = 0).
 */
export const CountingNumber: React.FC<CountingNumberProps> = memo(({
  value,
  prefix = '₹',
  suffix = '',
  className = '',
}) => {
  const formattedStr = Math.round(value).toLocaleString('en-IN');
  const chars = formattedStr.split('');

  return (
    <span className={`inline-flex items-baseline font-sans tabular-nums select-none ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <span className="inline-flex items-baseline">
        {chars.map((char, index) => {
          const isDigit = /\d/.test(char);
          if (!isDigit) {
            return (
              <span key={`sep-${index}`} className="inline-block px-0.5">
                {char}
              </span>
            );
          }
          const digit = parseInt(char, 10);
          return (
            <DigitColumn
              key={`col-${chars.length - index}`}
              digit={digit}
            />
          );
        })}
      </span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
});

CountingNumber.displayName = 'CountingNumber';
