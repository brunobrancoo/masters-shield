"use client";

import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";
import type { Control } from "react-hook-form";

interface PlayerFormNotesSectionProps {
  control: Control<any>;
}

export default function PlayerFormNotesSection({
  control,
}: PlayerFormNotesSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-nature-400" />
        Anotações
      </FieldLabel>
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Textarea
            id="form-notes"
            rows={4}
            className="bg-bg-inset border-border-default focus:border-nature-400 resize-none"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Observações, histórico do personagem..."
          />
        )}
      />
    </div>
  );
}
