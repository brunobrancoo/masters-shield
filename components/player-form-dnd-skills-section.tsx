"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { CheckboxCircle } from "@/components/ui/checkbox";
import {
  SKILLS,
  SKILLS_BY_ATTRIBUTE,
  ATTRIBUTE_NAMES,
  CLASS_SKILL_PROFICIENCIES,
  BACKGROUND_SKILL_PROFICIENCIES,
  calculateModifier,
  formatModifier,
  type SkillKey,
} from "@/lib/skills";
import { useClass, useBackground } from "@/lib/api/hooks";
import { Info, Medal } from "lucide-react";

interface PlayerFormSkillsSectionProps {
  register: any;
  setValue: any;
  watch: any;
  errors: any;
  classIndex: string;
  backgroundIndex: string;
  attributes: { for: number; des: number; con: number; int: number; sab: number; car: number };
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
  register,
  setValue,
  watch,
  errors,
  classIndex,
  backgroundIndex,
  attributes,
  proficiencyBonus,
}: PlayerFormSkillsSectionProps) {
  const [selectedSkills, setSelectedSkills] = useState<SkillKey[]>([]);
  const watchedSkills = watch("skills") || [];

  const { data: classData } = useClass(classIndex);
  const { data: backgroundData } = useBackground(backgroundIndex);

  const numClassSkillsToChoose = CLASS_SKILL_CHOICES[classIndex] || 0;
  const availableClassSkillIndices = CLASS_SKILL_PROFICIENCIES[classIndex] || [];
  
  const availableBgSkillIndices = BACKGROUND_SKILL_PROFICIENCIES[backgroundIndex] || [];

  useEffect(() => {
    if (!classIndex && !backgroundIndex) {
      setSelectedSkills([]);
      setValue("skills", []);
      return;
    }

    const autoSkills: SkillKey[] = [];

    if (backgroundIndex && availableBgSkillIndices.length > 0) {
      availableBgSkillIndices.forEach((skillIndex) => {
        if (Object.keys(SKILLS).includes(skillIndex) && !autoSkills.includes(skillIndex as SkillKey)) {
          autoSkills.push(skillIndex as SkillKey);
        }
      });
    }

    setSelectedSkills([...new Set(autoSkills)]);
    setValue("skills", [...new Set(autoSkills)]);
  }, [classIndex, backgroundIndex]);

  const toggleSkill = (skillKey: SkillKey) => {
    const isFromClass = availableClassSkillIndices.includes(skillKey);
    const isFromBg = availableBgSkillIndices.includes(skillKey);

    let newSkills: SkillKey[];

    if (selectedSkills.includes(skillKey)) {
      newSkills = selectedSkills.filter((s) => s !== skillKey);
    } else {
      if (isFromClass) {
        const currentClassSelectedCount = selectedSkills.filter((s) => availableClassSkillIndices.includes(s)).length;
        if (currentClassSelectedCount >= numClassSkillsToChoose) {
          return;
        }
      }
      newSkills = [...selectedSkills, skillKey];
    }

    setSelectedSkills(newSkills);
    setValue("skills", newSkills);
  };

  const getSkillBonus = (skillKey: SkillKey): string => {
    const skill = SKILLS[skillKey];
    const attrValue = attributes[skill.attribute as keyof typeof attributes] || 10;
    const modifier = calculateModifier(attrValue);
    const isProficient = selectedSkills.includes(skillKey);
    const bonus = modifier + (isProficient ? proficiencyBonus : 0);
    return formatModifier(bonus);
  };

  const isAvailableClassSkill = (skillKey: SkillKey): boolean => {
    return availableClassSkillIndices.includes(skillKey);
  };

  const isAvailableBgSkill = (skillKey: SkillKey): boolean => {
    return availableBgSkillIndices.includes(skillKey);
  };

  const currentClassSelectedCount = selectedSkills.filter((s) => availableClassSkillIndices.includes(s)).length;
  const currentBgSelectedCount = selectedSkills.filter((s) => availableBgSkillIndices.includes(s)).length;

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block">
        Perícias
      </Label>

      <div className="mb-4 p-3 bg-arcane-400/10 rounded border border-arcane-400/20">
        <div className="flex items-center gap-3">
          <Medal className="w-5 h-5 text-arcane-400 flex-shrink-0" />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold">Bônus de Proficiência:</span> +{proficiencyBonus}
          </p>
        </div>
      </div>

      {numClassSkillsToChoose > 0 && (
        <div className="mb-4 p-3 bg-arcane-400/10 rounded border border-arcane-400/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-arcane-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text-secondary">
              <p className="font-semibold">Escolha de Perícias da Classe</p>
              <p className="text-xs mt-1">
                Selecione {numClassSkillsToChoose} perícia{numClassSkillsToChoose > 1 ? 's' : ''} da classe. 
                Atual: {currentClassSelectedCount}/{numClassSkillsToChoose}
              </p>
            </div>
          </div>
        </div>
      )}

      {availableBgSkillIndices.length > 0 && (
        <div className="mb-4 p-3 bg-bg-inset rounded border border-border-subtle">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text-secondary">
              <p className="font-semibold">Perícias de Antecedente</p>
              <p className="text-xs mt-1">
                {availableBgSkillIndices.length} perícia{availableBgSkillIndices.length > 1 ? 's' : ''} automática{availableBgSkillIndices.length > 1 ? 's' : ''}
              </p>
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
                {ATTRIBUTE_NAMES[attr]} ({formatModifier(calculateModifier(attributes[attr as keyof typeof attributes] || 10))})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skillKeys.map((skillKey) => {
                  const skill = SKILLS[skillKey];
                  const isChecked = selectedSkills.includes(skillKey);
                  const isClassAvailable = isAvailableClassSkill(skillKey);
                  const isBgAvailable = isAvailableBgSkill(skillKey);

                  return (
                    <div
                      key={skillKey}
                      className={`flex items-center justify-between p-3 rounded border transition-colors ${
                        isChecked
                          ? "bg-arcane-400/10 border-arcane-400/30"
                          : isClassAvailable || isBgAvailable
                          ? "bg-bg-inset border-border-subtle"
                          : "bg-bg-inset border-border-subtle opacity-40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckboxCircle
                          id={`skill-${skillKey}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleSkill(skillKey)}
                          disabled={!isClassAvailable && !isBgAvailable && !isChecked}
                        />
                        <Label
                          htmlFor={`skill-${skillKey}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {skill.name}
                          {(isClassAvailable || isBgAvailable) && !isChecked && (
                            <span className="ml-2 text-xs text-arcane-400">
                              {isClassAvailable && !isBgAvailable && "(Classe)"}
                              {!isClassAvailable && isBgAvailable && "(Antecedente)"}
                              {isClassAvailable && isBgAvailable && "(Classe/Antecedente)"}
                            </span>
                          )}
                        </Label>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          isChecked ? "text-arcane-400" : "text-text-secondary"
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

      {errors.skills?.message && (
        <p className="text-destructive text-xs mt-4 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-destructive" />
          {errors.skills.message}
        </p>
      )}
    </div>
  );
}
