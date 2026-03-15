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
  InitiativeEntryWithTemp,
  Monster,
  NPC,
  PlayableCharacter,
  SpellSlots,
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
import {
  updateEntityHp,
  updateEntitySpellSlot,
  updateEntityClassResource,
  updateEntityLegendaryActionPool,
  updateEntityLegendaryResistancePool,
  updateEntityAbilityUse,
} from "@/lib/firebase-storage";

export interface CombatContextType {
  round: number;
  rollInitiatives: () => void;
  onCombat: boolean;
  setOnCombat: (value: SetStateAction<boolean>) => void;
  initiativeEntries: InitiativeEntryWithTemp[];
  setInitiativeEntries: (
    value: SetStateAction<InitiativeEntryWithTemp[]>,
  ) => void;
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
  customAc: number;
  setCustomAc: (value: SetStateAction<number>) => void;
  resetAddForm: () => void;
  addCustomEntry: () => void;
  currentTurn: number;
  setCurrentTurn: (value: SetStateAction<number>) => void;
  clearAll: () => void;
  updateHp: (id: string, delta: number) => void;
  updateTempHp: (id: string, tempHp: number) => void;
  updateSpellSlot: (id: string, level: number, newValue: number) => void;
  updateClassResource: (
    id: string,
    resourceName: string,
    newValue: number,
  ) => void;
  rollIndividualInitiative: (id: string) => void;
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
  fullScreenMode: boolean;
  setFullScreenMode: (value: SetStateAction<boolean>) => void;
  updateLegendaryActionPool: (id: string, delta: number) => void;
  updateLegendaryResistancePool: (id: string, delta: number) => void;
  useSpecialAbility: (id: string, abilityName: string) => void;
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
  const [initiativeEntries, setInitiativeEntries] = useState<
    InitiativeEntryWithTemp[]
  >([]);
  const [customName, setCustomName] = useState("");
  const [customInitiative, setCustomInitiative] = useState(0);
  const [customHp, setCustomHp] = useState(0);
  const [customMaxHp, setCustomMaxHp] = useState(0);
  const [customAc, setCustomAc] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [sourceType, setSourceType] = useState<
    "monster" | "playableCharacter" | "npc"
  >("monster");
  const [initiativeRolls, setInitiativeRolls] = useState<InitiativeRoll[]>([]);
  const [fullScreenMode, setFullScreenMode] = useState(false);

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
    setCustomAc(0);
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

    let newEntry: InitiativeEntryWithTemp | null = null;

    if (sourceType === "monster") {
      const monster = monsters.find((m: any) => m.id === selectedSourceId);
      if (monster && monster.id) {
        const dexValue =
          monster.attributes?.dex ?? (monster as any).dexterity ?? 10;
        newEntry = {
          id: monster.id,
          name: monster.name,
          dexMod: getAttMod(dexValue),
          initiative: getAttMod(dexValue),
          hp: monster.maxHp,
          maxHp: monster.maxHp,
          type: "monster",
          sourceId: monster.id,
        };
      }
    } else if (sourceType === "playableCharacter") {
      const player = players.find((p: any) => p.id === selectedSourceId);
      if (player && player.id) {
        newEntry = {
          id: player.id,
          dexMod: getAttMod(player.attributes.dex),
          name: player.name,
          initiative: getAttMod(player.attributes.dex),
          hp: player.hp || player.maxHp,
          maxHp: player.maxHp,
          type: "playableCharacter",
          sourceId: player.id,
          ac: player.ac,
        };
      }
    } else if (sourceType === "npc") {
      const npc = npcs.find((n: any) => n.id === selectedSourceId);
      if (npc && npc.id) {
        newEntry = {
          id: npc.id,
          dexMod: getAttMod(npc.attributes.dex),
          name: npc.name,
          initiative: getAttMod(npc.attributes.dex),
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

    const newEntry: InitiativeEntryWithTemp = {
      id: `custom-${Date.now()}`,
      name: customName,
      initiative: customInitiative,
      dexMod: 0,
      hp: customHp || 0,
      maxHp: customMaxHp || 0,
      type: "custom",
      ac: customAc || undefined,
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
    const entry = initiativeEntries.find((e) => e.id === id);
    if (!entry) return;

    if (campaignId && entry.type !== "custom") {
      let entity: any = null;
      if (entry.type === "playableCharacter") {
        entity = players.find((p: any) => p.id === id);
      } else if (entry.type === "monster") {
        entity = monsters.find((m: any) => m.id === id);
      } else if (entry.type === "npc") {
        entity = npcs.find((n: any) => n.id === id);
      }

      if (entity) {
        const newHp = Math.max(0, Math.min(entity.maxHp, entity.hp + delta));
        updateEntityHp(campaignId, id, entry.type, newHp);
      }
    } else {
      setInitiativeEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, hp: Math.max(0, Math.min(e.maxHp, e.hp + delta)) }
            : e,
        ),
      );
    }
  };

