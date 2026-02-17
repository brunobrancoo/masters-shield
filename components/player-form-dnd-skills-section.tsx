"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { CheckboxCircle } from "@/components/ui/checkbox";
import {
  SKILLS,
  SKILLS_BY_ATTRIBUTE,
  ATTRIBUTE_NAMES,
  CLASS_SKILL_PROFICIENCIES,
  calculateModifier,
  formatModifier,
  type SkillKey,
} from "@/lib/skills";
import { useClass } from "@/lib/api/hooks";
import { Info, Medal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { DiceIcon } from "./icons";
import { Attributes } from "@/lib/schemas";

interface PlayerFormSkillsSectionProps {
  setValue: any;
  classIndex: string;
  attributes: Attributes;
  proficiencyBonus: number;
}

const CLASS_SKILL_CHOICES: Record<string, number> = {
  barbarian: 2,
  bard: 3,
  cleric: 2,
  druid: 2,
  fighter: 2,
  monk: 2,
  paladin: 2,
  ranger: 3,
  rogue: 4,
  sorcerer: 2,
  warlock: 2,
  wizard: 2,
};

export default function PlayerFormSkillsSection({
  setValue,
  classIndex,
  attributes,
  proficiencyBonus,
}: PlayerFormSkillsSectionProps) {
  const [selectedSkills, setSelectedSkills] = useState<SkillKey[]>([]);

  const numClassSkillsToChoose = CLASS_SKILL_CHOICES[classIndex] || 0;
  const availableClassSkillIndices =
    CLASS_SKILL_PROFICIENCIES[classIndex] || [];

  const toggleSkill = (skillKey: SkillKey) => {
    const isFromClass = availableClassSkillIndices.includes(skillKey);

    let newSkills: SkillKey[];

    if (selectedSkills.includes(skillKey)) {
      newSkills = selectedSkills.filter((s) => s !== skillKey);
    } else {
      if (isFromClass) {
        const currentClassSelectedCount = selectedSkills.filter((s) =>
          availableClassSkillIndices.includes(s),
        ).length;
      }
      newSkills = [...selectedSkills, skillKey];
    }

    setSelectedSkills(newSkills);
    setValue("skills", newSkills);
  };

  const getSkillBonus = (skillKey: SkillKey): string => {
    const skill = SKILLS[skillKey];
    const attrValue =
      attributes[skill.attribute as keyof typeof attributes] || 10;
    const modifier = calculateModifier(attrValue);
    const isProficient = selectedSkills.includes(skillKey);
    const bonus = modifier + (isProficient ? proficiencyBonus : 0);
    return formatModifier(bonus);
  };

  const isAvailableClassSkill = (skillKey: SkillKey): boolean => {
    return availableClassSkillIndices.includes(skillKey);
  };

  const currentClassSelectedCount = selectedSkills.filter((s) =>
    availableClassSkillIndices.includes(s),
  ).length;

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg"
    >
      <AccordionItem value="identity-section">
        <AccordionTrigger className="">
          <FieldLabel className="font-heading flex text-sm uppercase tracking-wider text-text-secondary mr-full">
            <DiceIcon className="w-5 h-5" />
            Perícias
          </FieldLabel>
        </AccordionTrigger>
        <AccordionContent>
          <div className="">
            <div className="mb-4 p-3 bg-arcane-400/10 rounded border border-arcane-400/20">
              <div className="flex items-center gap-3">
                <Medal className="w-5 h-5 text-arcane-400 flex-shrink-0" />
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold">Bônus de Proficiência:</span>{" "}
                  +{proficiencyBonus}
                </p>
              </div>
            </div>

            {numClassSkillsToChoose > 0 && (
              <div className="mb-4 p-3 bg-arcane-400/10 rounded border border-arcane-400/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-arcane-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-text-secondary">
                    <p className="font-semibold">
                      Escolha de Perícias da Classe
                    </p>
                    <p className="text-xs mt-1">
                      Selecione {numClassSkillsToChoose} perícia
                      {numClassSkillsToChoose > 1 ? "s" : ""} da classe. Atual:{" "}
                      {currentClassSelectedCount}/{numClassSkillsToChoose}
                    </p>
                    {currentClassSelectedCount > numClassSkillsToChoose && (
                      <p className="text-xs mt-1 text-red-700 font-bold">
                        Número de perícias de classe ultrapassado. Verifique se
                        vem do antecedente ou converse com o mestre.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {Object.entries(SKILLS_BY_ATTRIBUTE).map(([attr, skillKeys]) => {
                if (skillKeys.length === 0) return null;

                return (
                  <div key={attr} className="space-y-3">
                    <h4 className="font-semibold text-text-secondary border-b border-border-default pb-2">
                      {ATTRIBUTE_NAMES[attr]} (
                      {formatModifier(
                        calculateModifier(
                          attributes[attr as keyof typeof attributes] || 10,
                        ),
                      )}
                      )
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {skillKeys.map((skillKey) => {
                        const skill = SKILLS[skillKey];
                        const isChecked = selectedSkills.includes(skillKey);
                        const isClassAvailable =
                          isAvailableClassSkill(skillKey);

                        return (
                          <div
                            key={skillKey}
                            className={`flex items-center justify-between p-3 rounded border transition-colors ${
                              isChecked
                                ? "bg-arcane-400/10 border-arcane-400/30"
                                : "bg-bg-inset border-border-subtle opacity-40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CheckboxCircle
                                id={`skill-${skillKey}`}
                                checked={isChecked}
                                onCheckedChange={() => toggleSkill(skillKey)}
                              />
                              <Label
                                htmlFor={`skill-${skillKey}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {skill.name}
                                {isClassAvailable && !isChecked && (
                                  <span className="ml-2 text-xs text-arcane-400">
                                    {isClassAvailable && "(Classe)"}
                                  </span>
                                )}
                              </Label>
                            </div>
                            <span
                              className={`text-sm font-bold ${
                                isChecked
                                  ? "text-arcane-400"
                                  : "text-text-secondary"
                              }`}
                            >
                              {getSkillBonus(skillKey)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
