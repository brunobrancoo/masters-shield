# Coding Agent

Implements all code changes for the class-specific type system and form component separation project.

## Overview

The Coding Agent is responsible for executing the implementation plan outlined in `.opencode/plans/player-form-refactoring-implementation.md`. It works closely with the Testing Agent, which validates changes and provides feedback.

## Capabilities

- TypeScript interface refactoring
- Zod schema creation and updates
- React component creation and refactoring
- React Hook Form integration
- Data migration scripts
- Type-safe development

## Implementation Checklist

### Phase 1: Type Refactoring

#### 1.1 Extract Base Interface
**File**: `lib/interfaces/interfaces.ts`

**Steps**:
1. Create `BasePlayableCharacter` interface with all common fields
2. Remove class-specific resource fields from current `PlayableCharacter`
3. Keep legacy fields for backward compatibility during migration
4. Create `PlayableCharacter` as a union type of all class-specific interfaces

**Fields to extract to `BasePlayableCharacter`**:
- All identity fields (name, race, class, background, etc.)
- All feature fields (traits, proficiencies, etc.)
- All combat fields (hp, ac, attributes, etc.)
- All spellcasting fields (common to all spellcasters)
- All buff/debuff fields
- All legacy fields for migration

**Fields to remove** (will be in class-specific interfaces):
- `sorceryPoints`
- `kiPoints`
- `rages`
- `inspiration`
- `channelDivinityCharges`
- `invocationsKnown`
- `wildShapeForm`
- `featResources`

#### 1.2 Create Class-Specific Interfaces
**File**: `lib/interfaces/interfaces.ts`

**Create for each class**:

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

#### 1.3 Update Zod Schemas
**File**: `lib/schemas.ts`

**Create base schema**:
```typescript
export const basePlayableCharacterSchema = z.object({
  // All common fields from BasePlayableCharacter
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório"),
  // ... all other common fields
  buffs: z.array(buffSchema).default([]),
  debuffs: z.array(buffSchema).default([]),

  // Legacy fields
  profBonus: z.coerce.number().default(0),
  spells: z.array(z.any()).default([]),
});
```

**Create class-specific schemas** (one per class):
```typescript
export const sorcererCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("sorcerer"),
  sorceryPoints: sorcererResourcesSchema,
});

export const paladinCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("paladin"),
  channelDivinityCharges: paladinResourcesSchema,
});

// ... repeat for all classes
```

**Update main schema**:
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

#### 1.4 Verify TypeScript Compilation
**Command**: `npm run typecheck` (or equivalent)

**Expected**: No type errors

### Phase 2: Component Structure

#### 2.1 Extract Display-Only Components
**Create directory**: `components/class-display-sections/`

**Move components from** `player-form-class-resources-dynamic.tsx`:

For each display component:
1. Create separate file
2. Import `ClassSpecific` type from generated GraphQL
3. Accept feature data as prop
4. Return null if data is not present
5. Export component

**Components to extract**:
- `martial-arts-display.tsx`
- `sneak-attack-display.tsx`
- `unarmored-movement-display.tsx`
- `metamagic-known-display.tsx`
- `creating-spell-slots-display.tsx`
- `brutal-critical-display.tsx`
- `rage-damage-bonus-display.tsx`
- `bardic-inspiration-die-display.tsx`
- `song-of-rest-die-display.tsx`
- `magical-secrets-display.tsx`
- `aura-range-display.tsx`
- `destroy-undead-cr-display.tsx`
- `favored-enemies-display.tsx`
- `favored-terrain-display.tsx`
- `extra-attacks-display.tsx`
- `invocations-known-display.tsx`
- `mystic-arcanum-display.tsx`
- `action-surges-display.tsx`
- `indomitable-uses-display.tsx`
- `arcane-recovery-display.tsx`
- `wild-shape-display.tsx`

#### 2.2 Create Class Resource Form Components
**Create directory**: `components/class-resource-forms/`

