"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors select-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Deep-pine — the primary action, accessible white text.
        primary: "bg-sage-800 text-white shadow-glow hover:bg-sage-900",
        // Sage — quiet confidence, the default for everything else.
        secondary: "bg-surface text-foreground border border-border hover:bg-surface-2",
        ghost: "text-foreground hover:bg-surface-2",
        sage: "bg-sage-700 text-white hover:bg-sage-800",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-13 px-7 text-base min-h-[44px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const reduce = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      />
    );
  },
);
Button.displayName = "Button";
