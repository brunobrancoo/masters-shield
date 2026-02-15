"use client";

import {
  GameData,
  Monster,
  NPC,
  PlayableCharacter,
} from "@/lib/interfaces/interfaces";
import { MonsterFormData, NPCFormData } from "@/lib/schemas";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createMonster,
  updateMonster,
  deleteMonster,
  getMonsters,
  onMonstersChange,
  createPlayableCharacter,
  updatePlayableCharacter,
  deletePlayableCharacter,
  getPlayableCharacters,
  onPlayableCharactersChange,
  createNPC,
  updateNPC,
  deleteNPC,
  getNPCs,
  onNPCsChange,
} from "@/lib/firebase-storage";

const GameContext = createContext<GameContextType | undefined>(undefined);

type ViewMode = "list" | "form" | "sheet";

interface GameContextType {
  campaignId: string | null;
  setCampaignId: Dispatch<SetStateAction<string | null>>;
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  monsterView: ViewMode;
  setMonsterViewState: Dispatch<SetStateAction<ViewMode>>;
  playableCharacterView: ViewMode;
  setPlayableCharacterViewState: Dispatch<SetStateAction<ViewMode>>;
  npcView: "generator" | "list" | "sheet";
  setNPCViewState: Dispatch<SetStateAction<"generator" | "list" | "sheet">>;
  selectedNPC: NPC | undefined;
  setSelectedNPC: Dispatch<SetStateAction<NPC | undefined>>;
  selectedMonster: Monster | undefined;
  setSelectedMonster: Dispatch<SetStateAction<Monster | undefined>>;
  handleSaveMonster: (monster: Monster) => void;
  handleUpdateMonster: (monster: MonsterFormData) => void;
  handleDeleteMonster: (id: string) => void;
  handleSavePlayer: (player: PlayableCharacter) => void;
  handleGenerateNPC: (npc: NPC) => void;
  handleUpdateNPC: (data: NPC) => void;
  handleDeleteNPC: (id: string) => void;
  selectedPlayableCharacter: PlayableCharacter | undefined;
  handleDeletePlayableCharacter: (id: string) => void;
  setSelectedPlayableCharacter: Dispatch<
    SetStateAction<PlayableCharacter | undefined>
  >;
  loading: boolean;
}

