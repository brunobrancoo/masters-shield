# D&D Character Form Refactoring - Implementation Plan

## Overview

Refactor the player form to use type-safe class-specific interfaces with dedicated form components, eliminating the complex dynamic rendering approach.

## Problem Statement

- `PlayerFormClassResourcesDynamic` is 626+ lines of complex conditional rendering
- `PlayableCharacter` has optional fields for all class resources mixed together
- Poor type safety (many `undefined` fields per character)
- Difficult to test class-specific features in isolation
- Hard to maintain and extend with new classes

## Solution Architecture

```
BasePlayableCharacter (common fields)
├── SorcererCharacter (sorceryPoints: SorcererResources)
├── PaladinCharacter (channelDivinityCharges: PaladinResources)
├── MonkCharacter (kiPoints: MonkResources)
├── BarbarianCharacter (rages: BarbarianResources)
├── BardCharacter (inspiration: BardResources)
├── DruidCharacter (wildShapeForm?: string)
├── WarlockCharacter (invocationsKnown: number)
├── RogueCharacter (no resources)
├── FighterCharacter (no resources)
├── RangerCharacter (no resources)
├── ClericCharacter (no resources)
└── WizardCharacter (no resources)
```

## Phase 1: Type Refactoring

### 1.1 Extract Base Interface

**File**: `lib/interfaces/interfaces.ts`

Create `BasePlayableCharacter` with all common fields from `PlayableCharacter`:

```typescript
export interface BasePlayableCharacter {
  id: string;
  name: string;

  // Identity
  raceIndex: string;
  raceName: string;
  raceData?: Race;

  classIndex: string;
  className: string;
  classData?: Class;
  level: number;
  levelData?: Level;

  subclassIndex?: string;
  subclassName?: string;

  backgroundIndex?: string;
  backgroundName?: string;
  backgroundData?: Background;

  // Features
  raceTraits: string[];
  backgroundFeature?: string;
  classFeatures: string[];
  customFeatures: Feature[];
  featFeatures: Feature[];

  selectedProficiencies: string[];
  raceProficiencies: string[];
  backgroundProficiencies: string[];
  classProficiencies: string[];

  classEquipment: ClassEquipmentSelection[];
  backgroundEquipment: EquipmentSelection[];

  // Combat
  hp: number;
  maxHp: number;
  attributes: Attributes;
  inventory: Item[];
  notes: string;
  ac: number;
  speed: number;
  initiativeBonus: number;
  passivePerception: number;
  proficiencyBonus: number;
  profBonus?: number;
  abilityScoreImprovementsUsed?: number;
  skills?: string[];

  // Spellcasting (common to all spellcasters)
  spellSlots?: SpellSlots;
  spellsKnown?: string[];
  spellAttack?: number;
  spellCD?: number;

  // Buffs/Debuffs
  buffs: Buff[];
  debuffs: Buff[];
}
```

**Remove from `PlayableCharacter`**: All class-specific resource fields (`sorceryPoints`, `kiPoints`, `rages`, `inspiration`, `channelDivinityCharges`, `invocationsKnown`, `wildShapeForm`, `featResources`)

**Keep**: Legacy fields for backward compatibility during migration (`spells`, `maxSpellSlots`, `sorceryPointsLegacy`, `maxSorceryPoints`)

### 1.2 Create Class-Specific Interfaces

**File**: `lib/interfaces/interfaces.ts`

Create interfaces for each class:

