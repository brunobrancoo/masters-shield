"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/_contexts/game-context";
import type {
  PlayableCharacter,
  SpellSlots,
  Item,
  Buff,
  Spell,
  InventoryItem,
} from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, PencilIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import D20RollDialog from "@/components/d20-roll-dialog";
import { PlayerNotFound } from "@/components/player-not-found";
import PlayerHPSection from "@/components/player-hp-section";
import PlayerAttributesSection from "@/components/player-attributes-section";
import PlayerSkillsCompactSection from "@/components/player-skills-compact-section";
import PlayerCombatStatsSection from "@/components/player-combat-stats-section";
import PlayerSpellSlotsSection from "@/components/player-spell-slots-section";
import PlayerClassResourcesSection, {
  CLASS_RESOURCES,
} from "@/components/player-class-resources-section";
import PlayerRaceFeaturesSection from "@/components/player-race-features-section";
import PlayerClassFeaturesSection from "@/components/player-class-features-section";
import { PlayerSpellsSection } from "@/components/player-spells-section";
import PlayerInventorySection from "@/components/player-inventory-section";
import PlayerBuffsSection from "@/components/player-buffs-section";
import PlayerDebuffsSection from "@/components/player-debuffs-section";
import PlayerNotesSection from "@/components/player-notes-section";
import { updatePlayableCharacterOrSet } from "@/lib/firebase-storage";
import { PlayerProviders } from "@/app/campaign/[campaignId]/player-providers";
import { sanitizeForFirebase } from "@/lib/character-utils";

