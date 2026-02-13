# Testing Agent

Validates all changes for the class-specific type system and form component separation project.

## Overview

The Testing Agent is responsible for comprehensive testing of each phase, ensuring type safety, correct form rendering, data migration, and that all classes work properly with their dedicated components.

## Testing Strategy

### Phase 1: Type Refactoring Testing

#### 1.1 Interface Validation
**Test**: Verify all interfaces compile and are properly structured

**Checks**:
- [ ] `BasePlayableCharacter` interface has all common fields
- [ ] `SorcererCharacter`, `PaladinCharacter`, etc. properly extend base
- [ ] `PlayableCharacter` type is a union of all class-specific types
- [ ] No class-specific resource fields remain in base interface
- [ ] TypeScript compilation succeeds (no type errors)
- [ ] Legacy fields (for migration) are still present in base interface

#### 1.2 Zod Schema Validation
**Test**: Verify schemas match interfaces and compile

**Checks**:
- [ ] `basePlayableCharacterSchema` has all common fields
- [ ] Class-specific schemas extend base correctly
- [ ] `playableCharacterSchema` is a union of all class schemas
- [ ] No type errors in schema definitions
- [ ] Zod validation works correctly for each class

#### 1.3 Type Safety Verification
**Test**: Verify type safety improvements

**Checks**:
- [ ] Sorcerer character cannot access `kiPoints` (type error if attempted)
- [ ] Paladin character cannot access `sorceryPoints` (type error if attempted)
- [ ] Each class has access only to its own resources
- [ ] TypeScript provides autocomplete only for valid fields

### Phase 2: Component Structure Testing

#### 2.1 Display-Only Components
**Test**: Verify display components render correctly

**Checks**:
- [ ] Each display component renders correct UI
- [ ] Components return null when data is not present
- [ ] Icons match feature theme
- [ ] Styling is consistent
- [ ] All display components export correctly

#### 2.2 Class Resource Form Components
**Test**: Verify each class form component works

**SorcererResourceForm**:
- [ ] SorceryPointsSection renders with correct max value
- [ ] Can adjust current sorcery points
- [ ] MetamagicKnownDisplay shows correct count
- [ ] CreatingSpellSlotsDisplay shows correct table

**PaladinResourceForm**:
- [ ] ChannelDivinitySection renders at level 2+
- [ ] Can adjust channel divinity charges
- [ ] AuraRangeDisplay shows correct range
- [ ] DestroyUndeadCRDisplay shows correct CR

**MonkResourceForm**:
- [ ] KiPointsSection renders with correct max value
- [ ] Can adjust current ki points
- [ ] MartialArtsDisplay shows correct dice
- [ ] UnarmoredMovementDisplay shows correct bonus

**BarbarianResourceForm**:
- [ ] RageSection renders with correct max value
- [ ] Can adjust current rage count
- [ ] RageDamageBonusDisplay shows correct bonus
- [ ] BrutalCriticalDisplay shows correct dice count
- [ ] UnarmoredMovementDisplay shows correct bonus

**BardResourceForm**:
- [ ] InspirationSection renders with correct max value
- [ ] Can adjust current inspiration
- [ ] BardicInspirationDieDisplay shows correct die
- [ ] SongOfRestDieDisplay shows correct die
- [ ] MagicalSecretsDisplay shows correct levels

**DruidResourceForm**:
- [ ] WildShapeDisplay shows correct stats
- [ ] DruidWildShapeSelector renders with correct options
- [ ] Can select wild shape form
- [ ] Selected form persists in form state

**WarlockResourceForm**:
- [ ] Can edit invocations known count
- [ ] MysticArcanumDisplay shows correct levels

**RogueResourceForm**:
- [ ] SneakAttackDisplay shows correct dice

**FighterResourceForm**:
- [ ] ActionSurgesDisplay shows correct count
- [ ] ExtraAttacksDisplay shows correct count
- [ ] IndomitableUsesDisplay shows correct count