```typescript
export interface SorcererCharacter extends BasePlayableCharacter {
  classIndex: "sorcerer";
  sorceryPoints: SorcererResources;
}

export interface PaladinCharacter extends BasePlayableCharacter {
  classIndex: "paladin";
  channelDivinityCharges: PaladinResources;
}

export interface MonkCharacter extends BasePlayableCharacter {
  classIndex: "monk";
  kiPoints: MonkResources;
}

export interface BarbarianCharacter extends BasePlayableCharacter {
  classIndex: "barbarian";
  rages: BarbarianResources;
}

export interface BardCharacter extends BasePlayableCharacter {
  classIndex: "bard";
  inspiration: BardResources;
}

export interface DruidCharacter extends BasePlayableCharacter {
  classIndex: "druid";
  wildShapeForm?: string;
}

export interface WarlockCharacter extends BasePlayableCharacter {
  classIndex: "warlock";
  invocationsKnown: number;
}

export interface RogueCharacter extends BasePlayableCharacter {
  classIndex: "rogue";
}

export interface FighterCharacter extends BasePlayableCharacter {
  classIndex: "fighter";
}

export interface RangerCharacter extends BasePlayableCharacter {
  classIndex: "ranger";
}

export interface ClericCharacter extends BasePlayableCharacter {
  classIndex: "cleric";
}

export interface WizardCharacter extends BasePlayableCharacter {
  classIndex: "wizard";
}
```

**Update `PlayableCharacter` type**:

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

### 1.3 Update Zod Schemas

**File**: `lib/schemas.ts`

Create base schema:

```typescript
export const basePlayableCharacterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório"),

  raceIndex: z.string().min(1, "Raça obrigatória"),
  raceName: z.string().min(1),

  classIndex: z.string().min(1, "Classe obrigatória"),
  className: z.string().min(1),
  level: z.coerce.number().min(1).max(20),

  subclassIndex: z.string().optional(),
  subclassName: z.string().optional(),

  backgroundIndex: z.string().optional(),
  backgroundName: z.string().optional(),

  raceTraits: z.array(z.string()).default([]),
  backgroundFeature: z.string().optional(),
  classFeatures: z.array(z.string()).default([]),
  customFeatures: z.array(featureSchema).default([]),
  featFeatures: z.array(featureSchema).default([]),

  selectedProficiencies: z.array(z.string()).default([]),
  raceProficiencies: z.array(z.string()).default([]),
  backgroundProficiencies: z.array(z.string()).default([]),
  classProficiencies: z.array(z.string()).default([]),

  classEquipment: z.array(classEquipmentSelectionSchema).default([]),
  backgroundEquipment: z.array(equipmentSelectionSchema).default([]),

  hp: z.coerce.number().min(1),
  maxHp: z.coerce.number().min(1),
  attributes: attributesSchema,
  inventory: z.array(itemSchema).default([]),
  notes: z.string().default(""),
  ac: z.coerce.number().min(1),
  speed: z.coerce.number().min(0),
  initiativeBonus: z.coerce.number().default(0),
  passivePerception: z.coerce.number().default(10),
  proficiencyBonus: z.coerce.number().min(2).max(6),
  abilityScoreImprovementsUsed: z.coerce.number().min(0).default(0),

  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]),
  spellAttack: z.coerce.number().default(0),
  spellCD: z.coerce.number().default(0),

  buffs: z.array(buffSchema).default([]),
  debuffs: z.array(buffSchema).default([]),

  // Legacy fields
  profBonus: z.coerce.number().default(0),
  spells: z.array(z.any()).default([]),
});
```

Create class-specific schemas:

```typescript
export const sorcererCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("sorcerer"),
  sorceryPoints: sorcererResourcesSchema,
});

export const paladinCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("paladin"),
  channelDivinityCharges: paladinResourcesSchema,
});

export const monkCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("monk"),
  kiPoints: monkResourcesSchema,
});

export const barbarianCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("barbarian"),
  rages: barbarianResourcesSchema,
});

export const bardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("bard"),
  inspiration: bardResourcesSchema,
});

export const druidCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("druid"),
  wildShapeForm: z.string().optional(),
});

export const warlockCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("warlock"),
  invocationsKnown: z.coerce.number().min(0),
});

export const rogueCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("rogue"),
});

export const fighterCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("fighter"),
});

export const rangerCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("ranger"),
});

export const clericCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("cleric"),
});

export const wizardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("wizard"),
});
```

