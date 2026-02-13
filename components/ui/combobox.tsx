"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Combobox({ children, className, ref }: { children: React.ReactNode; className?: string; ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn("relative w-full", className)}>{children}</div>
}

export function ComboboxInput({
  value,
  onChange,
  placeholder,
  className,
  onFocus,
  onBlur,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onFocus?: () => void
  onBlur?: () => void
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-md border border-border-default bg-bg-inset px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}

export function ComboboxList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("absolute z-50 w-full mt-1 bg-bg-surface border border-border-default rounded-lg shadow-lg max-h-60 overflow-auto", className)}>
      {children}
    </div>
  )
}

export function ComboboxItem({
  value,
  selected,
  onSelect,
  children,
  className,
}: {
  value: string
  selected?: boolean
  onSelect: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={cn(
        "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-bg-inset transition-colors",
        selected && "bg-bg-inset",
        className
      )}
    >
      <span className="text-sm">{children}</span>
      {selected && <Check className="w-4 h-4 text-arcane-400" />}
    </div>
  )
}

export function ComboboxEmpty({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-2 text-sm text-text-secondary">{children}</div>
}

export function ComboboxContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
