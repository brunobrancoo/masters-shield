"use client";
import { createContext, SetStateAction, useContext, useState } from "react";
import { useGame } from "./game-context";
import {
  InitiativeEntry,
  Monster,
  NPC,
  Player,
} from "@/lib/interfaces/interfaces";

export interface CombatContextType {
  round: number;
  onCombat: boolean;
  setOnCombat: (value: SetStateAction<boolean>) => void;
  initiativeEntries: InitiativeEntry[];
  setInitiativeEntries: (value: SetStateAction<InitiativeEntry[]>) => void;
  removeEntry: (id: string) => void;
  showAddForm: boolean;
  setShowAddForm: (value: SetStateAction<boolean>) => void;
  selectedSourceId: string;
  setSelectedSourceId: (value: SetStateAction<string>) => void;
  setRound: (value: SetStateAction<number>) => void;
  customName: string;
  setCustomName: (value: SetStateAction<string>) => void;
  customInitiative: number;
  setCustomInitiative: (value: SetStateAction<number>) => void;
  customHp: number;
  setCustomHp: (value: SetStateAction<number>) => void;
  customMaxHp: number;
  setCustomMaxHp: (value: SetStateAction<number>) => void;
  resetAddForm: () => void;
  addCustomEntry: () => void;
  currentTurn: number;
  setCurrentTurn: (valur: SetStateAction<number>) => void;
  updateHp: (id: string, delta: number) => void;
  addExistingEntry: () => void;
  getSourceList: () => Monster[] | Player[] | NPC[];
  sourceType: "monster" | "player" | "npc";
  setSourceType: (value: SetStateAction<"monster" | "player" | "npc">) => void;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export function CombatProvider({ children }: { children: React.ReactNode }) {
  const [round, setRound] = useState(1);
  const [onCombat, setOnCombat] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [initiativeEntries, setInitiativeEntries] = useState<InitiativeEntry[]>(
    [],
  );
  const [customName, setCustomName] = useState("");
  const [customInitiative, setCustomInitiative] = useState(0);
  const [customHp, setCustomHp] = useState(0);
  const [customMaxHp, setCustomMaxHp] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [sourceType, setSourceType] = useState<"monster" | "player" | "npc">(
    "monster",
  );

  const { handleSavePlayer, handleSaveMonster, handleUpdateNPC, gameData } =
    useGame();

  const resetAddForm = () => {
    setShowAddForm(false);
    setCustomName("");
    setCustomInitiative(0);
    setCustomHp(0);
    setCustomMaxHp(0);
    setSelectedSourceId("");
  };

  const monsters = gameData.monsters;
  const players = gameData.players;
  const npcs = gameData.npcs;
  const getSourceList = () => {
    switch (sourceType) {
      case "monster":
        return monsters;
      case "player":
        return players;
      case "npc":
        return npcs;
      default:
        return [];
    }
  };
  const addExistingEntry = () => {
    if (!selectedSourceId) return;

    let newEntry: InitiativeEntry | null = null;

    if (sourceType === "monster") {
      const monster = monsters.find((m) => m.id === selectedSourceId);
      if (monster) {
        newEntry = {
          id: monster.id,
          name: monster.name,
          initiative: 0,
          hp: monster.hp,
          maxHp: monster.maxHp,
          type: "monster",
          sourceId: monster.id,
        };
      }
    } else if (sourceType === "player") {
      const player = players.find((p) => p.id === selectedSourceId);
      if (player) {
        newEntry = {
          id: player.id,
          name: player.name,
          initiative: 0,
          hp: player.hp,
          maxHp: player.maxHp,
          type: "player",
          sourceId: player.id,
        };
      }
    } else if (sourceType === "npc") {
      const npc = npcs.find((n) => n.id === selectedSourceId);
      if (npc) {
        newEntry = {
          id: npc.id,
          name: npc.name,
          initiative: 0,
          hp: npc.hp,
          maxHp: npc.maxHp,
          type: "npc",
          sourceId: npc.id,
        };
      }
    }

    if (newEntry) {
      setInitiativeEntries((prev) => [...prev, newEntry]);
      resetAddForm();
    }
  };
  const addCustomEntry = () => {
    if (!customName || !customInitiative) return;

    const newEntry: InitiativeEntry = {
      id: `custom-${Date.now()}`,
      name: customName,
      initiative: customInitiative,
      hp: customHp || 0,
      maxHp: customMaxHp || 0,
      type: "custom",
    };

    setInitiativeEntries((prev) => [...prev, newEntry]);
    resetAddForm();
  };

  const removeEntry = (id: string) => {
    setInitiativeEntries((prev) => prev.filter((e) => e.id !== id));
    if (currentTurn >= initiativeEntries.length - 1) {
      setCurrentTurn(Math.max(0, initiativeEntries.length - 2));
    }
  };
  const updateHp = (id: string, delta: number) => {
    setInitiativeEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, hp: Math.max(0, Math.min(e.maxHp, e.hp + delta)) }
          : e,
      ),
    );

    console.log(id);
    const player = gameData.players.find((p) => p.id === id);
    if (player) {
      const newHp = Math.max(0, Math.min(player.maxHp, player.hp + delta));
      handleSavePlayer({ ...player, hp: newHp });
      return;
    }

    const monster = gameData.monsters.find((m) => m.id === id);
    if (monster) {
      const newHp = Math.max(0, Math.min(monster.maxHp, monster.hp + delta));
      handleSaveMonster({ ...monster, hp: newHp });
      return;
    }

    const npc = gameData.npcs.find((n) => n.id === id);
    if (npc) {
      const newHp = Math.max(0, Math.min(npc.maxHp, npc.hp + delta));
      handleUpdateNPC({ ...npc, hp: newHp });
      return;
    }
  };

  function addAllPlayers() {}

  const value: CombatContextType = {
    addExistingEntry,
    getSourceList,
    sourceType,
    setSourceType,
    customHp,
    customInitiative,
    customMaxHp,
    customName,
    setCustomHp,
    setCustomInitiative,
    setCustomMaxHp,
    setCustomName,
    setRound,
    round,
    onCombat,
    setOnCombat,
    initiativeEntries,
    setInitiativeEntries,
    removeEntry,
    selectedSourceId,
    setSelectedSourceId,
    setShowAddForm,
    showAddForm,
    resetAddForm,
    addCustomEntry,
    currentTurn,
    setCurrentTurn,
    updateHp,
  };

  return (
    <CombatContext.Provider value={value}>{children}</CombatContext.Provider>
  );
}

export const useCombat = () => {
  const context = useContext(CombatContext);
  if (context === undefined) {
    throw new Error("useCombat must be used within an CombatProvider");
  }
  return context;
};