**RangerResourceForm**:
- [ ] FavoredEnemiesDisplay shows correct count
- [ ] FavoredTerrainDisplay shows correct count
- [ ] ExtraAttacksDisplay shows correct count

**ClericResourceForm**:
- [ ] ChannelDivinityDisplay shows correct count
- [ ] DestroyUndeadCRDisplay shows correct CR

**WizardResourceForm**:
- [ ] ArcaneRecoveryDisplay shows correct level

#### 2.3 ClassResourceFormSection
**Test**: Verify routing component works correctly

**Checks**:
- [ ] Correct form component renders for each class
- [ ] Returns null for unknown class
- [ ] Passes all props correctly to form components
- [ ] Renders section header and container

#### 2.4 PlayerForm Integration
**Test**: Verify main form integration works

**Checks**:
- [ ] `PlayerFormClassResourcesDynamic` is removed
- [ ] `ClassResourceFormSection` is imported and rendered
- [ ] All props pass correctly to `ClassResourceFormSection`
- [ ] Class-specific fields removed from default values
- [ ] Form renders without errors

### Phase 3: Data Migration Testing

#### 3.1 Migration Script
**Test**: Verify migration script works correctly

**Checks**:
- [ ] Script runs without errors
- [ ] All characters are migrated
- [ ] Class-specific resources preserved correctly
- [ ] ClassIndex mapped correctly (lowercase)
- [ ] Classes without resources work correctly
- [ ] Output file is valid JSON
- [ ] No data loss during migration

#### 3.2 Migration Coverage
**Test**: Verify all classes migrate correctly

**Test Cases**:
| Class | Resources | Migrated Correctly? |
|-------|-----------|---------------------|
| Sorcerer | sorceryPoints | ⬜ |
| Paladin | channelDivinityCharges | ⬜ |
| Monk | kiPoints | ⬜ |
| Barbarian | rages | ⬜ |
| Bard | inspiration | ⬜ |
| Druid | wildShapeForm | ⬜ |
| Warlock | invocationsKnown | ⬜ |
| Rogue | none | ⬜ |
| Fighter | none | ⬜ |
| Ranger | none | ⬜ |
| Cleric | none | ⬜ |
| Wizard | none | ⬜ |

#### 3.3 Storage/API Updates
**Test**: Verify data handling works with new types

**Checks**:
- [ ] Can read migrated character data
- [ ] Can write character data
- [ ] Form submission works with new types
- [ ] Loading characters displays correct data

### Phase 4: Integration Testing

#### 4.1 Form State Persistence
**Test**: Verify form state persists correctly

**Checks**:
- [ ] Create sorcerer, set sorcery points, save, reload - points preserved
- [ ] Create paladin, set channel divinity, save, reload - charges preserved
- [ ] Create monk, set ki points, save, reload - points preserved
- [ ] Create barbarian, set rages, save, reload - rages preserved
- [ ] Create bard, set inspiration, save, reload - inspiration preserved
- [ ] Create druid, select wild shape form, save, reload - form preserved
- [ ] Create warlock, set invocations, save, reload - invocations preserved

#### 4.2 Class Switching
**Test**: Verify switching between classes works

**Checks**:
- [ ] Switch from sorcerer to paladin - form updates correctly
- [ ] Switch from paladin to monk - form updates correctly
- [ ] Switch from any class to any other class - no errors
- [ ] Switching clears previous class-specific resources from UI

#### 4.3 Level Changes
**Test**: Verify level changes update class features

**Checks**:
- [ ] Sorcerer level 2 → 3 - sorcery points max updates, metamagic appears
- [ ] Paladin level 2 → 3 - channel divinity appears
- [ ] Monk level 2 → 5 - ki points max updates
- [ ] Barbarian level 11 → 12 - max rages updates
- [ ] Bard level 4 → 5 - inspiration die upgrades
- [ ] Druid level 2 → 4 - wild shape CR upgrades
- [ ] Rogue level 2 → 3 - sneak attack dice increase
- [ ] Fighter level 2 → 5 - action surge, extra attacks appear