export function GameProvider({
  children,
  campaignId: initialCampaignId,
}: {
  children: ReactNode;
  campaignId?: string;
}) {
  const [campaignId, setCampaignId] = useState<string | null>(
    initialCampaignId || null,
  );
  const [gameData, setGameData] = useState<GameData>({
    monsters: [],
    playableCharacters: [],
    npcs: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monsters");

  const [monsterView, setMonsterViewState] = useState<ViewMode>("list");
  const [selectedMonster, setSelectedMonster] = useState<Monster | undefined>();

  const [playableCharacterView, setPlayableCharacterViewState] =
    useState<ViewMode>("list");
  const [selectedPlayableCharacter, setSelectedPlayableCharacter] = useState<
    PlayableCharacter | undefined
  >();

  const [npcView, setNPCViewState] = useState<"generator" | "list" | "sheet">(
    "generator",
  );
  const [selectedNPC, setSelectedNPC] = useState<NPC | undefined>();

  useEffect(() => {
    if (!campaignId) return;

    setLoading(true);
    const unsubscribeMonsters = onMonstersChange(campaignId, (monsters) => {
      setGameData((prev) => ({ ...prev, monsters }));
    });
    const unsubscribePlayableCharacters = onPlayableCharactersChange(
      campaignId,
      (playableCharacters) => {
        setGameData((prev) => ({ ...prev, playableCharacters }));
      },
    );
    const unsubscribeNPCs = onNPCsChange(campaignId, (npcs) => {
      setGameData((prev) => ({ ...prev, npcs }));
    });

    setLoading(false);

    return () => {
      unsubscribeMonsters();
      unsubscribePlayableCharacters();
      unsubscribeNPCs();
    };
  }, [campaignId]);

  const handleSaveMonster = async (monster: Monster) => {
    if (!campaignId) return;

    try {
      if (monster.id) {
        await updateMonster(campaignId, monster.id, monster);
      } else {
        const newMonster = { ...monster, id: crypto.randomUUID() };
        await createMonster(campaignId, newMonster);
      }
    } catch (error) {
      console.error("Error saving monster:", error);
    }
    setMonsterViewState("list");
    setSelectedMonster(undefined);
  };

  const handleUpdateMonster = async (data: MonsterFormData) => {
    if (!selectedMonster || !campaignId) return;

    const updatedMonster: Monster = {
      ...selectedMonster,
      ...data,
    };

    try {
      await updateMonster(campaignId, selectedMonster.id, updatedMonster);
    } catch (error) {
      console.error("Error updating monster:", error);
    }

    setMonsterViewState("list");
    setSelectedMonster(undefined);
  };

  const handleDeleteMonster = async (id: string) => {
    if (!campaignId) return;

    try {
      await deleteMonster(campaignId, id);
    } catch (error) {
      console.error("Error deleting monster:", error);
    }
    setMonsterViewState("list");
    setSelectedMonster(undefined);
  };

  const handleSavePlayer = async (player: PlayableCharacter) => {
    if (!campaignId) return;

    try {
      if (player.id) {
        await updatePlayableCharacter(campaignId, player.id, player);
        console.log("Player updated successfully:", player.name);
      } else {
        const newPlayerId = await createPlayableCharacter(campaignId, player);
        console.log("Player created successfully with ID:", newPlayerId);
      }
    } catch (error) {
      console.error("Error saving player:", error);
      throw error;
    }
    setPlayableCharacterViewState("list");
    setSelectedPlayableCharacter(undefined);
  };

  const handleDeletePlayableCharacter = async (id: string) => {
    if (!campaignId) return;

    try {
      await deletePlayableCharacter(campaignId, id);
    } catch (error) {
      console.error("Error deleting player:", error);
    }
    setPlayableCharacterViewState("list");
    setSelectedPlayableCharacter(undefined);
  };

  const handleGenerateNPC = async (npc: NPC) => {
    if (!campaignId) return;

    try {
      const newNPC = { ...npc, id: crypto.randomUUID() };
      await createNPC(campaignId, newNPC);
    } catch (error) {
      console.error("Error generating NPC:", error);
    }
    setNPCViewState("list");
  };

  const handleUpdateNPC = async (npc: NPC) => {
    if (!campaignId) return;

    try {
      if (npc.id) {
        await updateNPC(campaignId, npc.id, npc);
      } else {
        const newNPC = { ...npc, id: crypto.randomUUID() };
        await createNPC(campaignId, newNPC);
      }
    } catch (error) {
      console.error("Error updating NPC:", error);
    }

    setNPCViewState("list");
  };

  const handleDeleteNPC = async (id: string) => {
    if (!campaignId) return;

    try {
      await deleteNPC(campaignId, id);
    } catch (error) {
      console.error("Error deleting NPC:", error);
    }
    setNPCViewState("list");
  };

  const value: GameContextType = {
    setSelectedNPC,
    setGameData,
    activeTab,
    setActiveTab,
    gameData,
    monsterView,
    npcView,
    playableCharacterView,
    selectedNPC,
    selectedMonster,
    setSelectedMonster,
    setMonsterViewState,
    setPlayableCharacterViewState,
    setNPCViewState,
    handleDeleteMonster,
    handleUpdateMonster,
    handleGenerateNPC,
    handleSaveMonster,
    handleSavePlayer,
    handleUpdateNPC,
    handleDeleteNPC,
    handleDeletePlayableCharacter,
    selectedPlayableCharacter,
    setSelectedPlayableCharacter,
    campaignId,
    setCampaignId,
    loading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within an GameProvider");
  }
  return context;
};
