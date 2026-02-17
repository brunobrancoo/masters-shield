"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface AddEntryFormProps {
  showAddForm: boolean;
  resetAddForm: () => void;
  sourceType: string;
  setSourceType: (v: string) => void;
  selectedSourceId: string;
  setSelectedSourceId: (v: string) => void;
  getSourceList: () => any[];
  initiativeEntries: any[];
  addExistingEntry: () => void;
  customName: string;
  setCustomName: (v: string) => void;
  customInitiative: number;
  setCustomInitiative: (v: number) => void;
  customHp: number;
  setCustomHp: (v: number) => void;
  customMaxHp: number;
  setCustomMaxHp: (v: number) => void;
  customAc: number;
  setCustomAc: (v: number) => void;
  addCustomEntry: () => void;
}

export default function AddEntryForm({
  showAddForm,
  resetAddForm,
  sourceType,
  setSourceType,
  selectedSourceId,
  setSelectedSourceId,
  getSourceList,
  initiativeEntries,
  addExistingEntry,
  customName,
  setCustomName,
  customInitiative,
  setCustomInitiative,
  customHp,
  setCustomHp,
  customMaxHp,
  setCustomMaxHp,
  customAc,
  setCustomAc,
  addCustomEntry,
}: AddEntryFormProps) {
  const [addType, setAddType] = useState<"existing" | "custom">("existing");

  if (!showAddForm) return null;

  return (
    <Card className="p-4 card-inset bg-bg-surface/50 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-text-primary">Novo Participante</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetAddForm}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={addType === "existing" ? "default" : "outline"}
          size="sm"
          onClick={() => setAddType("existing")}
          className="flex-1"
        >
          Existente
        </Button>
        <Button
          variant={addType === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => setAddType("custom")}
          className="flex-1"
        >
          Personalizado
        </Button>
      </div>

      {addType === "existing" ? (
        <div className="space-y-3">
          <Select
            value={sourceType}
            onValueChange={(v: any) => setSourceType(v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monster">Monstro</SelectItem>
              <SelectItem value="playableCharacter">Jogador</SelectItem>
              <SelectItem value="npc">NPC</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedSourceId}
            onValueChange={setSelectedSourceId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {getSourceList().map((item) => {
                if (
                  initiativeEntries.some(
                    (entry) => entry.id === item.id,
                  )
                )
                  return;
                return (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button
            onClick={addExistingEntry}
            className="w-full"
            disabled={!selectedSourceId}
          >
            Adicionar
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="Nome"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Iniciativa"
              value={customInitiative}
              onChange={(e) =>
                setCustomInitiative(+e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="AC"
              value={customAc}
              onChange={(e) => setCustomAc(+e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="HP"
              value={customHp}
              onChange={(e) => setCustomHp(+e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max HP"
              value={customMaxHp}
              onChange={(e) => setCustomMaxHp(+e.target.value)}
            />
          </div>
          <Button
            onClick={addCustomEntry}
            className="w-full"
            disabled={!customName || !customInitiative}
          >
            Adicionar
          </Button>
        </div>
      )}
    </Card>
  );
}
