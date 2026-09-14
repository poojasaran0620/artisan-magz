import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-roseGold/20 font-sans",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blush-100 text-charcoal shadow-xs hover:bg-blush-200",
        secondary:
          "border-transparent bg-cream-100 text-charcoal hover:bg-cream-200",
        destructive:
          "border-transparent bg-red-100 text-red-900 shadow-xs hover:bg-red-200",
        outline: "text-charcoal border-taupe-200/80 bg-white hover:bg-cream-50",
        sage: "border-transparent bg-sage-100 text-sage-900 hover:bg-sage-200",
        roseGold: "border-transparent bg-roseGold/15 text-roseGold-dark hover:bg-roseGold/25",
        placed: "border-transparent bg-amber-100 text-amber-900",
        printing: "border-transparent bg-pink-100 text-pink-900",
        dispatched: "border-transparent bg-blue-100 text-blue-900",
        delivered: "border-transparent bg-emerald-100 text-emerald-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
