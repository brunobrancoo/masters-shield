import type { Player } from "@/lib/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";

interface PlayerNotesSectionProps {
  player: Player;
  editNotes: boolean;
  notesValue: string;
  setEditNotes: (edit: boolean) => void;
  setNotesValue: (value: string) => void;
  onSaveNotes: () => void;
}

export function PlayerNotesSection({ player, editNotes, notesValue, setEditNotes, setNotesValue, onSaveNotes }: PlayerNotesSectionProps) {
  return (
    <Card className="metal-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-sans text-lg">Anotações</CardTitle>
          {!editNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditNotes(true)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editNotes ? (
          <div className="space-y-3">
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={8}
              className="bg-card"
              placeholder="Adicione suas anotações aqui..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditNotes(false);
                  setNotesValue(player.notes || "");
                }}
              >
                Cancelar
              </Button>
              <Button size="sm" onClick={onSaveNotes}>
                <Save className="w-3 h-3 mr-1" />
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <p className="font-serif leading-relaxed text-pretty text-sm whitespace-pre-wrap">
            {player.notes || "Nenhuma anotação."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
