import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border-default placeholder:text-text-tertiary focus-visible:border-class-accent focus-visible:ring-class-accent/50 aria-invalid:border-damage dark:bg-bg-inset/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-bg-inset px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
