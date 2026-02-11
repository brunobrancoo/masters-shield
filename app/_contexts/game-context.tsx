"use client";

import { GameData, Monster, NPC, Player } from "@/lib/interfaces/interfaces";
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
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayers,
  onPlayersChange,
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
  playerView: ViewMode;
  setPlayerViewState: Dispatch<SetStateAction<ViewMode>>;
  npcView: "generator" | "list" | "sheet";
  setNPCViewState: Dispatch<SetStateAction<"generator" | "list" | "sheet">>;
  selectedNPC: NPC | undefined;
  setSelectedNPC: Dispatch<SetStateAction<NPC | undefined>>;
  selectedMonster: Monster | undefined;
  setSelectedMonster: Dispatch<SetStateAction<Monster | undefined>>;
  handleSaveMonster: (monster: Monster) => void;
  handleUpdateMonster: (monster: MonsterFormData) => void;
  handleDeleteMonster: (id: string) => void;
  handleSavePlayer: (player: Player) => void;
  handleGenerateNPC: (npc: NPC) => void;
  handleUpdateNPC: (data: NPC) => void;
  handleDeleteNPC: (id: string) => void;
  selectedPlayer: Player | undefined;
  handleDeletePlayer: (id: string) => void;
  setSelectedPlayer: Dispatch<SetStateAction<Player | undefined>>;
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
    players: [],
    npcs: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monsters");

  const [monsterView, setMonsterViewState] = useState<ViewMode>("list");
  const [selectedMonster, setSelectedMonster] = useState<Monster | undefined>();

  const [playerView, setPlayerViewState] = useState<ViewMode>("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

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
    const unsubscribePlayers = onPlayersChange(campaignId, (players) => {
      setGameData((prev) => ({ ...prev, players }));
    });
    const unsubscribeNPCs = onNPCsChange(campaignId, (npcs) => {
      setGameData((prev) => ({ ...prev, npcs }));
    });

    setLoading(false);

    return () => {
      unsubscribeMonsters();
      unsubscribePlayers();
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

  const handleSavePlayer = async (player: Player) => {
    if (!campaignId) return;

    try {
      if (player.id) {
        await updatePlayer(campaignId, player.id, player);
        console.log("Player updated successfully:", player.name);
      } else {
        const newPlayerId = await createPlayer(campaignId, player);
        console.log("Player created successfully with ID:", newPlayerId);
      }
    } catch (error) {
      console.error("Error saving player:", error);
      throw error;
    }
    setPlayerViewState("list");
    setSelectedPlayer(undefined);
  };

  const handleDeletePlayer = async (id: string) => {
    if (!campaignId) return;

    try {
      await deletePlayer(campaignId, id);
    } catch (error) {
      console.error("Error deleting player:", error);
    }
    setPlayerViewState("list");
    setSelectedPlayer(undefined);
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
    playerView,
    selectedNPC,
    selectedMonster,
    setSelectedMonster,
    setMonsterViewState,
    setPlayerViewState,
    setNPCViewState,
    handleDeleteMonster,
    handleUpdateMonster,
    handleGenerateNPC,
    handleSaveMonster,
    handleSavePlayer,
    handleUpdateNPC,
    handleDeleteNPC,
    handleDeletePlayer,
    selectedPlayer,
    setSelectedPlayer,
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