#### 4.4 Form Submission
**Test**: Verify form submission works for all classes

**Checks**:
- [ ] Submit sorcerer character - all data saved
- [ ] Submit paladin character - all data saved
- [ ] Submit monk character - all data saved
- [ ] Submit barbarian character - all data saved
- [ ] Submit bard character - all data saved
- [ ] Submit druid character - all data saved
- [ ] Submit warlock character - all data saved
- [ ] Submit rogue character - all data saved
- [ ] Submit fighter character - all data saved
- [ ] Submit ranger character - all data saved
- [ ] Submit cleric character - all data saved
- [ ] Submit wizard character - all data saved

### Cross-Feature Testing

**Test**: Verify features work together

**Checks**:
- [ ] Creating new character works for all classes
- [ ] Loading existing character works for all classes
- [ ] Editing character works for all classes
- [ ] Saving character works for all classes
- [ ] Switching between characters works
- [ ] All common form sections (identity, health, etc.) still work

### Edge Cases

**Test**: Handle unusual scenarios

**Checks**:
- [ ] Invalid classIndex - graceful fallback
- [ ] Missing class data - graceful fallback
- [ ] Level 0 - no features, no errors
- [ ] Level 20+ - no features, no errors
- [ ] Empty form submission - validation works
- [ ] Rapid class switching - no errors
- [ ] Rapid level changes - no errors
- [ ] Missing resource data - graceful handling

### UI/UX Testing

**Checks**:
- [ ] All text in Portuguese
- [ ] Icons match feature theme
- [ ] Color scheme consistent across class forms
- [ ] Responsive design works on mobile
- [ ] Loading states show while fetching data
- [ ] Error messages display when API fails
- [ ] Section headers are consistent
- [ ] Empty states handled gracefully

### Performance Testing

**Checks**:
- [ ] Form renders quickly (< 500ms)
- [ ] No unnecessary re-renders
- [ ] Class switching is instant
- [ ] Level changes update instantly
- [ ] Memory usage stable during extended use

## Test Execution Order

1. **Phase 1 Testing**: Type refactoring
   - Run after Coding Agent completes Phase 1
   - Verify TypeScript compilation
   - Report any blocking type errors

2. **Phase 2 Testing**: Component structure
   - Run after Phase 1 tests pass
   - Test each display component
   - Test each form component
   - Verify integration

3. **Phase 3 Testing**: Data migration
   - Run after Phase 2 tests pass
   - Test migration script
   - Verify all data preserved

4. **Phase 4 Testing**: Integration
   - Run after Phase 3 tests pass
   - Test end-to-end workflows
   - Regression testing

## Reporting Format

After each test phase, provide:

### ✅ Passed Tests
List of tests that passed

### ❌ Failed Tests
List of tests that failed with:
- Description of failure
- Steps to reproduce
- Expected vs actual behavior
- Severity (blocker / major / minor)
- Error message or stack trace

### 🔍 Issues Found
Any bugs or edge cases discovered

### 📋 Recommendations
Suggestions for improvements found during testing

### 🚨 Blockers
Critical issues that must be resolved before proceeding

## Success Criteria

- All Phase 1 tests pass (no type errors)
- All Phase 2 tests pass (all components work)
- All Phase 3 tests pass (migration successful)
- All Phase 4 tests pass (integration works)
- All 12 classes can be created, edited, and saved
- No regressions from refactoring
- Performance is acceptable
- UI/UX is consistent

## Tools

- TypeScript compiler (type checking)
- React DevTools (component state)
- Browser DevTools (console inspection)
- Manual testing across all classes
- Cross-browser testing (Chrome, Firefox, Safari)
- Performance profiling
- Memory profiling

## Test Data

Prepare test characters for each class at various levels (1, 5, 10, 15, 20) to test all features.
