# Combat System Database Integration Plan

## Overview
Migrate the combat system from localStorage-based state management to Firebase database-driven operations.

## Database Schema

### Combat Subcollection (`campaigns/{campaignId}/combat/active`)
```typescript
interface CombatData {
  currentTurn: number;
  initiativeEntries: InitiativeEntryWithTemp[];
  onCombat: boolean;
  round: number;
}

interface InitiativeEntryWithTemp extends InitiativeEntry {
  tempHp?: number;
}
```

### PlayableCharacter Direct Updates Only
- `hp` (current only)
- `spellSlots` (current values only)
- `class resources` (current values only, e.g., sorceryPoints, kiPoints, etc.)

## Task Breakdown

### 1. Update Type Definitions
- **File**: `lib/schemas.ts`
- Add `tempHp` field to `initiativeEntrySchema`
- Export `InitiativeEntryWithTemp` type

### 2. Update Combat Storage
- **File**: `lib/combat-storage.ts`
- Update `CombatData` interface to include new fields
- Remove/legacy localStorage functions (keep for now but note as deprecated)
- Export updated types

### 3. Update Firebase Combat Storage
- **File**: `lib/firebase-combat-storage.ts`
- Ensure functions support updated `CombatData` interface
- No changes needed if using merge, but verify compatibility

### 4. Refactor Combat Context
- **File**: `app/_contexts/combat-context.tsx`
- **Major changes**:
  - Remove localStorage operations
  - Add `updateTempHp` function (updates combat subcollection)
  - Add `updateSpellSlot` function (updates playableCharacter directly)
  - Add `updateClassResource` function (updates playableCharacter directly)
  - Add `rollIndividualInitiative` function for single entry rolls
  - Update `addCustomEntry` to include AC field
  - Update `addExistingEntry` to sync from database for players
  - For players: fetch `hp`, `spellSlots`, `class resources` from `gameData.playableCharacters`
  - Store `tempHp` in initiative entry in combat subcollection only

### 5. Update Initiative Entry Card (Non-Fullscreen)
- **File**: `components/initiative-entry-card.tsx`
- Add AC display below initiative
- Add temporary HP field (single number input with +/- buttons)
- Master can deal damage and heal temp HP

### 6. Update Add Entry Form
- **File**: `components/add-entry-form.tsx`
- Add AC field to custom entry form
- Ensure HP and AC are entered, then entry enters initiative queue

### 7. Implement Full Screen Combat
- **File**: `components/combat/index.tsx`
- **New component** (currently placeholder)
- Features:
  - Display characters in cards
  - Toggle fullscreen button (to return to sidebar)
  - Combat round display
  - Next turn button
  - For each player card:
    - Compact spell slot management (clickable)
    - Compact class resource management (clickable)
    - HP damage/heal
    - Temporary HP field
  - Individual roll initiative button

### 8. Update App Sidebar
- **File**: `components/app-sidebar.tsx`
- Add "Rolar iniciativa individual" button (per entry)
- Ensure all new context functions are available
- Maintain existing functionality

### 9. Key Design Decisions

#### Data Flow for Players
1. **Read**: Initiative entry data + `tempHp` from combat subcollection, `hp`/`spellSlots`/`classResources` from playableCharacter document
2. **Write**: `hp`/`spellSlots`/`classResources` → updatePlayableCharacter, `tempHp` → updateCombat

#### Custom/Monster/NPC Entries
- All data stored in combat subcollection (initiativeEntries)
- No direct document updates (they don't have database documents yet)

#### Temporary HP
- Stored in `initiativeEntry.tempHp` in combat subcollection
- Displayed separately from regular HP
- Can be added/removed by master via +/- buttons

#### Spell Slots & Class Resources
- Only for players (type === "playableCharacter")
- Clickable to decrease (use), click again to increase (recover)
- Update directly on playableCharacter document
- Use PlayerSpellSlotsSection as UI reference (compact version)

#### Roll Initiative Individual
- New function: `rollIndividualInitiative(id: string)`
- Rolls d20 + dexMod for specific entry
- Updates initiative value
- Stores in `initiativeRolls` array (like roll all)

#### Stopping Combat to Add Characters
- Toggle `onCombat` to false
- Allow adding new entries
- Start combat again resets turn to 0 and round to 1

### 10. UI Components Reference

#### Fullscreen Player Card Structure
```tsx
<Card>
  <CardHeader>
    <Title>Name + AC</Title>
    <HP Bar + Temp HP>
  </CardHeader>
  <CardContent>
    <HP Controls (-5, -1, +1, +5)>
    <Spell Slots (compact, clickable)>
    <Class Resources (compact, clickable)>
  </CardContent>
</Card>
```

## Testing Checklist
- [ ] Combat state persists across page refreshes
- [ ] Player HP updates sync to playableCharacter document
- [ ] Player spell slot updates sync to playableCharacter document
- [ ] Player class resource updates sync to playableCharacter document
- [ ] Temp HP stores in combat subcollection only
- [ ] Individual initiative roll works per entry
- [ ] Roll all initiatives still works
- [ ] AC displays in non-fullscreen view
- [ ] Temp HP field works in both views
- [ ] Fullscreen mode displays all required features
- [ ] Toggle fullscreen works in both directions
- [ ] Custom entries include AC field
- [ ] Adding entries during stopped combat works
- [ ] Combat round and turn tracking work
- [ ] Next turn correctly handles round increment
