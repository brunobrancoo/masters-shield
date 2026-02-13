# Phase 1: Type Refactoring - Implementation Summary

## Overview
Phase 1 of the D&D character form refactoring has been completed successfully. The type system has been restructured to use discriminated unions for type-safe class-specific resource management.

## Changes Made

### 1. lib/interfaces/interfaces.ts

#### BasePlayableCharacter Interface
Created a new base interface containing all common fields shared across all D&D 5e classes:
- Identity: `id`, `name`
- Race: `raceIndex`, `raceName`, `raceData`
- Class: `classIndex`, `className`, `classData`, `level`, `levelData`
- Subclass: `subclassIndex`, `subclassName`
- Background: `backgroundIndex`, `backgroundName`, `backgroundData`
- Features: `raceTraits`, `backgroundFeature`, `classFeatures`, `customFeatures`, `featFeatures`
- Proficiencies: `selectedProficiencies`, `raceProficiencies`, `backgroundProficiencies`, `classProficiencies`
- Equipment: `classEquipment`, `backgroundEquipment`
- Stats: `hp`, `maxHp`, `attributes`, `inventory`, `notes`, `ac`, `speed`, `initiativeBonus`, `passivePerception`, `proficiencyBonus`, `profBonus`, `abilityScoreImprovementsUsed`, `skills`
- Spellcasting: `spellSlots`, `spellsKnown`, `spellAttack`, `spellCD`
- Legacy fields: `spells`, `maxSpellSlots`, `sorceryPointsLegacy`, `maxSorceryPoints`
- Buffs: `buffs`, `debuffs`

#### Class-Specific Interfaces (12 total)
Created 12 class-specific interfaces that extend BasePlayableCharacter with class-specific resources:

1. **SorcererCharacter** - adds `sorceryPoints?: SorcererResources`
2. **PaladinCharacter** - adds `channelDivinityCharges?: PaladinResources`
3. **MonkCharacter** - adds `kiPoints?: MonkResources`
4. **BarbarianCharacter** - adds `rages?: BarbarianResources`
5. **BardCharacter** - adds `inspiration?: BardResources`
6. **DruidCharacter** - adds `wildShapeForm?: string`
7. **WarlockCharacter** - adds `invocationsKnown?: WarlockResources`
8. **RogueCharacter** - no class-specific resources
9. **FighterCharacter** - no class-specific resources
10. **RangerCharacter** - no class-specific resources
11. **ClericCharacter** - no class-specific resources
12. **WizardCharacter** - no class-specific resources

Each interface has a discriminated `classIndex` field with a literal string value (e.g., `"sorcerer"`).

#### PlayableCharacter Union Type
Updated `PlayableCharacter` to be a discriminated union of all 12 class-specific interfaces:
```typescript
export type PlayableCharacter =
  | SorcererCharacter
  | PaladinCharacter
  | MonkCharacter
  | BarbarianCharacter
  | BardCharacter
  | DruidCharacter
  | WarlockCharacter
  | RogueCharacter
  | FighterCharacter
  | RangerCharacter
  | ClericCharacter
  | WizardCharacter;
```

#### LegacyPlayableCharacter Interface
Created a legacy interface for backward compatibility with the old structure.

### 2. lib/schemas.ts

#### basePlayableCharacterSchema
Created base schema with all common fields corresponding to BasePlayableCharacter interface.

#### Class-Specific Schemas (12 total)
Created 12 class-specific schemas extending the base with z.literal discriminators:

1. `sorcererCharacterSchema` - extends base with `classIndex: z.literal("sorcerer")` and `sorceryPoints`
2. `paladinCharacterSchema` - extends base with `classIndex: z.literal("paladin")` and `channelDivinityCharges`
3. `monkCharacterSchema` - extends base with `classIndex: z.literal("monk")` and `kiPoints`
4. `barbarianCharacterSchema` - extends base with `classIndex: z.literal("barbarian")` and `rages`
5. `bardCharacterSchema` - extends base with `classIndex: z.literal("bard")` and `inspiration`
6. `druidCharacterSchema` - extends base with `classIndex: z.literal("druid")` and `wildShapeForm`
7. `warlockCharacterSchema` - extends base with `classIndex: z.literal("warlock")` and `invocationsKnown`
8. `rogueCharacterSchema` - extends base with `classIndex: z.literal("rogue")`
9. `fighterCharacterSchema` - extends base with `classIndex: z.literal("fighter")`
10. `rangerCharacterSchema` - extends base with `classIndex: z.literal("ranger")`
11. `clericCharacterSchema` - extends base with `classIndex: z.literal("cleric")`
12. `wizardCharacterSchema` - extends base with `classIndex: z.literal("wizard")`

#### playableCharacterSchema
Updated to be a discriminated union of all 12 class-specific schemas:
```typescript
export const playableCharacterSchema = z.discriminatedUnion("classIndex", [
  sorcererCharacterSchema,
  paladinCharacterSchema,
  monkCharacterSchema,
  barbarianCharacterSchema,
  bardCharacterSchema,
  druidCharacterSchema,
  warlockCharacterSchema,
  rogueCharacterSchema,
  fighterCharacterSchema,
  rangerCharacterSchema,
  clericCharacterSchema,
  wizardCharacterSchema,
]);
```

#### legacyPlayableCharacterSchema
Created legacy schema for backward compatibility.

#### PlayerFormData
Updated to infer from the new discriminated union schema.

### 3. lib/storage.ts

Updated the data migration code to handle the new structure:
- Changed `sorceryPoints` to `sorceryPointsLegacy` for migration
- Added `profBonus` field
- Changed type annotation from `PlayableCharacter` to `any` for migration flexibility

## TypeScript Errors (Expected)

The following TypeScript errors are **expected and intentional** as they represent components that need to be updated in later phases:

### Components with Errors
1. `app/campaign/[campaignId]/character/[playableCharacterId]/page.tsx`
   - Lines 174-241: Accessing class-specific properties without type guards

2. `components/player-class-resources-section.tsx`
   - Lines 67-90: Accessing class-specific properties without type guards

3. `components/player-sorcery-points-section.tsx`
   - Lines 22-42: Accessing `sorceryPoints` without type guards

### Error Pattern
All errors follow the same pattern:
```
Property 'sorceryPoints' does not exist on type 'PlayableCharacter'.
  Property 'sorceryPoints' does not exist on type 'PaladinCharacter'.
```

This is the expected behavior of the discriminated union type - TypeScript is correctly preventing direct access to class-specific properties that don't exist on all character types.

## Resolution Plan

These errors will be resolved in **Phase 3** when we implement:
1. Type guards for class-specific properties
2. Dynamic class resources component
3. Proper discriminated union handling in existing components

## Benefits of Phase 1

1. **Type Safety**: The new discriminated union ensures type safety at compile time
2. **Clear Structure**: Separation of common vs. class-specific features is explicit
3. **Maintainability**: Easy to add new class-specific resources without affecting other classes
4. **Backward Compatibility**: Legacy interfaces and schemas maintain compatibility with existing data
5. **Better Developer Experience**: TypeScript will guide developers to use the correct properties for each class type

## Next Steps

Proceed to **Phase 2: Core Functionality Implementation** which includes:
1. Fix HP roll calculation
2. Add AC auto-calculation
3. Fix initiative to use DEX modifier
4. Update combat stats labels
5. Add proficiency bonus display in skills section

Phase 3 will address the TypeScript errors by implementing proper type guards and class-specific resource management components.