Update main schema (for now, use union without discriminator):

```typescript
export const playableCharacterSchema = z.union([
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

**Update `PlayerFormData` type**:

```typescript
export type PlayerFormData = z.infer<typeof playableCharacterSchema>;
```

### 1.4 Verify TypeScript Compilation

Run `npm run typecheck` (or equivalent) to verify no type errors.

## Phase 2: Component Structure

### 2.1 Extract Display-Only Components

**Create directory**: `components/class-display-sections/`

Move display-only components from `player-form-class-resources-dynamic.tsx`:

```
components/class-display-sections/
├── martial-arts-display.tsx
├── sneak-attack-display.tsx
├── unarmored-movement-display.tsx
├── metamagic-known-display.tsx
├── creating-spell-slots-display.tsx
├── brutal-critical-display.tsx
├── rage-damage-bonus-display.tsx
├── bardic-inspiration-die-display.tsx
├── song-of-rest-die-display.tsx
├── magical-secrets-display.tsx
├── aura-range-display.tsx
├── destroy-undead-cr-display.tsx
├── favored-enemies-display.tsx
├── favored-terrain-display.tsx
├── extra-attacks-display.tsx
├── invocations-known-display.tsx
├── mystic-arcanum-display.tsx
├── action-surges-display.tsx
├── indomitable-uses-display.tsx
├── arcane-recovery-display.tsx
└── wild-shape-display.tsx
```

Each component:
- Receives `classSpecific` data as prop
- Displays read-only UI card
- Returns null if data is not present

**Example**: `components/class-display-sections/martial-arts-display.tsx`

```tsx
"use client";

import { Zap } from "lucide-react";
import { ClassSpecific } from "@/lib/generated/graphql";

interface Props {
  martialArts?: ClassSpecific["martial_arts"];
}

export default function MartialArtsDisplay({ martialArts }: Props) {
  if (!martialArts) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <Zap className="w-5 h-5 text-nature-400" />
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Artes Marciais</p>
        <p className="text-sm font-semibold text-text-primary">
          {martialArts.dice_count}d{martialArts.dice_value}
        </p>
      </div>
    </div>
  );
}
```

### 2.2 Create Class Resource Form Components

**Create directory**: `components/class-resource-forms/`

Create components for each class:

```
components/class-resource-forms/
├── sorcerer-resource-form.tsx
├── paladin-resource-form.tsx
├── monk-resource-form.tsx
├── barbarian-resource-form.tsx
├── bard-resource-form.tsx
├── druid-resource-form.tsx
├── warlock-resource-form.tsx
├── rogue-resource-form.tsx
├── fighter-resource-form.tsx
├── ranger-resource-form.tsx
├── cleric-resource-form.tsx
└── wizard-resource-form.tsx
```

**Common Props Interface**:

```tsx
interface BaseResourceFormProps {
  register: any;
  setValue: any;
  watch: any;
  classData?: any;
  level: number;
}
```

#### SorcererResourceForm

```tsx
"use client";

import BaseResourceFormProps, { ClassSpecific } from "@/types";
import { SorceryPointsSection } from "./class-resource-sections";
import { MetamagicKnownDisplay, CreatingSpellSlotsDisplay } from "../class-display-sections";

export default function SorcererResourceForm({
  register,
  setValue,
  watch,
  classData,
  level,
}: BaseResourceFormProps) {
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === level);
  const classSpecific = levelData?.class_specific as ClassSpecific;

  const sorceryPoints = watch("sorceryPoints");

  return (
    <div className="space-y-4">
      <SorceryPointsSection
        sorceryPoints={sorceryPoints}
        onChange={(value) => setValue("sorceryPoints", value)}
      />

      {classSpecific?.metamagic_known && (
        <MetamagicKnownDisplay metamagicKnown={classSpecific.metamagic_known} />
      )}

      {classSpecific?.creating_spell_slots && (
        <CreatingSpellSlotsDisplay creatingSpellSlots={classSpecific.creating_spell_slots} />
      )}
    </div>
  );
}
```

#### PaladinResourceForm

```tsx
"use client";

