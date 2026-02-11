import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input-field placeholder:text-text-foreground/50 selection:bg-class-accent selection:text-white h-9 w-full min-w-0 border-b text-base shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-class-accent/50",
        "aria-invalid:border-damage",
        className
      )}
      {...props}
    />
  )
}

export { Input }