export function CharacterSheetContent({
  campaignId,
  playableCharacterId,
  view,
}: {
  campaignId: string;
  playableCharacterId: string;
  view: "master" | "player";
}) {
  const router = useRouter();
  const {
    gameData,
    setGameData,
    campaignId: contextCampaignId,
    setSelectedPlayableCharacter,
    setPlayableCharacterViewState,
  } = useGame();
  const [playableCharacter, setPlayableCharacter] = useState<
    PlayableCharacter | undefined
  >(undefined);
  const [editNotes, setEditNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [diceRolls, setDiceRolls] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [d20Advantage, setD20Advantage] = useState<
    "normal" | "advantage" | "disadvantage"
  >("normal");
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [editSpellIndex, setEditSpellIndex] = useState<number | null>(null);

  // Accordion state for expand/collapse all
  const [openAccordions, setOpenAccordions] = useState<string[]>([
    "attributes",
    "combat",
    "race-features",
    "class-features",
    "spell-slots",
    "class-resources",
    "spells",
    "inventory",
    "buffs",
    "debuffs",
    "notes",
  ]);

  const allAccordionIds = [
    "attributes",
    "combat",
    "race-features",
    "class-features",
    "spell-slots",
    "class-resources",
    "spells",
    "inventory",
    "buffs",
    "debuffs",
    "notes",
  ];

  const expandAll = () => setOpenAccordions(allAccordionIds);
  const collapseAll = () => setOpenAccordions([]);

  useEffect(() => {
    const foundPlayableCharacter = gameData.playableCharacters.find(
      (p: any) => p.id === playableCharacterId,
    );
    setPlayableCharacter(foundPlayableCharacter);
    if (foundPlayableCharacter) {
      setNotesValue(foundPlayableCharacter.notes || "");
    }
  }, [playableCharacterId, gameData]);

  const updatePlayableCharacter = async (
    updates: Partial<PlayableCharacter>,
  ) => {
    if (!playableCharacter || !contextCampaignId || !playableCharacter.id) {
      console.error("Cannot update playableCharacter: missing data", {
        playableCharacter: !!playableCharacter,
        campaignId: !!contextCampaignId,
        playableCharacterId: playableCharacter?.id,
      });
      return false;
    }

    // Cast to PlayableCharacter to handle Union Type mismatches during updates
    const updatedPlayableCharacter = {
      ...playableCharacter,
      ...updates,
    } as PlayableCharacter;

    const sanitizedData = sanitizeForFirebase(updatedPlayableCharacter);

    try {
      await updatePlayableCharacterOrSet(
        contextCampaignId,
        playableCharacter.id,
        sanitizedData,
      );

      setPlayableCharacter(updatedPlayableCharacter);
      setGameData((prev) => ({
        ...prev,
        playableCharacters: prev.playableCharacters.map((p) =>
          p.id === playableCharacter.id ? updatedPlayableCharacter : p,
        ),
      }));
      console.log("PlayableCharacter updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating playableCharacter:", error);
      if (error?.code === "not-found") {
        alert(
          "Erro: Personagem não encontrado no banco de dados. Por favor, recarregue a página.",
        );
      } else {
        alert("Erro ao atualizar personagem. A operação foi cancelada.");
      }
      return false;
    }
  };

  const handleHPChange = (delta: number) => {
    if (!playableCharacter) return;
    const newHP = Math.max(
      0,
      Math.min(playableCharacter.maxHp, playableCharacter.hp + delta),
    );
    updatePlayableCharacter({ hp: newHP });
  };

  const handleHPModal = (amount: number) => {
    if (!playableCharacter) return;
    const newHP = Math.max(
      0,
      Math.min(playableCharacter.maxHp, playableCharacter.hp + amount),
    );
    updatePlayableCharacter({ hp: newHP });
  };

  const handleSpellSlotChange = (level: keyof SpellSlots, value: number) => {
    if (!playableCharacter || !playableCharacter.spellSlots) return;
    const current = playableCharacter.spellSlots[level]?.current ?? 0;
    const max = playableCharacter.spellSlots[level]?.max ?? 0;
    const newValue = current === value ? 0 : Math.min(value, max);
    updatePlayableCharacter({
      spellSlots: {
        ...playableCharacter.spellSlots,
        [level]: { current: newValue, max },
      },
    });
  };

  const handleClassResourceChange = (resourceType: string, value: number) => {
    if (!playableCharacter) return;
    const resourceFieldMap: Record<string, string> = {
      sorceryPoints: "sorceryPoints",
      kiPoints: "kiPoints",
      rages: "rages",
      inspiration: "inspiration",
      channelDivinity: "channelDivinityCharges",
      actionSurges: "actionSurges",
      indomitables: "indomitables",
    };
    const fieldName = resourceFieldMap[resourceType];
    if (!fieldName) return;
    const resource = playableCharacter[fieldName as keyof PlayableCharacter];
    if (!resource || typeof resource !== "object") return;
    const current = (resource as any).current ?? 0;
    const max =
      (resource as any).max ?? (resourceType === "inspiration" ? 1 : 0);
    const newValue = current === value ? 0 : Math.min(value, max);
    updatePlayableCharacter({ [fieldName]: { current: newValue, max } });
  };

  const addItem = async (item: InventoryItem) => {
    if (!playableCharacter) return;
    await updatePlayableCharacter({
      inventory: [...(playableCharacter.inventory || []), item],
    });
  };

  const removeItem = async (index: number) => {
    if (!playableCharacter) return;
    await updatePlayableCharacter({
      inventory: (playableCharacter.inventory || []).filter(
        (_, i) => i !== index,
      ),
    });
  };

  const addBuff = (buff: Buff) => {
    if (!playableCharacter) return;
    updatePlayableCharacter({
      buffs: [...(playableCharacter.buffs || []), buff],
    });
  };

  const removeBuff = (index: number) => {
    if (!playableCharacter) return;
    updatePlayableCharacter({
      buffs: (playableCharacter.buffs || []).filter((_, i) => i !== index),
    });
  };

  const addDebuff = (debuff: Buff) => {
    if (!playableCharacter) return;
    updatePlayableCharacter({
      debuffs: [...(playableCharacter.debuffs || []), debuff],
    });
  };

  const removeDebuff = (index: number) => {
    if (!playableCharacter) return;
    updatePlayableCharacter({
      debuffs: (playableCharacter.debuffs || []).filter((_, i) => i !== index),
    });
  };

  const addSpell = async (spell: Spell) => {
    if (!playableCharacter) return;
    // Only use spellList, legacy 'spells' is removed
    const currentSpellList = playableCharacter.spellList || [];
    await updatePlayableCharacter({
      spellList: [...currentSpellList, spell],
    });
  };

  const removeSpell = async (index: number) => {
    if (!playableCharacter) return;
    // Only use spellList, legacy 'spells' is removed
    const currentSpellList = playableCharacter.spellList || [];
    await updatePlayableCharacter({
      spellList: currentSpellList.filter((_, i) => i !== index),
    });
  };

  const editSpell = async (index: number, updatedSpell: Spell) => {
    if (!playableCharacter) return;
    // Only use spellList
    const currentSpellList = playableCharacter.spellList || [];
    const newSpellList = [...currentSpellList];
    newSpellList[index] = updatedSpell;
    await updatePlayableCharacter({
      spellList: newSpellList,
    });
  };

  const toggleEquip = async (index: number) => {
    if (!playableCharacter || !playableCharacter.inventory) return;
    const newInventory = [...playableCharacter.inventory];
    newInventory[index] = {
      ...newInventory[index],
      equipped: !newInventory[index].equipped,
    };
    await updatePlayableCharacter({ inventory: newInventory });
  };

  const updateItem = async (index: number, updatedItem: InventoryItem) => {
    if (!playableCharacter || !playableCharacter.inventory) return;
    const newInventory = [...playableCharacter.inventory];
    newInventory[index] = updatedItem;
    await updatePlayableCharacter({ inventory: newInventory });
  };

  const handleSaveNotes = () => {
    if (!playableCharacter) return;
    updatePlayableCharacter({ notes: notesValue });
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

  if (!playableCharacter) {
    return <PlayerNotFound />;
  }

  return (
    <div className="min-h-screen bg-background parchment-texture pb-12">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-start w-auto flex--11">
            <div className="text-xl">
              <h2 className="font-sans text-2xl font-bold">
                {playableCharacter.name}
              </h2>
              <p className="font-serif text-muted-foreground text-xl">
                {playableCharacter.raceName} {playableCharacter.className} -
                Nível {playableCharacter.level}
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-center flex-1">
            <Button
              variant="outline"
              onClick={() => {
                if (view === "master") {
                  setSelectedPlayableCharacter(undefined);
                } else {
                  router.push(`/campaign/${campaignId}`);
                }
              }}
              className="font-sans"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {/* Expand/Collapse All Buttons */}
            <div className="flex items-center gap-2 w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="font-sans ml-2"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Expandir Tudo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="font-sans"
              >
                <ChevronUp className="w-4 h-4 mr-2" />
                Recolher Tudo
              </Button>
            </div>
            {view === "master" && (
              <Button
                onClick={() => setPlayableCharacterViewState("form")}
                className="ml-auto"
                variant={"outline"}
              >
                <PencilIcon />
                Editar Personagem
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* HP Section - NOT in accordion */}
            <PlayerHPSection
              playableCharacter={playableCharacter}
              onHPChange={handleHPChange}
              onHPModal={handleHPModal}
            />

            {/* Accordion for main sections */}
            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="space-y-4"
            >
              <AccordionItem
                value="attributes"
                className="rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Atributos & Perícias
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PlayerAttributesSection
                      playableCharacter={playableCharacter}
                    />
                    <PlayerSkillsCompactSection
                      playableCharacter={playableCharacter}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="combat" className="rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Combate
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerCombatStatsSection
                    playableCharacter={playableCharacter}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="race-features"
                className="rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Traços de Raça
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerRaceFeaturesSection
                    playableCharacter={playableCharacter}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="class-features"
                className="rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Características de Classe
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerClassFeaturesSection
                    playableCharacter={playableCharacter}
                  />
                </AccordionContent>
              </AccordionItem>

              {/*CONDITIONAL FROM HERE*/}

              {playableCharacter?.spellSlots && (
                <AccordionItem
                  value="spell-slots"
                  className="rounded-lg px-4 bg-card"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Slots de Magia
                  </AccordionTrigger>
                  <AccordionContent>
                    <PlayerSpellSlotsSection
                      playableCharacter={playableCharacter}
                      onSpellSlotChange={handleSpellSlotChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {CLASS_RESOURCES[playableCharacter.classIndex] && (
                <AccordionItem
                  value="class-resources"
                  className="rounded-lg px-4 bg-card"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Recursos de Classe
                  </AccordionTrigger>
                  <AccordionContent>
                    <PlayerClassResourcesSection
                      playableCharacter={playableCharacter}
                      onResourceChange={handleClassResourceChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="spells" className="rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Magias
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerSpellsSection
                    playableCharacter={playableCharacter}
                    editSpellIndex={editSpellIndex}
                    setEditSpellIndex={setEditSpellIndex}
                    onAddSpell={addSpell}
                    onRemoveSpell={removeSpell}
                    onEditSpell={editSpell}
                    campaignId={contextCampaignId || ""}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="inventory"
                className="rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Inventário
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerInventorySection
                    playableCharacter={playableCharacter}
                    editItemIndex={editItemIndex}
                    setEditItemIndex={setEditItemIndex}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                    onToggleEquip={toggleEquip}
                    onUpdateItem={updateItem}
                    campaignId={contextCampaignId || ""}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-4 bg-stone-50/10 rounded-lg p-8">
            {/* Accordion for right column sections */}
            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="space-y-4"
            >
              <AccordionItem value="buffs" className="rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Buffs
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerBuffsSection
                    playableCharacter={playableCharacter}
                    onAddBuff={addBuff}
                    onRemoveBuff={removeBuff}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="debuffs"
                className="rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Debuffs
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerDebuffsSection
                    playableCharacter={playableCharacter}
                    onAddDebuff={addDebuff}
                    onRemoveDebuff={removeDebuff}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notes" className="rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Anotações
                </AccordionTrigger>
                <AccordionContent>
                  <PlayerNotesSection
                    playableCharacter={playableCharacter}
                    editNotes={editNotes}
                    notesValue={notesValue}
                    setEditNotes={setEditNotes}
                    setNotesValue={setNotesValue}
                    onSaveNotes={handleSaveNotes}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CharacterSheetPage({
  params,
}: {
  params: Promise<{ campaignId: string; playableCharacterId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <PlayerProviders campaignId={resolvedParams.campaignId}>
      <CharacterSheetContent
        campaignId={resolvedParams.campaignId}
        playableCharacterId={resolvedParams.playableCharacterId}
        view="player"
      />
    </PlayerProviders>
  );
}