**Create shared types file**: `components/class-resource-forms/types.ts`
```typescript
export interface BaseResourceFormProps {
  register: any;
  setValue: any;
  watch: any;
  classData?: any;
  level: number;
}

export type ClassSpecific = any; // Import from @/lib/generated/graphql
```

**Create form component for each class**:

**SorcererResourceForm** (`sorcerer-resource-form.tsx`):
- Import `SorceryPointsSection` from existing components
- Import display components from `class-display-sections`
- Get `levelData` from `classData.class.class_levels`
- Render `SorceryPointsSection` with editable sorcery points
- Render display components for metamagic, creating spell slots

**PaladinResourceForm** (`paladin-resource-form.tsx`):
- Import `ChannelDivinitySection` from existing components
- Import display components from `class-display-sections`
- Render `ChannelDivinitySection` at level 2+
- Render display components for aura, destroy undead

**MonkResourceForm** (`monk-resource-form.tsx`):
- Import `KiPointsSection` from existing components
- Import display components from `class-display-sections`
- Render `KiPointsSection` with editable ki points
- Render display components for martial arts, unarmored movement

**BarbarianResourceForm** (`barbarian-resource-form.tsx`):
- Import `RageSection` from existing components
- Import display components from `class-display-sections`
- Render `RageSection` with editable rages
- Render display components for rage damage, brutal critical, unarmored movement

**BardResourceForm** (`bard-resource-form.tsx`):
- Import `InspirationSection` from existing components
- Import display components from `class-display-sections`
- Render `InspirationSection` with editable inspiration
- Render display components for inspiration die, song of rest, magical secrets

**DruidResourceForm** (`druid-resource-form.tsx`):
- Import display components from `class-display-sections`
- Import `DruidWildShapeSelector` from existing components
- Render display component for wild shape stats
- Render `DruidWildShapeSelector` for form selection

**WarlockResourceForm** (`warlock-resource-form.tsx`):
- Import display components from `class-display-sections`
- Render editable input for invocations known
- Render display component for mystic arcanum

**RogueResourceForm** (`rogue-resource-form.tsx`):
- Import display components from `class-display-sections`
- Render display component for sneak attack

**FighterResourceForm** (`fighter-resource-form.tsx`):
- Import display components from `class-display-sections`
- Render display components for action surges, extra attacks, indomitable

**RangerResourceForm** (`ranger-resource-form.tsx`):
- Import display components from `class-display-sections`
- Render display components for favored enemies, favored terrain, extra attacks

**ClericResourceForm** (`cleric-resource-form.tsx`):
- Import display components from `class-display-sections`
- Render display components for channel divinity, destroy undead

**WizardResourceForm** (`wizard-resource-form.tsx`):
- Import display components from `class-display-sections`
- Render display component for arcane recovery

#### 2.3 Create ClassResourceFormSection
**File**: `components/class-resource-form-section.tsx`

**Steps**:
1. Import all class resource form components
2. Create mapping object: `CLASS_FORM_MAP`
3. Create `ClassResourceFormSection` component
4. Accept `classIndex` prop along with other form props
5. Look up form component in map
6. Render form component with all props
7. Return null if class not found

#### 2.4 Update PlayerForm
**File**: `components/player-form.tsx`

**Steps**:
1. Remove import of `PlayerFormClassResourcesDynamic`
2. Add import of `ClassResourceFormSection`
3. In JSX, replace `PlayerFormClassResourcesDynamic` with `ClassResourceFormSection`
4. Remove class-specific resource fields from default values:
   - `sorceryPoints`
   - `kiPoints`
   - `rages`
   - `inspiration`
   - `channelDivinityCharges`
   - `invocationsKnown`
   - `wildShapeForm`
   - `featResources`

**Keep**:
- Legacy fields for backward compatibility
- All common fields
- All form sections except class resources

### Phase 3: Data Migration

#### 3.1 Create Migration Script
**File**: `scripts/migrate-character-data.ts`

