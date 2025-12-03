"use client";
import { GameData, Monster, NPC, Player } from "@/lib/interfaces/interfaces";
import { MonsterFormData, NPCFormData } from "@/lib/schemas";
import { loadGameData, saveGameData } from "@/lib/storage";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const GameContext = createContext<GameContextType | undefined>(undefined);
type ViewMode = "list" | "form" | "sheet";

interface GameContextType {
  gameData: GameData;
  setGameData: Dispatch<SetStateAction<GameData>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  monsterView: ViewMode;
  setMonsterView: Dispatch<SetStateAction<ViewMode>>;
  playerView: ViewMode;
  setPlayerView: Dispatch<SetStateAction<ViewMode>>;
  npcView: "generator" | "list" | "sheet";
  setNPCView: Dispatch<SetStateAction<"generator" | "list" | "sheet">>;
  selectedNPC: NPC | undefined;
  setSelectedNPC: Dispatch<SetStateAction<NPC | undefined>>;
  selectedMonster: Monster | undefined;
  setSelectedMonster: Dispatch<SetStateAction<Monster | undefined>>;
  handleSaveMonster: (monster: Monster) => void;
  handleUpdateMonster: (monster: MonsterFormData) => void;
  handleDeleteMonster: (id: string) => void;
  handleSavePlayer: (player: Player) => void;
  handleGenerateNPC: (npc: NPC) => void;
  handleUpdateNPC: (data: NPCFormData) => void;
  handleDeleteNPC: (id: string) => void;
  selectedPlayer: Player | undefined;
  handleDeletePlayer: (id: string) => void;
  setSelectedPlayer: Dispatch<SetStateAction<Player | undefined>>;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameData, setGameData] = useState<GameData>({
    monsters: [],
    players: [],
    npcs: [],
  });
  const [activeTab, setActiveTab] = useState("monsters");

  // Monster state
  const [monsterView, setMonsterView] = useState<ViewMode>("list");
  const [selectedMonster, setSelectedMonster] = useState<Monster | undefined>();

  // Player state
  const [playerView, setPlayerView] = useState<ViewMode>("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

  // NPC state
  const [npcView, setNPCView] = useState<"generator" | "list" | "sheet">(
    "generator",
  );
  const [selectedNPC, setSelectedNPC] = useState<NPC | undefined>();

  useEffect(() => {
    const data = loadGameData();
    setGameData(data);
  }, []);

  useEffect(() => {
    saveGameData(gameData);
  }, [gameData]);

  // Tab key navigation (skip when typing or navigating a form)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const activeEl = document.activeElement as HTMLElement | null;
      if (!activeEl) return;

      const tag = activeEl.tagName.toLowerCase();
      const isEditable =
        activeEl.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select";

      // If user is typing or navigating form fields, do nothing
      if (isEditable) return;

      e.preventDefault();

      setActiveTab((current) => {
        const order = ["monsters", "players", "npcs"];
        const index = order.indexOf(current);

        if (index === -1) return "monsters"; // fallback safety

        // Shift+Tab goes backwards, Tab goes forwards
        const nextIndex = e.shiftKey
          ? (index - 1 + order.length) % order.length
          : (index + 1) % order.length;

        return order[nextIndex];
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Monster handlers
  const handleSaveMonster = (monster: Monster) => {
    setGameData((prev) => {
      const exists = prev.monsters.find((m) => m.id === monster.id);
      if (exists) {
        return {
          ...prev,
          monsters: prev.monsters.map((m) =>
            m.id === monster.id ? monster : m,
          ),
        };
      }
      return {
        ...prev,
        monsters: [...prev.monsters, monster],
      };
    });
    setMonsterView("list");
    setSelectedMonster(undefined);
  };

  const handleUpdateMonster = (data: MonsterFormData) => {
    if (!selectedMonster) return;

    const updatedMonster: Monster = {
      ...selectedMonster,
      ...data,
    };

    setGameData((prev) => ({
      ...prev,
      monsters: prev.monsters.map((m) =>
        m.id === selectedMonster.id ? updatedMonster : m,
      ),
    }));

    setSelectedMonster(updatedMonster);
  };

  const handleDeleteMonster = (id: string) => {
    setGameData((prev) => ({
      ...prev,
      monsters: prev.monsters.filter((m) => m.id !== id),
    }));
    setMonsterView("list");
    setSelectedMonster(undefined);
  };

  // Player handlers
  const handleSavePlayer = (player: Player) => {
    setGameData((prev) => {
      const exists = prev.players.find((p) => p.id === player.id);
      if (exists) {
        return {
          ...prev,
          players: prev.players.map((p) => (p.id === player.id ? player : p)),
        };
      }
      return {
        ...prev,
        players: [...prev.players, player],
      };
    });
    setPlayerView("list");
    setSelectedPlayer(undefined);
  };

  const handleDeletePlayer = (id: string) => {
    setGameData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
    setPlayerView("list");
    setSelectedPlayer(undefined);
  };

  // NPC handlers
  const handleGenerateNPC = (npc: NPC) => {
    setGameData((prev) => ({
      ...prev,
      npcs: [...prev.npcs, npc],
    }));
    setNPCView("list");
  };

  const handleUpdateNPC = (data: NPCFormData) => {
    if (!selectedNPC) return;

    const updatedNPC: NPC = {
      ...selectedNPC,
      ...data,
    };

    setGameData((prev) => ({
      ...prev,
      npcs: prev.npcs.map((n) => (n.id === selectedNPC.id ? updatedNPC : n)),
    }));

    setSelectedNPC(updatedNPC);
  };

  const handleDeleteNPC = (id: string) => {
    setGameData((prev) => ({
      ...prev,
      npcs: prev.npcs.filter((n) => n.id !== id),
    }));
    setNPCView("list");
    setSelectedNPC(undefined);
  };

  const value: GameContextType = {
    setSelectedNPC,
    setGameData,
    activeTab,
    gameData,
    monsterView,
    npcView,
    playerView,
    selectedNPC,
    setActiveTab,
    setMonsterView,
    setNPCView,
    setPlayerView,
    selectedMonster,
    setSelectedMonster,
    handleDeleteMonster,
    handleDeleteNPC,
    handleGenerateNPC,
    handleSaveMonster,
    handleSavePlayer,
    handleUpdateMonster,
    handleUpdateNPC,
    handleDeletePlayer,
    selectedPlayer,
    setSelectedPlayer,
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
