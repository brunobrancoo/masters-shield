import type { PlayableCharacter, Spell } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@/components/icons";
import { Edit, Trash2 } from "lucide-react";
import AddSpellDialog from "@/components/add-spell-dialog";
import EditSpellDialog from "@/components/edit-spell-dialog";

interface PlayerSpellsSectionProps {
  playableCharacter: PlayableCharacter;
  editSpellIndex: number | null;
  setEditSpellIndex: (index: number | null) => void;
  onAddSpell: (spell: Spell) => void;
  onRemoveSpell: (index: number) => void;
  onEditSpell: (index: number, updatedSpell: Spell) => void;
  campaignId: string;
}

export function PlayerSpellsSection({
  playableCharacter,
  editSpellIndex,
  setEditSpellIndex,
  onAddSpell,
  onRemoveSpell,
  onEditSpell,
  campaignId,
}: PlayerSpellsSectionProps) {
  const spells = playableCharacter.spellList || [];
  const editSpell = editSpellIndex !== null ? spells[editSpellIndex] : null;

  return (
    <>
      <Card className="metal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-sans text-xl flex items-center gap-2">
              <SparklesIcon className="w-6 h-6" />
              Magias
            </CardTitle>
            <AddSpellDialog onAdd={onAddSpell} campaignId={campaignId} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!spells || spells.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma magia conhecida
              </p>
            ) : (
              spells.map((spell: any, index: any) => (
                <div key={index} className="bg-card/50 p-3 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold font-serif text-lg">
                          {spell.name}
                        </p>
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-1 rounded">
                          Nível {spell.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                          {spell.school}
                        </span>
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                          {spell.castingTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                          {spell.range}
                        </span>
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                          {spell.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                          {spell.components}
                        </span>
                        {spell.concentration && (
                          <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded ml-2">
                            Concentração
                          </span>
                        )}
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded ml-2">
                          {spell.ritual && (
                            <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                              Ritual
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                          Descrição
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {typeof spell.description === "string"
                            ? spell.description
                            : spell.description?.join(" • ") || ""}
                        </span>
                      </div>
                      {spell.attackType && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                            Ataque
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {spell.attackType}
                          </span>
                        </div>
                      )}
                      {spell.material && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                            Material
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {spell.material}
                          </span>
                        </div>
                      )}
                      {spell.areaOfEffect &&
                        (spell.areaOfEffect.size ||
                          spell.areaOfEffect.type) && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                              Área
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {spell.areaOfEffect.size &&
                                `${spell.areaOfEffect.size}pés `}
                              {spell.areaOfEffect.type &&
                                `${spell.areaOfEffect.type} `}
                            </span>
                          </div>
                        )}
                      {spell.damage && spell.damage.damageType && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                            Dano
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {spell.damage.damageType}
                          </span>
                        </div>
                      )}
                      {spell.dc && spell.dc.dcType && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                            CD
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {spell.dc.dcType}
                          </span>
                        </div>
                      )}
                      {spell.healAtSlotLevel &&
                        spell.healAtSlotLevel.length > 0 && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-nature-500/20 text-nature-500 px-2 py-0.5 rounded">
                              Cura
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {typeof spell.healAtSlotLevel === "string"
                                ? spell.healAtSlotLevel
                                : spell.healAtSlotLevel?.join(" • ") || ""}
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditSpellIndex(index)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSpell(index)}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editSpellIndex !== null && playableCharacter && editSpell && (
        <EditSpellDialog
          spell={editSpell}
          index={editSpellIndex}
          open={editSpellIndex !== null}
          setOpen={(open) => setEditSpellIndex(open ? editSpellIndex : null)}
          onUpdate={onEditSpell}
        />
      )}
    </>
  );
}
