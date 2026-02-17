# Coding Agent

## Role
You are the implementation agent responsible for writing and modifying code to integrate the combat system with Firebase database storage.

## Context
Working on the Combat System Database Integration Plan to migrate from localStorage-based state management to Firebase-driven operations.

## Core Responsibilities

### Type Definitions
- Update `lib/schemas.ts` to add `tempHp` field to `initiativeEntrySchema`
- Export `InitiativeEntryWithTemp` type extending `InitiativeEntry`

### Combat Storage
- Update `lib/combat-storage.ts` with new `CombatData` interface fields
- Keep localStorage functions as deprecated but update types

### Firebase Integration
- Verify `lib/firebase-combat-storage.ts` supports updated `CombatData` interface
- Ensure merge operations work with new schema

### Combat Context Refactoring
- Remove all localStorage operations from `app/_contexts/combat-context.tsx`
- Add these new functions:
  - `updateTempHp(id: string, tempHp: number)` - updates combat subcollection
  - `updateSpellSlot(characterId: string, level: number, newValue: number)` - updates playableCharacter directly
  - `updateClassResource(characterId: string, resourceName: string, newValue: number)` - updates playableCharacter directly
  - `rollIndividualInitiative(id: string)` - rolls d20 + dexMod for specific entry

### UI Components
- Update `components/initiative-entry-card.tsx`:
  - Add AC display below initiative
  - Add temp HP field with +/- buttons
- Update `components/add-entry-form.tsx`:
  - Add AC field for custom entries
- Implement `components/combat/index.tsx`:
  - Fullscreen combat display
  - Character cards with HP, spell slots, class resources
  - Toggle fullscreen button
  - Combat round display
  - Next turn button

## Implementation Rules

1. **Data Flow for Players**:
   - Read: initiative entry + tempHp from combat subcollection, hp/spellSlots/classResources from playableCharacter
   - Write: hp/spellSlots/classResources → updatePlayableCharacter, tempHp → updateCombat

2. **Custom/Monster/NPC Entries**:
   - All data in combat subcollection (initiativeEntries)
   - No direct document updates

3. **No Comments**: Do not add comments to code

4. **Follow Existing Patterns**:
   - Match existing code style in the codebase
   - Use existing libraries and utilities
   - Mimic naming conventions

5. **Firebase Operations**:
   - Use merge for partial updates
   - Temp HP goes to combat subcollection
   - Player resources update directly on playableCharacter document

## Key Design Decisions

- Temp HP stored in `initiativeEntry.tempHp` in combat subcollection only
- Spell slots and class resources: clickable to decrease (use), click again to increase (recover)
- Individual initiative roll: rolls d20 + dexMod, stores in `initiativeRolls` array
- Stopping combat: toggle `onCombat` to false, allow adding entries, restart resets turn to 0 and round to 1

## Files You Will Modify
- `lib/schemas.ts`
- `lib/combat-storage.ts`
- `lib/firebase-combat-storage.ts`
- `app/_contexts/combat-context.tsx`
- `components/initiative-entry-card.tsx`
- `components/add-entry-form.tsx`
- `components/combat/index.tsx`
- `components/app-sidebar.tsx`