**Steps**:
1. Import `fs` and `path` modules
2. Define `OldPlayableCharacter` interface (current structure)
3. Create `migrateCharacter` function:
   - Extract `classIndex`
   - Switch on `classIndex`
   - Map to new character type with appropriate resources
   - Return migrated character
4. Read data file
5. Map all characters through `migrateCharacter`
6. Write migrated data to file
7. Log success message

#### 3.2 Add Migration Script to package.json
**File**: `package.json`

**Add to scripts**:
```json
{
  "scripts": {
    "migrate-characters": "ts-node scripts/migrate-character-data.ts"
  }
}
```

**Install ts-node** (if not already installed):
```bash
npm install --save-dev ts-node
```

#### 3.3 Run Migration Script
**Command**: `npm run migrate-characters`

**Expected**: Migration completes successfully with no errors

#### 3.4 Update Storage/API Calls
**Files**: Any file that reads/writes `PlayableCharacter`

**Steps**:
1. Search for usage of `PlayableCharacter` type
2. Ensure all code handles the new discriminated union type
3. Add type guards if needed (for runtime type narrowing)

**Type guards** (create if needed):
```typescript
function isSorcererCharacter(character: PlayableCharacter): character is SorcererCharacter {
  return character.classIndex === "sorcerer";
}

// ... etc for all classes
```

### Phase 4: Testing & Validation

#### 4.1 TypeScript Compilation
**Command**: `npm run typecheck`

**Expected**: No type errors

#### 4.2 Build Verification
**Command**: `npm run build`

**Expected**: Build completes successfully

#### 4.3 Lint Verification
**Command**: `npm run lint` (if available)

**Expected**: No linting errors

#### 4.4 Manual Testing
**Steps**:
1. Start development server
2. Create character for each class
3. Verify class-specific form renders
4. Edit resources
5. Save character
6. Reload and verify data persists

## Code Conventions

1. **TypeScript**: Always use proper types, avoid `any` when possible
2. **React Hooks**: Use `useEffect` for side effects, `useMemo` for expensive calculations
3. **React Hook Form**: Use `register`, `setValue`, `watch` for form state
4. **Styling**: Follow existing patterns (Tailwind CSS, consistent color scheme)
5. **Icons**: Use `lucide-react` icons matching feature
6. **Language**: All UI text in Portuguese
7. **Component Organization**: Group related components in directories
8. **Exports**: Use named exports for components, default for main components

## Reference Data

Use existing components and patterns:
- `player-form-class-resources-dynamic.tsx` for display component structure
- `class-resource-sections.tsx` for point pool components
- `druid-wild-shape-selector.tsx` for form selection pattern

## Collaboration

After implementing each phase:
1. Run type checking and fix any errors
2. Notify Testing Agent to verify changes
3. Wait for test results and feedback
4. Fix any issues reported
5. Proceed to next phase only after sign-off

## Success Metrics

- All phases implemented as specified
- TypeScript compilation succeeds
- No runtime errors in console
- All class resource forms render correctly
- Data migration completes successfully
- All existing characters can be loaded and edited

## Troubleshooting

### Type Errors
- If TypeScript complains about missing fields, check if they're in base interface
- If complaining about optional fields, verify they're in correct class-specific interface
- Use `any` as temporary workaround, fix properly

### Component Import Errors
- Check file paths are correct
- Verify exports match imports
- Ensure all dependencies are imported

### Migration Script Errors
- Check data file path is correct
- Verify JSON structure matches `OldPlayableCharacter`
- Check file permissions

## Notes

- Use `classIndex` (lowercase class name) to determine character type
- Display-only features are derived from `class_specific` API data, not stored
- Breaking change with migration - acceptable for this refactoring
- No discriminated union initially (add later if needed for runtime type narrowing)
- Legacy fields kept for backward compatibility during migration phase
- Delete `player-form-class-resources-dynamic.tsx` after migration is verified working
