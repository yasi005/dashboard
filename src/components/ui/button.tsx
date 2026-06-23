import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#F59E0B] text-[#080808] hover:bg-[#D97706] shadow-lg shadow-[#F59E0B]/15 font-semibold",
        secondary:
          "bg-[#141414] text-[#E4E4E7]/70 border border-[#242424] hover:bg-[#1a1a1a] hover:text-[#E4E4E7]",
        ghost: "hover:bg-[#141414] hover:text-[#E4E4E7] text-[#E4E4E7]/55",
        outline: "border border-[#242424] bg-transparent hover:bg-[#141414] text-[#E4E4E7]/70",
        ai: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25 hover:bg-[#F59E0B]/15",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
