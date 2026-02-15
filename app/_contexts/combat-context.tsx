"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { useGame } from "./game-context";
import {
  InitiativeEntry,
  Monster,
  NPC,
  PlayableCharacter,
} from "@/lib/schemas";
import { DiceRoller } from "@/lib/classes/dices";
import { getAttMod } from "@/lib/utils";
import { InitiativeRoll } from "@/lib/combat-storage";
import {
  getCombat,
  updateCombat as updateCombatFirebase,
  clearCombat as clearCombatFirebase,
  onCombatChange,
} from "@/lib/firebase-combat-storage";

export interface CombatContextType {
  round: number;
  rollInitiatives: () => void;
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
  setCurrentTurn: (value: SetStateAction<number>) => void;
  clearAll: () => void;
  updateHp: (id: string, delta: number) => void;
  addExistingEntry: () => void;
  getSourceList: () => Monster[] | PlayableCharacter[] | NPC[];
  sourceType: "monster" | "playableCharacter" | "npc";
  setSourceType: (
    value: SetStateAction<"monster" | "playableCharacter" | "npc">,
  ) => void;
  addAllPlayers: () => void;
  addAllNPCs: () => void;
  addAllMonsters: () => void;
  initiativeRolls: InitiativeRoll[];
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export function CombatProvider({
  children,
  campaignId,
}: {
  children: React.ReactNode;
  campaignId?: string;
}) {
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
  const [sourceType, setSourceType] = useState<
    "monster" | "playableCharacter" | "npc"
  >("monster");
  const [initiativeRolls, setInitiativeRolls] = useState<InitiativeRoll[]>([]);

  const { handleSavePlayer, handleSaveMonster, handleUpdateNPC, gameData } =
    useGame();

  useEffect(() => {
    if (!campaignId) return;

    const unsubscribe = onCombatChange(campaignId, (data) => {
      if (data) {
        setRound(data.round ?? 1);
        setOnCombat(data.onCombat ?? false);
        setCurrentTurn(data.currentTurn ?? 0);
        setInitiativeEntries(data.initiativeEntries ?? []);
        setInitiativeRolls(data.initiativeRolls ?? []);
      }
    });

    return unsubscribe;
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return;

    updateCombatFirebase(campaignId, {
      round,
      onCombat,
      currentTurn,
      initiativeEntries,
      initiativeRolls,
    }).catch((error) => {
      console.error("Error saving combat data:", error);
    });
  }, [
    campaignId,
    round,
    onCombat,
    currentTurn,
    initiativeEntries,
    initiativeRolls,
  ]);

  const resetAddForm = () => {
    setShowAddForm(false);
    setCustomName("");
    setCustomInitiative(0);
    setCustomHp(0);
    setCustomMaxHp(0);
    setSelectedSourceId("");
  };

  const monsters = gameData.monsters;
  const players = gameData.playableCharacters;
  const npcs = gameData.npcs;
  const getSourceList = () => {
    switch (sourceType) {
      case "monster":
        return monsters;
      case "playableCharacter":
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
      const monster = monsters.find((m: any) => m.id === selectedSourceId);
      if (monster) {
        newEntry = {
          id: monster.id,
          name: monster.name,
          dexMod: getAttMod(monster.attributes.des),
          initiative: getAttMod(monster.attributes.des),
          hp: monster.maxHp,
          maxHp: monster.maxHp,
          type: "monster",
          sourceId: monster.id,
        };
      }
    } else if (sourceType === "playableCharacter") {
      const player = players.find((p: any) => p.id === selectedSourceId);
      if (player) {
        newEntry = {
          id: player.id,
          dexMod: getAttMod(player.attributes.des),
          name: player.name,
          initiative: getAttMod(player.attributes.des),
          hp: player.maxHp,
          maxHp: player.maxHp,
          type: "playableCharacter",
          sourceId: player.id,
        };
      }
    } else if (sourceType === "npc") {
      const npc = npcs.find((n: any) => n.id === selectedSourceId);
      if (npc) {
        newEntry = {
          id: npc.id,
          dexMod: getAttMod(npc.attributes.des),
          name: npc.name,
          initiative: getAttMod(npc.attributes.des),
          hp: npc.maxHp,
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
      dexMod: 0,
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
  };

  const clearAll = async () => {
    setInitiativeEntries([]);
    setInitiativeRolls([]);
    setOnCombat(false);
    setCurrentTurn(0);
    setRound(1);
    if (campaignId) {
      await clearCombatFirebase(campaignId);
    }
  };

  function rollInitiatives() {
    // build all new rolls first
    const newRolls: InitiativeRoll[] = initiativeEntries
      .filter((entry) => entry.initiative != null)
      .map((entry) => {
        const roll = new DiceRoller(20).roll(1).total;
        const dexMod = entry.dexMod;
        return { id: entry.id, roll, dex: dexMod };
      });

    // update initiativeEntries (as you already do)
    setInitiativeEntries((prev) =>
      prev.map((entry) =>
        entry.initiative == null
          ? entry
          : {
              ...entry,
              initiative:
                entry.initiative +
                (newRolls.find((r) => r.id === entry.id)?.roll ?? 0),
            },
      ),
    );

    // merge into initiativeRolls: overwrite roll, sum dex if id exists
    setInitiativeRolls((prev) => {
      const map = new Map<string, InitiativeRoll>();
      // seed with previous values
      for (const r of prev) map.set(r.id, { ...r });

      // merge/overwrite
      for (const nr of newRolls) {
        const existing = map.get(nr.id);
        if (existing) {
          map.set(nr.id, {
            id: nr.id,
            roll: nr.roll, // overwrite roll
            dex: existing.dex, // sum dex
          });
        } else {
          map.set(nr.id, nr);
        }
      }

      return Array.from(map.values());
    });
  }

  function addAllPlayers() {
    const entries: InitiativeEntry[] = gameData.playableCharacters.map(
      (player: PlayableCharacter) => {
        return {
          id: player.id,
          dexMod: getAttMod(player.attributes.dex),
          name: player.name,
          initiative: Math.floor((player.attributes.dex - 10) / 2),
          hp: player.maxHp || 0,
          maxHp: player.maxHp || 0,
          type: "playableCharacter",
        };
      },
    );
    setInitiativeEntries((prev) => [...prev, ...entries]);
  }
  function addAllNPCs() {
    const entries: InitiativeEntry[] = gameData.npcs.map((npc: any) => {
      return {
        id: npc.id,
        dexMod: getAttMod(npc.attributes.des),
        name: npc.name,
        initiative: Math.floor((npc.attributes.des - 10) / 2),
        hp: npc.maxHp || 0,
        maxHp: npc.maxHp || 0,
        type: "npc",
      };
    });
    setInitiativeEntries((prev) => [...prev, ...entries]);
  }

  function addAllMonsters() {
    const entries: InitiativeEntry[] = gameData.monsters.map((monster: any) => {
      return {
        id: monster.id,
        dexMod: getAttMod(monster.attributes.des),
        name: monster.name,
        initiative: Math.floor((monster.attributes.des - 10) / 2),
        hp: monster.maxHp || 0,
        maxHp: monster.maxHp || 0,
        type: "monster",
      };
    });
    setInitiativeEntries((prev) => [...prev, ...entries]);
  }

  const value: CombatContextType = {
    addExistingEntry,
    rollInitiatives,
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
    clearAll,
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
    addAllPlayers,
    addAllNPCs,
    addAllMonsters,
    initiativeRolls,
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
