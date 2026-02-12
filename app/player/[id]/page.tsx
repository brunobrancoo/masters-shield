"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/_contexts/game-context";
import type {
  Player,
  SpellSlots,
  Item,
  Buff,
  Spell,
} from "@/lib/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import D20RollDialog from "@/components/d20-roll-dialog";
import { PlayerNotFound } from "@/components/player-not-found";
import PlayerHPSection from "@/components/player-hp-section";
import PlayerAttributesSection from "@/components/player-attributes-section";
import PlayerCombatStatsSection from "@/components/player-combat-stats-section";
import PlayerSpellSlotsSection from "@/components/player-spell-slots-section";
import PlayerSorceryPointsSection from "@/components/player-sorcery-points-section";
import { PlayerSpellsSection } from "@/components/player-spells-section";
import PlayerInventorySection from "@/components/player-inventory-section";
import PlayerBuffsSection from "@/components/player-buffs-section";
import PlayerDebuffsSection from "@/components/player-debuffs-section";
import PlayerNotesSection from "@/components/player-notes-section";
import { updatePlayerOrSet } from "@/lib/firebase-storage";

export default function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { gameData, setGameData, campaignId } = useGame();
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const resolvedParams = use(params);
  const [editNotes, setEditNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [diceRolls, setDiceRolls] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [d20Advantage, setD20Advantage] = useState<
    "normal" | "advantage" | "disadvantage"
  >("normal");
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [editSpellIndex, setEditSpellIndex] = useState<number | null>(null);

  useEffect(() => {
    const foundPlayer = gameData.players.find(
      (p) => p.id === resolvedParams.id,
    );
    setPlayer(foundPlayer);
    if (foundPlayer) {
      setNotesValue(foundPlayer.notes || "");
    }
  }, [resolvedParams.id, gameData]);

  const updatePlayer = (updates: Partial<Player>) => {
    if (!player || !campaignId || !player.id) {
      console.error("Cannot update player: missing data", {
        player: !!player,
        campaignId: !!campaignId,
        playerId: player?.id,
      });
      return;
    }
    const updatedPlayer = { ...player, ...updates };
    setPlayer(updatedPlayer);
    setGameData((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === player.id ? updatedPlayer : p,
      ),
    }));
    updatePlayerOrSet(campaignId, player.id, updatedPlayer)
      .then(() => {
        console.log("Player updated successfully");
      })
      .catch((error: any) => {
        console.error("Error updating player:", error);
        if (error?.code === "not-found") {
          alert("Erro: Personagem não encontrado no banco de dados. Por favor, recarregue a página.");
        }
      });
  };

  const handleHPChange = (delta: number) => {
    if (!player) return;
    const newHP = Math.max(0, Math.min(player.maxHp, player.hp + delta));
    updatePlayer({ hp: newHP });
  };

  const handleHPModal = (amount: number) => {
    if (!player) return;
    const newHP = Math.max(0, Math.min(player.maxHp, player.hp + amount));
    updatePlayer({ hp: newHP });
  };

  const handleSpellSlotChange = (level: keyof SpellSlots, value: number) => {
    if (!player) return;
    const current = player.spellSlots[level] ?? 0;
    const newValue = current === value ? 0 : value;
    updatePlayer({
      spellSlots: { ...player.spellSlots, [level]: newValue },
    });
  };

  const handleSorceryPointChange = (value: number) => {
    if (!player) return;
    const newValue = player.sorceryPoints === value ? 0 : value;
    updatePlayer({ sorceryPoints: newValue });
  };

  const addItem = (item: Item) => {
    if (!player) return;
    updatePlayer({ inventory: [...(player.inventory || []), item] });
  };

  const removeItem = (index: number) => {
    if (!player) return;
    updatePlayer({
      inventory: (player.inventory || []).filter((_, i) => i !== index),
    });
  };

  const addBuff = (buff: Buff) => {
    if (!player) return;
    updatePlayer({ buffs: [...(player.buffs || []), buff] });
  };

  const removeBuff = (index: number) => {
    if (!player) return;
    updatePlayer({ buffs: (player.buffs || []).filter((_, i) => i !== index) });
  };

  const addDebuff = (debuff: Buff) => {
    if (!player) return;
    updatePlayer({ debuffs: [...(player.debuffs || []), debuff] });
  };

  const removeDebuff = (index: number) => {
    if (!player) return;
    updatePlayer({
      debuffs: (player.debuffs || []).filter((_, i) => i !== index),
    });
  };

  const addSpell = (spell: Spell) => {
    if (!player) return;
    updatePlayer({ spells: [...(player.spells || []), spell] });
  };

  const removeSpell = (index: number) => {
    if (!player) return;
    updatePlayer({
      spells: (player.spells || []).filter((_, i) => i !== index),
    });
  };

  const editSpell = (index: number, updatedSpell: Spell) => {
    if (!player) return;
    const newSpells = [...(player.spells || [])];
    newSpells[index] = updatedSpell;
    updatePlayer({ spells: newSpells });
  };

  const toggleEquip = (index: number) => {
    if (!player || !player.inventory) return;
    const newInventory = [...player.inventory];
    newInventory[index] = {
      ...newInventory[index],
      equipped: !newInventory[index].equipped,
    };
    updatePlayer({ inventory: newInventory });
  };

  const updateItem = (index: number, updatedItem: Item) => {
    if (!player || !player.inventory) return;
    const newInventory = [...player.inventory];
    newInventory[index] = updatedItem;
    updatePlayer({ inventory: newInventory });
  };

  const handleSaveNotes = () => {
    if (!player) return;
    updatePlayer({ notes: notesValue });
    setEditNotes(false);
  };

  const rollD20 = () => {
    setIsRolling(true);
    setTimeout(() => {
      let roll1 = Math.floor(Math.random() * 20) + 1;
      let roll2 = Math.floor(Math.random() * 20) + 1;

      if (d20Advantage === "advantage") {
        const result = Math.max(roll1, roll2);
        setDiceRolls([roll1, roll2, result]);
      } else if (d20Advantage === "disadvantage") {
        const result = Math.min(roll1, roll2);
        setDiceRolls([roll1, roll2, result]);
      } else {
        setDiceRolls([roll1]);
      }
      setIsRolling(false);
    }, 500);
  };

  if (!player) {
    return <PlayerNotFound />;
  }

  return (
    <div className="min-h-screen bg-background parchment-texture pb-12">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/player")}
            className="font-sans"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <D20RollDialog
              onRoll={rollD20}
              advantage={d20Advantage}
              setAdvantage={setD20Advantage}
              rolls={diceRolls}
              isRolling={isRolling}
            />
            <div className="text-right">
              <h2 className="font-sans text-xl">{player.name}</h2>
              <p className="font-serif text-muted-foreground text-sm">
                {player.race} {player.class} - Nível {player.level}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlayerHPSection player={player} onHPChange={handleHPChange} onHPModal={handleHPModal} />
            <PlayerAttributesSection player={player} />
            <PlayerCombatStatsSection player={player} />
            <PlayerSpellSlotsSection player={player} onSpellSlotChange={handleSpellSlotChange} />
            <PlayerSorceryPointsSection player={player} onSorceryPointChange={handleSorceryPointChange} />
            <PlayerSpellsSection player={player} editSpellIndex={editSpellIndex} setEditSpellIndex={setEditSpellIndex} onAddSpell={addSpell} onRemoveSpell={removeSpell} onEditSpell={editSpell} />
            <PlayerInventorySection player={player} editItemIndex={editItemIndex} setEditItemIndex={setEditItemIndex} onAddItem={addItem} onRemoveItem={removeItem} onToggleEquip={toggleEquip} onUpdateItem={updateItem} campaignId={campaignId || ""} />
          </div>

          <div className="space-y-6">
            <PlayerBuffsSection player={player} onAddBuff={addBuff} onRemoveBuff={removeBuff} />
            <PlayerDebuffsSection player={player} onAddDebuff={addDebuff} onRemoveDebuff={removeDebuff} />
            <PlayerNotesSection player={player} editNotes={editNotes} notesValue={notesValue} setEditNotes={setEditNotes} setNotesValue={setNotesValue} onSaveNotes={handleSaveNotes} />
          </div>
        </div>
      </main>
    </div>
  );
}
