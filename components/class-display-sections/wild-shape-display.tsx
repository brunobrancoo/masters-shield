"use client";

import { Leaf } from "lucide-react";

interface WildShapeDisplayProps {
  wildShapeMaxCR?: number | null;
  wildShapeFly?: boolean | null;
  wildShapeSwim?: boolean | null;
}

export default function WildShapeDisplay({
  wildShapeMaxCR,
  wildShapeFly,
  wildShapeSwim,
}: WildShapeDisplayProps) {
  if (!wildShapeMaxCR) return null;

  const abilities = [];
  if (wildShapeFly) abilities.push("Voar");
  if (wildShapeSwim) abilities.push("Nadar");

  return (
    <div className="p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="w-5 h-5 text-nature-400" />
        <p className="text-xs font-semibold text-text-secondary">Forma Selvagem</p>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">CR Máximo</span>
          <span className="text-text-primary font-medium">{wildShapeMaxCR}</span>
        </div>
        {abilities.length > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Habilidades</span>
            <span className="text-text-primary font-medium">{abilities.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
