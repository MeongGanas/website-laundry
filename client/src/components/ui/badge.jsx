import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "bg-slate-100 text-slate-700",
        pending: "bg-amber-50/90 text-amber-800",
        washing: "bg-blue-50/90 text-blue-800",
        drying: "bg-orange-50/90 text-orange-800",
        ironing: "bg-purple-50/90 text-purple-800",
        ready: "bg-emerald-50/90 text-emerald-800",
        completed: "bg-slate-100 text-slate-700",
        paid: "bg-emerald-100/90 text-emerald-800",
        unpaid: "bg-rose-100/90 text-rose-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

