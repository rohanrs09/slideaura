import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white hover:from-[#7c3aed] hover:to-[#db2777] shadow-lg hover:shadow-xl hover:shadow-[#8b5cf6]/25",
        destructive:
          "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:from-[#dc2626] hover:to-[#b91c1c] shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-[#8b5cf6] bg-transparent text-[#8b5cf6] hover:bg-gradient-to-r hover:from-[#8b5cf6] hover:to-[#ec4899] hover:text-white hover:border-transparent shadow-md hover:shadow-lg",
        secondary:
          "bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-[#fafafa] hover:from-[#2a2a2a] hover:to-[#3a3a3a] border border-[#3a3a3a] shadow-md hover:shadow-lg",
        ghost: "text-[#a0a0a0] hover:bg-gradient-to-r hover:from-[#8b5cf6]/10 hover:to-[#ec4899]/10 hover:text-[#fafafa] hover:shadow-md",
        link: "text-[#8b5cf6] underline-offset-4 hover:underline hover:text-[#ec4899] transition-colors",
        cta: "bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] text-[#0a0a0a] hover:from-[#fbbf24] hover:via-[#f59e0b] hover:to-[#fbbf24] shadow-lg hover:shadow-xl hover:shadow-[#f59e0b]/25 font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-11 rounded-full px-6 has-[>svg]:px-4 text-sm",
        icon: "size-9 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
