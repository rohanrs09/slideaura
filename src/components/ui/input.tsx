import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#F5F3FF] placeholder:text-[#8B7AB8] selection:bg-[#A855F7]/20 selection:text-[#F5F3FF] bg-[#1F0E3A] border-[#A855F7]/20 text-[#F5F3FF] h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-base shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#A855F7]/50 focus-visible:ring-[#A855F7]/30 focus-visible:ring-[3px]",
        "aria-invalid:ring-[#EF4444]/20 aria-invalid:border-[#EF4444]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
