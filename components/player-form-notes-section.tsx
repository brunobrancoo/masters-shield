"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";

interface PlayerFormNotesSectionProps {
  register: any;
}

export default function PlayerFormNotesSection({
  register,
}: PlayerFormNotesSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-nature-400" />
        Anotações
      </Label>
      <Textarea
        id="notes"
        rows={4}
        className="bg-bg-inset border-border-default focus:border-nature-400 resize-none"
        {...register("notes")}
        placeholder="Observações, histórico do personagem..."
      />
    </div>
  );
}