import BaseResourceFormProps, { ClassSpecific } from "@/types";
import { ChannelDivinitySection } from "./class-resource-sections";
import { AuraRangeDisplay, DestroyUndeadCRDisplay } from "../class-display-sections";

export default function PaladinResourceForm({
  register,
  setValue,
  watch,
  classData,
  level,
}: BaseResourceFormProps) {
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === level);
  const classSpecific = levelData?.class_specific as ClassSpecific;

  const channelDivinityCharges = watch("channelDivinityCharges");

  return (
    <div className="space-y-4">
      {level >= 2 && classSpecific?.channel_divinity_charges && (
        <ChannelDivinitySection
          channelDivinityCharges={channelDivinityCharges}
          onChange={(value) => setValue("channelDivinityCharges", value)}
        />
      )}

      {classSpecific?.aura_range && (
        <AuraRangeDisplay auraRange={classSpecific.aura_range} />
      )}

      {classSpecific?.destroy_undead_cr && (
        <DestroyUndeadCRDisplay destroyUndeadCR={classSpecific.destroy_undead_cr} />
      )}
    </div>
  );
}
```

#### Classes with Display-Only Features (Rogue, Fighter, Ranger, Cleric, Wizard)

```tsx
// Example: RogueResourceForm
"use client";

import BaseResourceFormProps, { ClassSpecific } from "@/types";
import { SneakAttackDisplay } from "../class-display-sections";

export default function RogueResourceForm({
  classData,
  level,
}: BaseResourceFormProps) {
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === level);
  const classSpecific = levelData?.class_specific as ClassSpecific;

  if (!classSpecific?.sneak_attack) return null;

  return (
    <div className="space-y-4">
      <SneakAttackDisplay sneakAttack={classSpecific.sneak_attack} />
    </div>
  );
}
```

#### DruidResourceForm (with wildShapeForm selector)

```tsx
"use client";

import BaseResourceFormProps, { ClassSpecific } from "@/types";
import { WildShapeDisplay } from "../class-display-sections";
import DruidWildShapeSelector from "../druid-wild-shape-selector";

export default function DruidResourceForm({
  register,
  watch,
  setValue,
  classData,
  level,
}: BaseResourceFormProps) {
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === level);
  const classSpecific = levelData?.class_specific as ClassSpecific;

  if (!classSpecific?.wild_shape_max_cr) return null;

  return (
    <div className="space-y-4">
      <WildShapeDisplay
        wildShapeMaxCR={classSpecific.wild_shape_max_cr}
        wildShapeFly={classSpecific.wild_shape_fly}
        wildShapeSwim={classSpecific.wild_shape_swim}
      />

      <DruidWildShapeSelector
        register={register}
        watch={watch}
        setValue={setValue}
        wildShapeMaxCR={classSpecific.wild_shape_max_cr ?? undefined}
        canFly={classSpecific.wild_shape_fly || false}
        canSwim={classSpecific.wild_shape_swim || false}
      />
    </div>
  );
}
```

### 2.3 Create ClassResourceFormSection

**File**: `components/class-resource-form-section.tsx`

```tsx
"use client";

import { Zap } from "lucide-react";
import BaseResourceFormProps from "@/types";
import SorcererResourceForm from "./class-resource-forms/sorcerer-resource-form";
import PaladinResourceForm from "./class-resource-forms/paladin-resource-form";
import MonkResourceForm from "./class-resource-forms/monk-resource-form";
import BarbarianResourceForm from "./class-resource-forms/barbarian-resource-form";
import BardResourceForm from "./class-resource-forms/bard-resource-form";
import DruidResourceForm from "./class-resource-forms/druid-resource-form";
import WarlockResourceForm from "./class-resource-forms/warlock-resource-form";
import RogueResourceForm from "./class-resource-forms/rogue-resource-form";
import FighterResourceForm from "./class-resource-forms/fighter-resource-form";
import RangerResourceForm from "./class-resource-forms/ranger-resource-form";
import ClericResourceForm from "./class-resource-forms/cleric-resource-form";
import WizardResourceForm from "./class-resource-forms/wizard-resource-form";

