import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import * as Icons from "../../ui/icons";
import { cn } from "../../lib/cn";

// Define button variants using cva (class variance authority)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-primary/10 hover:text-primary border",
        success:
          "shadow bg-green-500/90 hover:bg-green-500/20 text-neutral-50 hover:text-green-500",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
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
  startContent?: React.ReactNode; // Custom prop for icon or any content before the button text
  endContent?: React.ReactNode; // Custom prop for icon or any content after the button text
  isIconOnly?: boolean; // Prop to handle icon-only buttons
  icon?: string; // Icon name passed as a string
  iconSize?: number; // Icon size
  isLoading?: boolean; // Loading state
  loadingText?: string; // Loading text
}

const defaultProps: Partial<ButtonProps> = {
  icon: "",
  iconSize: 24, // Default icon size
  isLoading: false,
  loadingText: "Loading...",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      startContent,
      endContent, // Add endContent to destructured props
      isIconOnly = false,
      icon,
      iconSize,
      isLoading,
      loadingText,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Find the icon from the imported Icons object, if `icon` prop is provided
    const Icon = icon && !isLoading ? Icons[icon as keyof typeof Icons] : null;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isIconOnly && "justify-center p-0 w-9 h-9" // Handling icon-only button styles
        )}
        ref={ref}
        {...props}
      >
        {/* Render the icon or startContent unless it's loading */}
        {isLoading ? (
          <span className="animate-spin">
            {/* Loading indicator */}
            Loading...
          </span>
        ) : (
          <>
            {/* Render startContent (e.g., custom icon) or the found icon */}
            {startContent || (Icon && <Icon size={iconSize} />)}
            {/* Only render button text if it's not an icon-only button */}
            {!isIconOnly && children}
            {/* Render endContent after the button text */}
            {endContent}
          </>
        )}
        {/* Render loading text if isLoading is true */}
        {isLoading && loadingText && (
          <span className="ml-2">{loadingText}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