  const updateTempHp = (id: string, tempHp: number) => {
    setInitiativeEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, tempHp: tempHp > 0 ? tempHp : 0 } : e,
      ),
    );
  };

  const updateSpellSlot = (id: string, level: number, newValue: number) => {
    if (!campaignId) return;

    let entity: any = null;
    let entityType: "playableCharacter" | "monster" | "npc" | null = null;

    entity = players.find((p: any) => p.id === id);
    if (entity) entityType = "playableCharacter";

    if (!entity) {
      entity = monsters.find((m: any) => m.id === id);
      if (entity) entityType = "monster";
    }

    if (!entity) {
      entity = npcs.find((n: any) => n.id === id);
      if (entity) entityType = "npc";
    }

    if (!entity || !entity.spellSlots || !entityType) return;

    updateEntitySpellSlot(
      campaignId,
      id,
      entityType,
      level,
      newValue,
      entity.spellSlots,
    );
  };

  const updateClassResource = (
    id: string,
    resourceName: string,
    newValue: number,
  ) => {
    if (!campaignId) return;

    let entity: any = null;
    let entityType: "playableCharacter" | "monster" | "npc" | null = null;

    entity = players.find((p: any) => p.id === id);
    if (entity) entityType = "playableCharacter";

    if (!entity) {
      entity = npcs.find((n: any) => n.id === id);
      if (entity) entityType = "npc";
    }

    if (!entity || !entityType) return;

    const resource = (entity as any)[resourceName];
    if (
      resource &&
      typeof resource === "object" &&
      "current" in resource &&
      "max" in resource
    ) {
      updateEntityClassResource(
        campaignId,
        id,
        entityType,
        resourceName,
        newValue,
        resource,
      );
    }
  };

  const rollIndividualInitiative = (id: string) => {
    const entry = initiativeEntries.find((e) => e.id === id);
    if (!entry) return;

    const roll = new DiceRoller(20).roll(1).total;
    const dexMod = entry.dexMod;
    const newInitiative = roll + dexMod;

    setInitiativeEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, initiative: newInitiative } : e)),
    );

    setInitiativeRolls((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, roll } : r));
      }
      return [...prev, { id, roll, dex: dexMod }];
    });
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
    const entries: InitiativeEntryWithTemp[] = gameData.playableCharacters.map(
      (player: PlayableCharacter, index: number) => {
        return {
          id: player.id || index.toString(),
          dexMod: getAttMod(player.attributes.dex),
          name: player.name,
          initiative: Math.floor((player.attributes.dex - 10) / 2),
          hp: player.hp || player.maxHp || 0,
          maxHp: player.maxHp || 0,
          type: "playableCharacter",
          ac: player.ac,
          tempHp: 0,
        };
      },
    );
    setInitiativeEntries((prev) => [...prev, ...entries]);
  }
  function addAllNPCs() {
    const entries: InitiativeEntryWithTemp[] = gameData.npcs.map((npc: any) => {
      return {
        id: npc.id,
        dexMod: getAttMod(npc.attributes.dex),
        name: npc.name,
        initiative: Math.floor((npc.attributes.dex - 10) / 2),
        hp: npc.maxHp || 0,
        maxHp: npc.maxHp || 0,
        type: "npc",
      };
    });
    setInitiativeEntries((prev) => [...prev, ...entries]);
  }

  function addAllMonsters() {
    const entries: InitiativeEntryWithTemp[] = gameData.monsters.map(
      (monster: any) => {
        const dexValue =
          monster.attributes?.dex ?? (monster as any).dexterity ?? 10;
        return {
          id: monster.id,
          dexMod: getAttMod(dexValue),
          name: monster.name,
          initiative: Math.floor((dexValue - 10) / 2),
          hp: monster.maxHp || 0,
          maxHp: monster.maxHp || 0,
          type: "monster",
        };
      },
    );
    setInitiativeEntries((prev) => [...prev, ...entries]);
  }

  const updateLegendaryActionPool = (id: string, delta: number) => {
    const monster = monsters.find((m: any) => m.id === id);
    if (!monster || !monster.legendary_actions_pool || !campaignId) return;

    const newCurrent = Math.max(
      0,
      monster.legendary_actions_pool.current + delta,
    );
    const newMax = monster.legendary_actions_pool.max;

    updateEntityLegendaryActionPool(campaignId, id, newCurrent, newMax);

    setInitiativeEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            legendaryActionPool: { current: newCurrent, max: newMax },
          };
        }
        return e;
      }),
    );
  };

  const updateLegendaryResistancePool = (id: string, delta: number) => {
    const monster = monsters.find((m: any) => m.id === id);
    if (!monster || !monster.legendary_resistances || !campaignId) return;

    const newCurrent = Math.max(
      0,
      monster.legendary_resistances.current + delta,
    );
    const newMax = monster.legendary_resistances.max;

    updateEntityLegendaryResistancePool(campaignId, id, newCurrent, newMax);

    setInitiativeEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            legendaryResistancePool: { current: newCurrent, max: newMax },
          };
        }
        return e;
      }),
    );
  };

  const useSpecialAbility = (id: string, abilityName: string) => {
    const monster = monsters.find((m: any) => m.id === id);
    if (!monster || !monster.abilityUses || !campaignId) return;

    const abilityIndex = monster.abilityUses.findIndex(
      (a: any) => a.name === abilityName,
    );
    if (abilityIndex === -1) return;

    const ability = monster.abilityUses[abilityIndex];
    const newCurrent = Math.max(0, ability.current - 1);

    updateEntityAbilityUse(
      campaignId,
      id,
      abilityName,
      newCurrent,
      monster.abilityUses,
    );

    setInitiativeEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updatedAbilityUses = [...(e.abilityUses || [])];
          updatedAbilityUses[abilityIndex] = {
            ...ability,
            current: newCurrent,
          };
          return {
            ...e,
            abilityUses: updatedAbilityUses,
          };
        }
        return e;
      }),
    );
  };

  const value: CombatContextType = {
    addExistingEntry,
    rollInitiatives,
    getSourceList,
    sourceType,
    setSourceType,
    customHp,
    customInitiative,
    customMaxHp,
    customAc,
    setCustomAc,
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
    updateTempHp,
    updateSpellSlot,
    updateClassResource,
    rollIndividualInitiative,
    addAllPlayers,
    addAllNPCs,
    addAllMonsters,
    initiativeRolls,
    fullScreenMode,
    setFullScreenMode,
    updateLegendaryActionPool,
    updateLegendaryResistancePool,
    useSpecialAbility,
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
