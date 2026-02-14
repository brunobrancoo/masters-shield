"use client";

import { Zap } from "lucide-react";
import { BaseResourceFormProps } from "./class-resource-forms/types";
import SorcererResourceForm from "./class-resource-forms/sorcerer-resource-form";
import PaladinResourceForm from "./class-resource-forms/paladin-resource-form";
import MonkResourceForm from "./class-resource-forms/monk-resource-form";
import BarbarianResourceForm from "./class-resource-forms/barbarian-resource-form";
import BardResourceForm from "./class-resource-forms/bard-resource-form";
import DruidResourceForm from "./class-resource-forms/druid-resource-form";
import WarlockResourceForm from "./class-resource-forms/warlock-resource-form";
import RogueResourceForm from "./class-resource-forms/rogue-resource-form";
import FighterResourceForm from "./class-resource-forms/fighter-resource-form";
import RangerResourceForm from "./class-resource-forms/ranger-resource-form";
import ClericResourceForm from "./class-resource-forms/cleric-resource-form";
import WizardResourceForm from "./class-resource-forms/wizard-resource-form";
import type { Control } from "react-hook-form";

// Mapping of class indices to their resource form components
const CLASS_FORM_MAP: Record<string, React.FC<BaseResourceFormProps>> = {
  sorcerer: SorcererResourceForm,
  paladin: PaladinResourceForm,
  monk: MonkResourceForm,
  barbarian: BarbarianResourceForm,
  bard: BardResourceForm,
  druid: DruidResourceForm,
  warlock: WarlockResourceForm,
  rogue: RogueResourceForm,
  fighter: FighterResourceForm,
  ranger: RangerResourceForm,
  cleric: ClericResourceForm,
  wizard: WizardResourceForm,
};

interface ClassResourceFormSectionProps {
  classIndex: string;
  control: Control<any>;
  setValue: any;
  classData: any;
  level: number;
}

export default function ClassResourceFormSection({
  classIndex,
  control,
  setValue,
  classData,
  level,
}: ClassResourceFormSectionProps) {
  const FormComponent = CLASS_FORM_MAP[classIndex];

  if (!FormComponent) {
    return null;
  }

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <h3 className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-arcane-400" />
        Recursos da Classe
      </h3>

      <FormComponent
        control={control}
        setValue={setValue}
        classData={classData}
        level={level}
      />
    </div>
  );
}
