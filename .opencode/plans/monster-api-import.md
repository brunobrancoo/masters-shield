# Plan: Implement Monster Import from D&D API

## Overview
Implement the ability for masters to search, preview, and add monsters from the D&D 5e API to their campaign's database.

## Current State
- `MonsterApiImportDialog` component exists but has issues:
  - Uses `onSelectMonster` callback which only displays, doesn't save
  - Incomplete mapper that only maps basic fields
- Monster schema requires many fields that aren't being mapped

## Implementation Plan

### 1. Fix the Mapper Function (`lib/api/mappers.ts`)

**Current Issues:**
- Returns `Partial<Monster>` but should return complete `Monster`
- Maps to non-existent fields: `level`, `attributes`, `skills`, `notes`
- Monster schema has direct attributes (e.g., `str`), not `attributes.str`

**Changes needed:**
- Update `mapGraphQLMonsterToMonster` to return complete `Monster` object
- Map ALL required fields from GraphQL response:
  - Identity: `index`, `name`, `type`, `subtype`, `size`, `alignment`, `languages`
  - Challenge: `challenge_rating` (NOT `level`), `xp`
  - Attributes: Direct fields `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma` (NOT in `attributes` object)
  - HP: `hp`, `maxHp`, `tempHp` (default 0), `hit_dice`, `hit_points_roll` (default to `hit_dice`)
  - Armor Class: `armor_class` (convert polymorphic types)
  - Speed & Senses: `speed`, `senses`
  - Proficiencies: `proficiencies`
  - Immunities/Resistances/Vulnerabilities: All damage arrays and condition_immunities
  - Actions: `actions`, `reactions`, `special_abilities`, `legendary_actions` (default empty array)
  - State fields: `status: "alive"` (default), `conditions: []`, `modifiers: []`, `isHomebrew: false`

**Helper functions to add:**
- `mapArmorClass()` - Convert API armor class types to schema format
- `mapActions()` - Map actions with damage and options
- `mapReactions()` - Map reactions with DC
- `mapSpecialAbilities()` - Map special abilities with usage
- Keep `mapMonsterSize()` (need to add - maps API size values: "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan")
- Remove `formatMonsterNotes()` (not used in monster schema)
- Remove references to `level`, `attributes`, `skills`, `notes`

### 2. Update MonsterApiImportDialog (`components/monster-api-import.tsx`)

**Add:**
- State for import confirmation modal
- After clicking "Importar" button:
  1. Fetch full monster details
  2. Show confirmation modal with two options:
     - "Salvar diretamente" - Save to database immediately
     - "Editar antes de salvar" - Open MonsterForm with pre-filled data

**Changes:**
- Add state: `const [pendingMonster, setPendingMonster] = useState<Monster | null>(null)`
- Add state: `const [showConfirmDialog, setShowConfirmDialog] = useState(false)`
- Update `handleImport` to not call `onImport` immediately, but show confirm dialog
- Add confirmation dialog with two buttons
- Update `onImport` prop to accept `{ monster, mode }` where mode is "save" or "edit"

### 3. Update MonsterList (`components/monster-list.tsx`)

**Current Issues:**
- References `monster.level` (should be `monster.challenge_rating`)
- References `monster.skills` (not in schema)

**Changes:**
- Fix references to non-existent fields:
  - `monster.level` → `monster.challenge_rating`
  - Remove `monster.skills` references (or replace with something else from the schema like `monster.actions` or `monster.special_abilities`)
- Update `MonsterApiImportDialog` usage to handle new callback signature
- Add handler function that:
  - For "save" mode: Call `handleSaveMonster` from game context
  - For "edit" mode: Call `setMonsterViewState("form")` and set the monster
- Pass campaignId if needed (should be available via useCampaign)

### 4. Update MasterView (`components/views/master-view.tsx`)

**Changes:**
- Ensure `handleSaveMonster` is available to MonsterList
- May need to pass it down or access via useGame
- Handle the edit mode flow properly

### 4. Update MonsterForm (`components/monster-form.tsx`)

**Current Issues:**
- References `monster.level` (should be `monster.challenge_rating`)
- References `monster.attributes` (should use direct fields: `monster.strength`, etc.)
- References `monster.skills` (not in schema)
- References `monster.notes` (not in schema)

**Changes:**
- Fix all references to non-existent fields to match monster schema
- Update form fields to use `challenge_rating` instead of `level`
- Update form fields to use direct attributes (`strength`, `dexterity`, etc.) instead of `attributes.str`
- Remove or replace `skills` and `notes` fields with appropriate schema fields

### 5. Update Game Context (`app/_contexts/game-context.tsx`)

**Current Issues:**
- LSP error on line 152: `Argument of type 'string | undefined' is not assignable to parameter of type 'string'`

**Changes:**
- Add null checks for `selectedMonster.id` before passing to `updateMonster`
- Ensure `monster.id` exists before calling `updateMonster`

**No changes needed for `handleSaveMonster`** - it already handles creating monsters correctly:
```typescript
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
```

## Data Flow

1. User opens Monsters tab and clicks "Importar da API"
2. User searches for monsters, sees list from API
3. User clicks "Importar" on a monster
4. System fetches full monster details and shows confirmation modal:
   - "Salvar diretamente" → Save to DB via `handleSaveMonster`
   - "Editar antes de salvar" → Open MonsterForm with pre-filled data
5. Monster is saved to `campaigns/{campaignId}/monsters/` collection
6. Real-time listener updates the UI with new monster

## Key Decisions

- **Monster ID**: Use `crypto.randomUUID()` for `id` field (Firestore doc ID)
- **Monster Index**: Use API's `index` field (e.g., "goblin", "adult-red-dragon") as the `index` field
- **Data Mapping**: Map ALL available fields from API to schema
- **User Flow**: Always show confirmation dialog to give user choice

## Files to Modify

1. `lib/api/mappers.ts` - Complete the mapper function
2. `components/monster-api-import.tsx` - Add confirmation dialog
3. `components/monster-list.tsx` - Handle import callbacks, fix field references
4. `components/monster-form.tsx` - Fix field references to match schema
5. `app/_contexts/game-context.tsx` - Fix LSP error with undefined id
6. `components/views/master-view.tsx` - Potentially update flow

## Testing Checklist

### Existing Issues to Fix
- [ ] Fix LSP errors in monster-form.tsx (level, attributes, skills, notes references)
- [ ] Fix LSP errors in monster-list.tsx (level, skills references)
- [ ] Fix LSP errors in master-view.tsx (undefined id)
- [ ] Fix LSP errors in game-context.tsx (undefined id)
- [ ] Fix LSP errors in mappers.ts (level reference)

### New Functionality
- [ ] Mapper correctly maps all required fields
- [ ] Confirmation modal appears with both options
- [ ] "Save directly" saves monster to database
- [ ] Monster appears in list after save
- [ ] "Edit first" opens MonsterForm with pre-filled data
- [ ] Monster can be edited and saved from form
- [ ] All monster data persists correctly
- [ ] Error handling for API failures
