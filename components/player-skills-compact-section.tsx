"use client";

import type { PlayableCharacter } from "@/lib/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import {
  SKILLS,
  SKILLS_BY_ATTRIBUTE,
  ATTRIBUTE_NAMES,
  calculateModifier,
  formatModifier,
  type SkillKey,
} from "@/lib/skills";

interface PlayerSkillsCompactSectionProps {
  playableCharacter: PlayableCharacter;
}

export default function PlayerSkillsCompactSection({
  playableCharacter,
}: PlayerSkillsCompactSectionProps) {
  const selectedSkills = playableCharacter.skills || [];
  const proficiencyBonus = playableCharacter.proficiencyBonus || 2;
  const attributes = playableCharacter.attributes;

  const getSkillBonus = (skillKey: SkillKey): string => {
    const skill = SKILLS[skillKey];
    const attrValue = attributes[skill.attribute as keyof typeof attributes] || 10;
    const modifier = calculateModifier(attrValue);
    const isProficient = selectedSkills.includes(skillKey);
    const bonus = modifier + (isProficient ? proficiencyBonus : 0);
    return formatModifier(bonus);
  };

  return (
    <Card className="metal-border">
      <CardHeader className="pb-3">
        <CardTitle className="font-sans text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-arcane-500" />
          Perícias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(Object.keys(SKILLS) as SkillKey[]).map((skillKey) => {
            const skill = SKILLS[skillKey];
            const isProficient = selectedSkills.includes(skillKey);
            const bonus = getSkillBonus(skillKey);
            
            return (
              <div
                key={skillKey}
                className={`flex items-center justify-between text-sm py-1 px-2 rounded ${
                  isProficient ? "bg-arcane-500/10" : ""
                }`}
              >
                <span className={isProficient ? "font-medium" : "text-muted-foreground"}>
                  {skill.name}
                </span>
                <span className={`font-bold ${isProficient ? "text-arcane-500" : ""}`}>
                  {bonus}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-arcane-500"></span>
            <span>Proficiente (+{proficiencyBonus})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
