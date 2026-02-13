"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComboboxFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function ComboboxField({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  required = false,
  error,
}: ComboboxFieldProps) {
  const dataListId = `${label.toLowerCase().replace(/\s+/g, '-')}-list`;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={dataListId}
        className="text-text-secondary font-medium flex items-center gap-2"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={dataListId}
        list={dataListId}
        className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <datalist id={dataListId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
      {error && (
        <p className="text-destructive text-xs flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  );
}
