import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        easy: "border-forest/20 bg-forest/10 text-forest",
        moderate: "border-trail/20 bg-trail/10 text-trail",
        hard: "border-destructive/20 bg-destructive/10 text-destructive",
        expert: "border-mountain/20 bg-mountain/10 text-mountain",
        upcoming: "border-primary/20 bg-primary/10 text-primary",
        completed: "border-border bg-muted text-muted-foreground",
        verified: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