interface Props extends BaseResourceFormProps {
  classIndex: string;
}

const CLASS_FORM_MAP: Record<string, React.ComponentType<BaseResourceFormProps>> = {
  sorcerer: SorcererResourceForm,
  paladin: PaladinResourceForm,
  monk: MonkResourceForm,
  barbarian: BarbarianResourceForm,
  bard: BardResourceForm,
  druid: DruidResourceForm,
  warlock: WarlockResourceForm,
  rogue: RogueResourceForm,
  fighter: FighterResourceForm,
  ranger: RangerResourceForm,
  cleric: ClericResourceForm,
  wizard: WizardResourceForm,
};

export default function ClassResourceFormSection({
  classIndex,
  register,
  setValue,
  watch,
  classData,
  level,
}: Props) {
  const FormComponent = CLASS_FORM_MAP[classIndex];

  if (!FormComponent) {
    return null;
  }

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <h3 className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-arcane-400" />
        Recursos da Classe
      </h3>

      <FormComponent
        register={register}
        setValue={setValue}
        watch={watch}
        classData={classData}
        level={level}
      />
    </div>
  );
}
```

### 2.4 Update PlayerForm

**File**: `components/player-form.tsx`

**Remove**:
- `PlayerFormClassResourcesDynamic` import
- Rendering of `PlayerFormClassResourcesDynamic`

**Add**:
- `ClassResourceFormSection` import
- Rendering of `ClassResourceFormSection`

```tsx
// Remove this import:
import PlayerFormClassResourcesDynamic from "./player-form-class-resources-dynamic";

// Add this import:
import ClassResourceFormSection from "./class-resource-form-section";

// Replace this in the JSX:
<PlayerFormClassResourcesDynamic
  classIndex={watch("classIndex")}
  classData={classData}
  level={watch("level") || 1}
  watch={watch}
  setValue={setValue}
  register={register}
/>

// With this:
<ClassResourceFormSection
  classIndex={watch("classIndex")}
  classData={classData}
  level={watch("level") || 1}
  watch={watch}
  setValue={setValue}
  register={register}
/>
```

**Remove** from default values:
- All class-specific resource fields (`sorceryPoints`, `kiPoints`, `rages`, `inspiration`, `channelDivinityCharges`, `invocationsKnown`, `wildShapeForm`, `featResources`)

These should be added dynamically based on the selected class.

### 2.5 Create Shared Type File

**File**: `components/class-resource-forms/types.ts`

```tsx
export interface BaseResourceFormProps {
  register: any;
  setValue: any;
  watch: any;
  classData?: any;
  level: number;
}

export type ClassSpecific = any; // Import from @/lib/generated/graphql
```

## Phase 3: Data Migration

### 3.1 Create Migration Script

**File**: `scripts/migrate-character-data.ts`

```typescript
import fs from 'fs';
import path from 'path';

interface OldPlayableCharacter {
  id: string;
  classIndex: string;
  sorceryPoints?: any;
  kiPoints?: any;
  rages?: any;
  inspiration?: any;
  channelDivinityCharges?: any;
  invocationsKnown?: number;
  wildShapeForm?: string;
  // ... other fields
}

