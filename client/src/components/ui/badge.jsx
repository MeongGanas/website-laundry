import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        pending: "border-amber-200 bg-amber-50 text-amber-800",
        washing: "border-blue-200 bg-blue-50 text-blue-800",
        drying: "border-orange-200 bg-orange-50 text-orange-800",
        ironing: "border-purple-200 bg-purple-50 text-purple-800",
        ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
        completed: "border-slate-200 bg-slate-100 text-slate-800",
        paid: "border-emerald-200 bg-emerald-100 text-emerald-800",
        unpaid: "border-rose-200 bg-rose-100 text-rose-800",
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

