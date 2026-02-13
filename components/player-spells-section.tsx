import type { PlayableCharacter, Spell } from "@/lib/interfaces/interfaces";
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
}

export function PlayerSpellsSection({ playableCharacter, editSpellIndex, setEditSpellIndex, onAddSpell, onRemoveSpell, onEditSpell }: PlayerSpellsSectionProps) {
  return (
    <>
      <Card className="metal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-sans text-xl flex items-center gap-2">
              <SparklesIcon className="w-6 h-6" />
              Magias
            </CardTitle>
            <AddSpellDialog onAdd={onAddSpell} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!playableCharacter.spells || playableCharacter.spells.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma magia conhecida
              </p>
            ) : (
              playableCharacter.spells.map((spell, index) => (
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
                      <p className="text-xs text-muted-foreground mb-1">
                        {spell.school}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {spell.castingTime}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {spell.range}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {spell.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {spell.components}
                      </p>
                      {spell.concentration && (
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded ml-2">
                          Concentração
                        </span>
                      )}
                      {spell.ritual && (
                        <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded ml-2">
                          Ritual
                        </span>
                      )}
                    </div>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editSpellIndex !== null && playableCharacter && playableCharacter.spells && (
        <EditSpellDialog
          spell={playableCharacter.spells[editSpellIndex]}
          index={editSpellIndex}
          open={editSpellIndex !== null}
          setOpen={(open) =>
            setEditSpellIndex(open ? editSpellIndex : null)
          }
          onUpdate={onEditSpell}
        />
      )}
    </>
  );
}
