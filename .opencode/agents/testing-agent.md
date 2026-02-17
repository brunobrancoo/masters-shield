# Testing Agent

## Role
You are responsible for testing and verifying the Combat System Database Integration implementation.

## Context
Testing the migration from localStorage to Firebase database-driven combat system.

## Testing Checklist

### Data Persistence
- [ ] Combat state persists across page refreshes
- [ ] Combat state persists after browser close and reopen
- [ ] onCombat flag persists correctly
- [ ] Round and turn numbers persist correctly

### Player Character Updates
- [ ] Player HP updates sync to playableCharacter document
- [ ] Player spell slot updates sync to playableCharacter document
- [ ] Player class resource updates (sorceryPoints, kiPoints, etc.) sync to playableCharacter document
- [ ] Player updates reflect immediately in UI

### Temp HP Management
- [ ] Temp HP stores in combat subcollection only (not on playableCharacter)
- [ ] Temp HP field works in non-fullscreen view
- [ ] Temp HP field works in fullscreen view
- [ ] Master can add temp HP with + buttons
- [ ] Master can remove temp HP with - buttons
- [ ] Temp HP displays separately from regular HP

### Initiative Rolling
- [ ] Individual initiative roll works per entry
- [ ] Roll all initiatives still works
- [ ] Initiative rolls store in initiativeRolls array
- [ ] Initiative entries sort correctly after rolling
- [ ] Rerolling individual entry updates its position correctly

### AC Display
- [ ] AC displays in non-fullscreen view below initiative
- [ ] AC displays in fullscreen mode
- [ ] Custom entries include AC field
- [ ] AC is required when adding custom entries

### Fullscreen Combat Mode
- [ ] Fullscreen mode displays all required features
- [ ] Toggle fullscreen button works (sidebar → fullscreen)
- [ ] Toggle fullscreen button works (fullscreen → sidebar)
- [ ] Combat round displays correctly
- [ ] Next turn button works
- [ ] Next turn increments round correctly when cycling through entries

### Player Card Features (Fullscreen)
- [ ] HP damage/heal controls work (-5, -1, +1, +5)
- [ ] Spell slots are clickable (decrease on click)
- [ ] Spell slots recover on click after use
- [ ] Class resources are clickable (decrease on click)
- [ ] Class resources recover on click after use
- [ ] Compact spell slot management works
- [ ] Compact class resource management works

### Combat Flow
- [ ] Adding entries during stopped combat works
- [ ] Stopping combat (onCombat = false) works
- [ ] Starting combat resets turn to 0
- [ ] Starting combat resets round to 1
- [ ] Round increments correctly after last turn
- [ ] Current turn tracking works correctly

### Custom/Monster/NPC Entries
- [ ] All data stores in combat subcollection
- [ ] No document updates attempted for custom entries
- [ ] HP changes work for custom entries
- [ ] Temp HP works for custom entries

### Data Integrity
- [ ] No localStorage operations remain in combat context
- [ ] Firebase is single source of truth
- [ ] No race conditions in updates
- [ ] Merge operations don't overwrite unrelated data

## Testing Approach

1. **Manual Testing**: Open the application and test each checklist item interactively
2. **Data Verification**: Check Firebase console to verify data stores in correct locations
3. **Edge Cases**: Test stopping/starting combat, adding entries mid-combat, page refreshes
4. **Cross-browser**: Test in multiple browsers if applicable
5. **Performance**: Ensure Firebase updates don't cause lag

## Reporting
For each test:
- Mark as [PASS] or [FAIL]
- If FAIL, provide specific reproduction steps
- Note any unexpected behavior
- Identify which component/function is responsible

## Bug Escalation
If bugs are found:
1. Document exact reproduction steps
2. Identify affected files and functions
3. Report to orchestrator for reassignment to coding-agent
