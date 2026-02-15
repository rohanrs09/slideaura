import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[#A855F7]/20 placeholder:text-[#8B7AB8] text-[#F5F3FF] focus-visible:border-[#A855F7]/50 focus-visible:ring-[#A855F7]/30 aria-invalid:ring-[#EF4444]/20 aria-invalid:border-[#EF4444] bg-[#1F0E3A] flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 text-base shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
