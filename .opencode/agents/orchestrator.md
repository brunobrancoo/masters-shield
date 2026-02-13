# Master's Shield - D&D Character Form Refactoring

**Orchestrator Agent**
Coordinates implementation of class-specific type system and form component separation.

## Project Overview

Refactor the player form to use type-safe class-specific interfaces with dedicated form components, eliminating the complex dynamic rendering approach and improving maintainability.

## Problem Statement

The current `PlayerFormClassResourcesDynamic` component has become overly complex (626+ lines) with extensive conditional rendering. The `PlayableCharacter` interface has optional fields for all class resources (`sorceryPoints`, `kiPoints`, `rages`, etc.) mixed together, leading to:
- Poor type safety (many `undefined` fields per character)
- Difficult to test class-specific features in isolation
- Hard to maintain and extend with new classes
- Complex form rendering logic

## Solution

Implement a class-specific type system with dedicated form components:

1. **Base Interface**: `BasePlayableCharacter` with common fields
2. **Class-Specific Interfaces**: Each class extends base with its own resources
3. **Dedicated Form Components**: Each class has its own form for resources
4. **Composed Forms**: Main form composes common sections + class-specific sections

## Architecture

### Type Hierarchy
```
BasePlayableCharacter (common fields)
├── SorcererCharacter (sorceryPoints)
├── PaladinCharacter (channelDivinityCharges)
├── MonkCharacter (kiPoints)
├── BarbarianCharacter (rages)
├── BardCharacter (inspiration)
├── DruidCharacter (wildShapeForm)
├── WarlockCharacter (invocationsKnown)
├── RogueCharacter (no resources, display-only)
├── FighterCharacter (no resources, display-only)
├── RangerCharacter (no resources, display-only)
├── ClericCharacter (no resources, display-only)
└── WizardCharacter (no resources, display-only)
```

### Component Structure
```
PlayerForm (main)
├── IdentitySection
├── HealthSection
├── CombatStatsSection
├── AttributesSection
├── SkillsSection
├── SpellcastingSection
├── InventorySection
├── NotesSection
└── ClassResourceFormSection (dynamic)
    ├── SorcererResourceForm (editable: sorceryPoints)
    ├── PaladinResourceForm (editable: channelDivinityCharges)
    ├── MonkResourceForm (editable: kiPoints)
    ├── BarbarianResourceForm (editable: rages)
    ├── BardResourceForm (editable: inspiration)
    ├── DruidResourceForm (editable: wildShapeForm)
    ├── WarlockResourceForm (editable: invocationsKnown)
    ├── RogueResourceForm (display-only)
    ├── FighterResourceForm (display-only)
    ├── RangerResourceForm (display-only)
    ├── ClericResourceForm (display-only)
    └── WizardResourceForm (display-only)
```

### Display-Only Features
Display-only features (Martial Arts, Sneak Attack, etc.) are shown in the class resource section as read-only cards, derived from `class_specific` API data.

## Objectives

1. **Type Safety**: Eliminate optional class-specific fields, use dedicated interfaces
2. **Separation of Concerns**: Each class owns its resource form
3. **Testability**: Test class-specific features in isolation
4. **Extensibility**: Add new classes without touching existing code
5. **Maintainability**: Reduce complexity of form rendering

## Class Resources Mapping

| Class | Editable Resources | Display-Only Features |
|-------|-------------------|----------------------|
| Sorcerer | sorceryPoints | metamagicKnown, creatingSpellSlots |
| Paladin | channelDivinityCharges | auraRange, destroyUndeadCR |
| Monk | kiPoints | martialArts, unarmoredMovement |
| Barbarian | rages | rageDamageBonus, brutalCritical, unarmoredMovement |
| Bard | inspiration | bardicInspirationDie, songOfRestDie, magicalSecrets |
| Druid | wildShapeForm | wildShape (CR, fly, swim) |
| Warlock | invocationsKnown | mysticArcanum |
| Rogue | none | sneakAttack |
| Fighter | none | actionSurges, extraAttacks, indomitable |
| Ranger | none | favoredEnemies, favoredTerrain, extraAttacks |
| Cleric | none | channelDivinity, destroyUndeadCR |
| Wizard | none | arcaneRecovery |

## Agent Coordination

### Coding Agent Responsibilities

1. Create base interface `BasePlayableCharacter` with all common fields
2. Create class-specific interfaces extending base (one per class)
3. Update Zod schemas with base + class-specific schemas
4. Create class resource form components (one per class)
5. Create `ClassResourceFormSection` that maps classIndex to appropriate form
6. Create display-only components for read-only features
7. Update `PlayerForm` to use new class resource section
8. Create migration script for existing data
9. Update storage/API calls to use new types

### Testing Agent Responsibilities

1. Verify all class-specific interfaces compile without errors
2. Test each class resource form component in isolation
3. Verify form state persists correctly for each class
4. Test data migration script preserves all data
5. Verify display-only features show correct API data
6. Test form submission with all classes
7. Verify switching between classes works correctly
8. Regression test: ensure existing functionality still works

## Implementation Phases

### Phase 1: Type Refactoring
- Extract base interface with common fields
- Create class-specific interfaces
- Update Zod schemas
- Verify TypeScript compilation

### Phase 2: Component Structure
- Create display-only feature components
- Create class resource form components
- Create ClassResourceFormSection
- Update PlayerForm integration

### Phase 3: Data Migration
- Create migration script
- Update storage/API handling
- Test migration with existing data

### Phase 4: Testing & Validation
- Test all class forms
- Regression testing
- Fix any issues

## Dependencies

**Phase 2 depends on Phase 1** - Types must be defined before components
**Phase 3 depends on Phase 2** - Components must be complete before migration
**Phase 4 depends on Phase 3** - Data must be migrated before final testing

## Files to Create/Modify

| File | Purpose | Phase |
|------|---------|--------|
| `lib/interfaces/interfaces.ts` | Refactor interfaces | 1 |
| `lib/schemas.ts` | Refactor schemas | 1 |
| `components/class-resource-sections/` | NEW - class forms | 2 |
| `components/class-display-sections/` | NEW - display components | 2 |
| `components/class-resource-form-section.tsx` | NEW - router component | 2 |
| `components/player-form.tsx` | Update integration | 2 |
| `scripts/migrate-character-data.ts` | NEW - migration script | 3 |
| Various storage files | Update type usage | 3 |

## Success Criteria

- All class-specific interfaces compile without errors
- Each class has its own dedicated resource form
- Form state persists correctly for all classes
- Data migration preserves all existing data
- No type errors after refactoring
- Build completes successfully
- All tests pass

## Notes

- Use `classIndex` string to determine character type (lowercase class name)
- Display-only features are derived from `class_specific` API data, not stored
- Breaking change with migration - acceptable for this refactoring
- No discriminated union initially (add later if needed for runtime type narrowing)