function migrateCharacter(oldCharacter: OldPlayableCharacter): any {
  const { classIndex, ...rest } = oldCharacter;

  // Map classIndex to character type and add appropriate resources
  switch (classIndex) {
    case "sorcerer":
      return {
        ...rest,
        classIndex: "sorcerer",
        sorceryPoints: oldCharacter.sorceryPoints || undefined,
      };

    case "paladin":
      return {
        ...rest,
        classIndex: "paladin",
        channelDivinityCharges: oldCharacter.channelDivinityCharges || undefined,
      };

    case "monk":
      return {
        ...rest,
        classIndex: "monk",
        kiPoints: oldCharacter.kiPoints || undefined,
      };

    case "barbarian":
      return {
        ...rest,
        classIndex: "barbarian",
        rages: oldCharacter.rages || undefined,
      };

    case "bard":
      return {
        ...rest,
        classIndex: "bard",
        inspiration: oldCharacter.inspiration || undefined,
      };

    case "druid":
      return {
        ...rest,
        classIndex: "druid",
        wildShapeForm: oldCharacter.wildShapeForm,
      };

    case "warlock":
      return {
        ...rest,
        classIndex: "warlock",
        invocationsKnown: oldCharacter.invocationsKnown || 0,
      };

    case "rogue":
    case "fighter":
    case "ranger":
    case "cleric":
    case "wizard":
    default:
      return {
        ...rest,
        classIndex,
      };
  }
}

// Read data file
const dataPath = path.join(process.cwd(), 'data/characters.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Migrate all characters
const migratedData = data.characters.map((character: OldPlayableCharacter) =>
  migrateCharacter(character)
);

// Write migrated data
fs.writeFileSync(dataPath, JSON.stringify({ characters: migratedData }, null, 2));

console.log(`Migrated ${migratedData.length} characters successfully.`);
```

### 3.2 Run Migration Script

```bash
npm run migrate-characters
```

Add to `package.json`:

```json
{
  "scripts": {
    "migrate-characters": "ts-node scripts/migrate-character-data.ts"
  }
}
```

### 3.3 Update Storage/API Calls

Ensure all code that reads/writes `PlayableCharacter` uses the new discriminated union type.

**Type guards** (if needed for runtime):

```typescript
function isSorcererCharacter(character: PlayableCharacter): character is SorcererCharacter {
  return character.classIndex === "sorcerer";
}

function isPaladinCharacter(character: PlayableCharacter): character is PaladinCharacter {
  return character.classIndex === "paladin";
}

// ... etc for all classes
```

## Phase 4: Testing & Validation

### 4.1 TypeScript Compilation

```bash
npm run typecheck
```

### 4.2 Unit Tests (if applicable)

Test each component in isolation.

### 4.3 Integration Tests

- Create characters for each class
- Verify forms render correctly
- Verify form submission works
- Verify data persistence

### 4.4 Manual Testing Checklist

- [ ] Sorcerer: sorcery points edit, display metamagic/creating slots
- [ ] Paladin: channel divinity edit, display aura/destroy undead
- [ ] Monk: ki points edit, display martial arts/unarmored movement
- [ ] Barbarian: rages edit, display rage damage/brutal critical
- [ ] Bard: inspiration edit, display inspiration die/song of rest/magical secrets
- [ ] Druid: wild shape form edit, display wild shape stats
- [ ] Warlock: invocations known edit, display mystic arcanum
- [ ] Rogue: display sneak attack
- [ ] Fighter: display action surges/extra attacks/indomitable
- [ ] Ranger: display favored enemies/terrain/extra attacks
- [ ] Cleric: display channel divinity/destroy undead
- [ ] Wizard: display arcane recovery

### 4.5 Fix Issues

Address any bugs or type errors found during testing.

## Success Criteria

- [ ] All class-specific interfaces compile without errors
- [ ] Each class has its own dedicated resource form
- [ ] Form state persists correctly for all classes
- [ ] Data migration preserves all existing data
- [ ] No type errors after refactoring
- [ ] Build completes successfully
- [ ] All tests pass
- [ ] Manual testing checklist completed

## Notes

- Use `classIndex` string (lowercase class name) to determine character type
- Display-only features are derived from `class_specific` API data
- Breaking change with migration - acceptable for this refactoring
- No discriminated union initially (add later if needed)
- Legacy fields kept for backward compatibility during migration phase
