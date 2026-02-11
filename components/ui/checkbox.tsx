import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "checkbox-circle",
  {
    variants: {
      variant: {
        default: "",
        "save-success": "save-success",
        "save-failure": "save-failure",
        "spell-slot": "spell-slot",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CheckboxCircleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onToggle">,
    VariantProps<typeof checkboxVariants> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function CheckboxCircle({
  className,
  variant,
  checked = false,
  onCheckedChange,
  ...props
}: CheckboxCircleProps) {
  const handleClick = () => {
    onCheckedChange?.(!checked)
  }

  return (
    <button
      type="button"
      data-state={checked ? "checked" : "unchecked"}
      className={cn(checkboxVariants({ variant, className }))}
      onClick={handleClick}
      aria-pressed={checked}
      {...props}
    />
  )
}

export { CheckboxCircle, checkboxVariants }
