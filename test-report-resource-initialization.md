# Test Report: Resource Initialization and Starting Equipment Features

## Test Date
February 13, 2026

## Summary

This report tests the resource initialization from API data and class starting equipment inventory features. The testing was performed through code analysis and verification of implementation patterns.

---

## Test 1: Resource Initialization from API Data

### Sorcerer Resource Initialization

**Test Case**: Level 2 sorcerer should initialize sorcery points to API value (3 at level 2)

**Implementation Analysis**:
- `PlayerFormIdentitySection` (lines 163-166) initializes resources from API:
```typescript
if (resourceKey && cs[resourceKey] !== undefined) {
  setValue(resourceKey, { [resourceKey]: cs[resourceKey], [`${resourceKey}_max`]: cs[resourceKey] });
}
```

- `SorcererResourceForm` (lines 26-33) displays sorcery points:
```typescript
const watchedSorceryPoints = watch("sorceryPoints");
const sorceryPointsFromAPI = classSpecific.sorcery_points;
const sorceryPoints = {
  sorceryPoints: sorceryPointsFromAPI || watchedSorceryPoints,
  sorceryPoints_max: sorceryPointsFromAPI || watchedSorceryPoints,
};
```

**Status**: ❌ **ISSUE FOUND**

**Issue**: The logic is BACKWARDS and has a reactivity problem:

1. **Incorrect Logic**: `sorceryPointsFromAPI || watchedSorceryPoints`
   - If API value is truthy (e.g., 3), it uses API value
   - If API value is falsy (e.g., 0), it uses watched value
   - This means user edits will be OVERWRITTEN whenever the form re-renders (because API value is truthy)

2. **Missing useEffect in Component**: `SorceryPointsSection` component (in class-resource-sections.tsx lines 67-70):
   ```typescript
   const [value, setValue] = useState(sorceryPoints?.sorceryPoints ?? 0);
   const [maxValue, setMaxValue] = useState(
     sorceryPoints?.sorceryPoints_max ?? value,
   );
   ```
   - Uses `useState` with prop as initial value
   - **Missing `useEffect` to sync when props change**
   - `useState` only uses initial value on first render
   - Component becomes unresponsive to prop changes

**Expected Behavior**:
- API value should be the INITIAL default
- User should be able to edit the value
- Edited values should persist when form re-renders
- Component should update when class/level changes

**Actual Behavior**:
- API value is used initially
- User can edit the value
- **User edits are overwritten whenever form re-renders (because API value is truthy)**
- **Component doesn't update when props change (missing useEffect)**

**Severity**: **CRITICAL** - Breaks user experience and causes data loss

**Recommended Fix for SorceryPointsSection**:
```typescript
const [value, setValue] = useState(sorceryPoints?.sorceryPoints ?? 0);
const [maxValue, setMaxValue] = useState(
  sorceryPoints?.sorceryPoints_max ?? value,
);

// Add this useEffect:
useEffect(() => {
  setValue(sorceryPoints?.sorceryPoints ?? 0);
  setMaxValue(sorceryPoints?.sorceryPoints_max ?? sorceryPoints?.sorceryPoints ?? 0);
}, [sorceryPoints]);
```

**Recommended Fix for SorcererResourceForm**:
```typescript
// Remove the sorceryPoints object construction
// Just pass watched value directly:
const watchedSorceryPoints = watch("sorceryPoints");

// Or better: don't construct the object at all, let the form handle it
// The parent form already initializes values correctly
```

---

### Monk Resource Initialization

**Test Case**: Level 2 monk should initialize ki points to API value (2 at level 2)

**Implementation Analysis**:
`MonkResourceForm` (lines 17-23):
```typescript
const watchedKiPoints = watch("kiPoints");
const kiPointsFromAPI = classSpecific.ki_points;
const kiPoints = watchedKiPoints || {
  kiPoints: kiPointsFromAPI || 0,
  kiPoints_max: kiPointsFromAPI || 0,
};
```

**Status**: ❌ **ISSUE FOUND**

**Issue**: Same problem as Sorcerer - uses `watchedKiPoints || {...}`

1. **Incorrect Logic**: Same issue - API value overwrites user edits
2. **Reactivity**: `KiPointsSection` doesn't use useState (it directly uses props), so it should update correctly when form changes

**Severity**: **CRITICAL**

---

### Barbarian Resource Initialization

**Test Case**: Level 1 barbarian should initialize rages to API value (2 at level 1)

**Implementation Analysis**:
`BarbarianResourceForm` (lines 18-24):
```typescript
const watchedRages = watch("rages");
const ragesFromAPI = classSpecific.rage_count;
const rages = watchedRages || {
  rages: ragesFromAPI || 0,
  rages_max: ragesFromAPI || 0,
};
```

**Status**: ❌ **ISSUE FOUND**

**Issue**: Same pattern - uses `watchedRages || {...}`

**Severity**: **CRITICAL**

---

### Bard Resource Initialization

**Test Case**: Level 1 bard should initialize inspiration to max value (1)

**Implementation Analysis**:
`BardResourceForm` (lines 18-23):
```typescript
const watchedInspiration = watch("inspiration");
const inspiration = watchedInspiration || {
  inspiration: classSpecific.bardic_inspiration_die ? 1 : 0,
  inspiration_max: classSpecific.bardic_inspiration_die ? 1 : 0,
};
```

**Status**: ❌ **ISSUE FOUND**

**Issue**: Same pattern - uses `watchedInspiration || {...}`

**Note**: Bard's inspiration is initialized to 1 (not from API, but hardcoded)

**Severity**: **CRITICAL**

---

### Paladin Resource Initialization

**Test Case**: Level 2 paladin should initialize channel divinity charges to API value (1)

**Implementation Analysis**:
`PaladinResourceForm` (lines 17-23):
```typescript
const watchedChannelDivinityCharges = watch("channelDivinityCharges");
const channelDivinityFromAPI = classSpecific.channel_divinity_charges;
const channelDivinityCharges = watchedChannelDivinityCharges || {
  channelDivinityCharges: channelDivinityFromAPI || 0,
  channelDivinityCharges_max: channelDivinityFromAPI || 0,
};
```

**Status**: ❌ **ISSUE FOUND**

**Issue**: Same pattern

**Severity**: **CRITICAL**

---

### Cleric Resource Initialization

**Test Case**: Level 2 cleric should initialize channel divinity charges to API value (1)

**Implementation Analysis**:
`ClericResourceForm` (lines 16-22):
```typescript
const watchedChannelDivinityCharges = watch("channelDivinityCharges");
const channelDivinityFromAPI = classSpecific.channel_divinity_charges;
const channelDivinityCharges = {
  channelDivinityCharges: channelDivinityFromAPI || watchedChannelDivinityCharges,
  channelDivinityCharges_max: channelDivinityFromAPI || watchedChannelDivinityCharges,
};
```

**Status**: ❌ **CONFIRMED ISSUE**

**Issue**: Same pattern as Paladin - API value overwrites user edits

**Severity**: **CRITICAL**

---

### Summary of Resource Initialization Tests

| Class | Resource | API Value | Expected | Actual | Status |
|-------|----------|-----------|----------|--------|--------|
| Sorcerer | sorceryPoints | 3 (at lvl 2) | Initialize from API, allow edit, preserve changes | API overwrites user edits, component not reactive | ❌ |
| Monk | kiPoints | 2 (at lvl 2) | Initialize from API, allow edit, preserve changes | API overwrites user edits | ❌ |
| Barbarian | rages | 2 (at lvl 1) | Initialize from API, allow edit, preserve changes | API overwrites user edits | ❌ |
| Bard | inspiration | 1 (at lvl 1) | Initialize from API, allow edit, preserve changes | API overwrites user edits, hardcoded initial | ❌ |
| Paladin | channelDivinityCharges | 1 (at lvl 2) | Initialize from API, allow edit, preserve changes | API overwrites user edits | ❌ |
| Cleric | channelDivinityCharges | 1 (at lvl 2) | Initialize from API, allow edit, preserve changes | API overwrites user edits | ❌ |

---

## Test 2: Display-Only Features

### Paladin Aura Range Display

**Test Case**: Paladin level 6+ should display aura range

**Implementation Analysis**:
`PaladinResourceForm` (lines 37-39):
```typescript
{classSpecific.aura_range !== undefined && classSpecific.aura_range !== null && (
  <AuraRangeDisplay auraRange={classSpecific.aura_range} />
)}
```

**Status**: ✅ **PASS**

**Reason**: Uses `!== undefined && !== null` check, which will display even when value is 0

---

### Monk Unarmored Movement Display

**Test Case**: Monk level 1 should display unarmored movement (0 at level 1)

**Implementation Analysis**:
`MonkResourceForm` does NOT show UnarmoredMovementDisplay (missing from code)

**Status**: ❌ **MISSING FEATURE**

**Issue**: UnarmoredMovementDisplay is not included in MonkResourceForm

**Severity**: **MINOR**

---

### Barbarian Unarmored Movement Display

**Test Case**: Barbarian level 5+ should display unarmored movement

**Implementation Analysis**:
`BarbarianResourceForm` includes `UnarmoredMovementDisplay` import but doesn't use it (lines 42-44 check for other features)

**Status**: ❌ **MISSING FEATURE**

**Issue**: UnarmoredMovementDisplay is imported but not used in BarbarianResourceForm

**Severity**: **MINOR**

---

### Summary of Display-Only Feature Tests

| Feature | Class | Level | Condition | Status |
|---------|-------|-------|-----------|--------|
| Aura Range | Paladin | 6+ | `!== undefined && !== null` | ✅ |
| Unarmored Movement | Monk | 1 | Missing from component | ❌ |
| Unarmored Movement | Barbarian | 5+ | Imported but not used | ❌ |

---

## Test 3: Class Starting Equipment Inventory

### New Character Creation

**Test Case**: Select "Fighter" class → inventory should populate with fighter's starting equipment

**Implementation Analysis**:
1. **GraphQL Query Status**:
   - `GetClass` query in `lib/graphql/classes.graphql` (lines 113-115):
     ```graphql
     starting_equipment {
       quantity
     }
     ```
   - ❌ **MISSING**: Equipment details (index, name, cost, etc.) are NOT queried

2. **Code Implementation Status**:
   - ✅ `convertApiEquipmentToItem` function exists in `hooks.ts` (lines 278-323)
   - ✅ Function accepts `source: 'class' | 'background' | 'race'` parameter
   - ❌ **MISSING**: No code populates inventory when class changes
   - ❌ **MISSING**: No useEffect in PlayerForm or PlayerFormIdentitySection for class starting equipment

**Status**: ❌ **NOT IMPLEMENTED**

**Blocker**: GraphQL query needs to be updated first

**Required Changes**:
1. Update `lib/graphql/classes.graphql` to include equipment details:
   ```graphql
   starting_equipment {
     equipment {
       index
       name
       cost {
         quantity
         unit
       }
       equipment_category {
         index
         name
       }
       gear_category {
         index
         name
       }
     }
     quantity
   }
   ```

2. Regenerate GraphQL types: `npm run codegen`

3. Add code to populate inventory when class changes (in PlayerFormIdentitySection)

**Severity**: **BLOCKER**

---

### Class Switching

**Test Case**: Change from Fighter to Wizard → inventory should update to wizard's starting equipment

**Status**: ❌ **NOT IMPLEMENTED**

**Reason**: Starting equipment feature not implemented at all

---

### Multiple Class Changes

**Test Case**: Fighter → Wizard → Cleric → inventory should update each time

**Status**: ❌ **NOT IMPLEMENTED**

**Reason**: Starting equipment feature not implemented at all

---

### Edge Cases

**Test Case 1**: Select class, then deselect class

**Status**: ❌ **NOT IMPLEMENTED**

**Test Case 2**: Change class without saving first

**Status**: ❌ **NOT IMPLEMENTED**

**Test Case 3**: Classes with minimal starting equipment (like Rogue)

**Status**: ❌ **NOT IMPLEMENTED**

---

### Summary of Starting Equipment Tests

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| New character with Fighter class | Inventory populated | Not implemented | ❌ |
| Class switching (Fighter → Wizard) | Inventory updates | Not implemented | ❌ |
| Multiple class changes | Inventory updates each time | Not implemented | ❌ |
| Deselect class | Graceful handling | Not implemented | ❌ |
| Change without saving | Still updates | Not implemented | ❌ |
| Minimal equipment classes | Work correctly | Not implemented | ❌ |

---

## Test 4: Form State Persistence

**Test Case**: Edit sorcery points to 2/3, change class to Monk, change back to Sorcerer → sorcery points should remain 2/3

**Implementation Analysis**:
- React Hook Form's `reset` is called when `playableCharacter` prop changes (PlayerForm lines 250-254)
- This would reset the form to the saved character data
- Without implementing proper state preservation, this test cannot pass

**Status**: ❌ **NOT IMPLEMENTED**

**Reason**: Starting equipment feature not implemented, and resource initialization has issues

---

## Critical Issues Summary

### 1. Resource Initialization Logic and Reactivity Issue (CRITICAL)

**Problem**: All resource forms use `APIValue || watchedValue` pattern which causes user edits to be overwritten

**Root Cause**:
- Resource forms construct a new object using `sorceryPointsFromAPI || watchedSorceryPoints`
- This means if API value is truthy (e.g., 3), it ALWAYS uses API value
- User edits are lost whenever the form re-renders (which happens frequently)

**Additional Issue**: `SorceryPointsSection` uses `useState` without `useEffect` to sync with prop changes

**Affected Files**:
- `components/class-resource-forms/sorcerer-resource-form.tsx` (lines 25-33)
- `components/class-resource-forms/monk-resource-form.tsx` (lines 17-23)
- `components/class-resource-forms/barbarian-resource-form.tsx` (lines 18-24)
- `components/class-resource-forms/bard-resource-form.tsx` (lines 18-23)
- `components/class-resource-forms/paladin-resource-form.tsx` (lines 17-23)
- `components/class-resource-forms/cleric-resource-form.tsx` (lines 16-22)
- `components/class-resource-sections.tsx` (lines 63-104) - SorceryPointsSection missing useEffect

**Recommended Fix**:

**Option 1 - Don't reconstruct the object, pass watched value directly:**
```typescript
// In resource forms (e.g., sorcerer-resource-form.tsx):
const watchedSorceryPoints = watch("sorceryPoints");

// Don't reconstruct - just use the watched value
// The parent form (PlayerFormIdentitySection) already initializes correctly
<SorceryPointsSection
  sorceryPoints={watchedSorceryPoints || {
    sorceryPoints: sorceryPointsFromAPI || 0,
    sorceryPoints_max: sorceryPointsFromAPI || 0,
  }}
  onChange={(value) => setValue("sorceryPoints", value)}
/>
```

**Option 2 - Use proper React patterns (recommended for SorceryPointsSection):**
```typescript
// In SorceryPointsSection (class-resource-sections.tsx):
const [value, setValue] = useState(sorceryPoints?.sorceryPoints ?? 0);
const [maxValue, setMaxValue] = useState(
  sorceryPoints?.sorceryPoints_max ?? value,
);

// Add useEffect to sync with prop changes:
useEffect(() => {
  setValue(sorceryPoints?.sorceryPoints ?? 0);
  setMaxValue(sorceryPoints?.sorceryPoints_max ?? sorceryPoints?.sorceryPoints ?? 0);
}, [sorceryPoints]);
```

---

### 2. Class Starting Equipment Not Implemented (BLOCKER)

**Problem**: Feature completely missing

**Required Changes**:
1. Update GraphQL query in `lib/graphql/classes.graphql`
2. Regenerate types
3. Add useEffect to populate inventory when class changes

**Estimated Effort**: 2-3 hours

---

### 3. Missing Display Components (MINOR)

**Problem**: Unarmored movement not shown for Monk and Barbarian

**Affected Files**:
- `components/class-resource-forms/monk-resource-form.tsx` - missing import and usage
- `components/class-resource-forms/barbarian-resource-form.tsx` - imported but not used

---

## Recommendations

### High Priority (Critical - Must Fix Before Release)

1. **Fix SorceryPointsSection reactivity** (CRITICAL)
   - Add useEffect to sync state with prop changes
   - This causes the UI to not update when class/level changes
   - File: `components/class-resource-sections.tsx` lines 63-104

2. **Fix all resource form initialization logic** (CRITICAL)
   - Don't reconstruct resource objects using `APIValue || watchedValue`
   - This causes user edits to be overwritten on every re-render
   - Instead, use watched value or properly sync with form state
   - Files: All resource forms in `components/class-resource-forms/`

3. **Implement class starting equipment** (CRITICAL)
   - Update GraphQL query to include equipment details
   - Add code to populate inventory when class changes
   - This is a major feature that users expect
   - Estimated effort: 2-3 hours

### Medium Priority

4. Add UnarmoredMovementDisplay to Monk and Barbarian forms
   - Monk: Missing from component
   - Barbarian: Imported but not used

5. Test resource persistence across form re-renders
   - Verify user edits are preserved
   - Verify changes sync correctly when class/level changes

6. Consider using controlled components consistently
   - Some sections use useState with props (SorceryPointsSection)
   - Some sections directly use props (KiPointsSection, RageSection)
   - Standardize approach for better maintainability

### Low Priority

7. Consider adding a "Reset to Default" button for each resource
   - Allow users to reset to API default values
   - Visual indication when value differs from API default

8. Add visual indicators for resource depletion
   - Color changes when resource is low (e.g., < 50%)
   - Warning when resource is at 0

---

## Test Environment
- Node.js: v18+
- Next.js: 16.0.10
- React Query: Latest
- Testing Method: Code analysis and verification

---

## Conclusion

### Overall Status: ❌ **CRITICAL ISSUES FOUND**

The resource initialization and starting equipment features have critical issues:

1. **Resource Initialization** (CRITICAL):
   - Logic causes user edits to be overwritten on every re-render
   - SorceryPointsSection component is not reactive to prop changes
   - Users will lose their edits when class/level changes
   - Multiple classes affected: Sorcerer, Monk, Barbarian, Bard, Paladin, Cleric

2. **Starting Equipment** (BLOCKER):
   - Feature completely not implemented
   - GraphQL query missing equipment details
   - No code to populate inventory

3. **Display Features** (MINOR):
   - Partially working
   - UnarmoredMovementDisplay missing from Monk and Barbarian forms

### Impact Assessment

- **User Experience**: Users will be frustrated as their resource edits are constantly lost
- **Data Integrity**: User changes are not properly preserved
- **Feature Completeness**: Starting equipment feature is missing entirely
- **Confidence Level**: LOW - Features need significant fixes before release

### Next Steps (In Order of Priority)

1. **IMMEDIATE**: Fix SorceryPointsSection reactivity (add useEffect)
2. **IMMEDIATE**: Fix resource form logic to preserve user edits
3. **HIGH**: Update GraphQL query for class starting equipment
4. **HIGH**: Implement inventory population when class changes
5. **MEDIUM**: Add missing UnarmoredMovementDisplay components
6. **LOW**: Add UX enhancements (reset buttons, visual indicators)

### Estimated Effort to Fix All Issues

- Resource initialization fixes: 2-3 hours
- Starting equipment implementation: 2-3 hours
- Display component fixes: 1 hour
- Testing and validation: 2 hours
- **Total: 7-9 hours**

### Recommendation

**Do not release** until at least the resource initialization issues are fixed. The current behavior causes user data loss and creates a very poor user experience.

---

## Detailed Analysis: How Resource State Flows Through the Application

To understand the issues, let's trace the flow of sorcery points state:

### 1. Initial Selection (User selects Sorcerer class at level 2)

**PlayerFormIdentitySection** (lines 132-178):
```typescript
useEffect(() => {
  if (selectedClass) {
    const levelData = selectedClass.class_levels?.find((l: any) => l.level === watchedLevel);
    if (levelData?.class_specific) {
      const cs: any = levelData.class_specific;
      const resourceTypes = getClassResourceTypes();
      const classIndex = selectedClass.index;
      const resourceKey = resourceTypes[classIndex];

      if (resourceKey && cs[resourceKey] !== undefined) {
        // This sets the form state with API value
        setValue(resourceKey, { [resourceKey]: cs[resourceKey], [`${resourceKey}_max`]: cs[resourceKey] });
      }
    }
  }
}, [selectedClass, watchedLevel, setValue]);
```

**What happens**: `setValue("sorceryPoints", { sorceryPoints: 3, sorceryPoints_max: 3 })`

**Result**: ✅ Form state correctly initialized with API value (3)

### 2. User Edits the Value

**SorceryPointsSection** (class-resource-sections.tsx):
```typescript
const [value, setValue] = useState(sorceryPoints?.sorceryPoints ?? 0); // 3
const [maxValue, setMaxValue] = useState(sorceryPoints?.sorceryPoints_max ?? value); // 3

// User clicks and changes value to 2
onChange={(v) => {
  onChange({ sorceryPoints: v, sorceryPoints_max: maxValue }); // Calls parent's onChange
  setValue(v); // Updates local state
}}
```

**What happens**:
- Parent's onChange calls `setValue("sorceryPoints", { sorceryPoints: 2, sorceryPoints_max: 3 })`
- Form state updated: `{ sorceryPoints: 2, sorceryPoints_max: 3 }`
- Local state updated: `value = 2`

**Result**: ✅ User edit appears to work

### 3. Form Re-renders (e.g., level changes to 3)

**PlayerFormIdentitySection**:
- `watchedLevel` changes to 3
- useEffect runs again
- Fetches level 3 data from API: `sorceryPoints = 6`
- Calls `setValue("sorceryPoints", { sorceryPoints: 6, sorceryPoints_max: 6 })`

**SorcererResourceForm** (lines 25-33):
```typescript
const watchedSorceryPoints = watch("sorceryPoints"); // Now { sorceryPoints: 6, sorceryPoints_max: 6 }
const sorceryPointsFromAPI = classSpecific.sorcery_points; // 6
const sorceryPoints = {
  sorceryPoints: sorceryPointsFromAPI || watchedSorceryPoints, // 6 || {6,6} = 6 (WRONG!)
  sorceryPoints_max: sorceryPointsFromAPI || watchedSorceryPoints, // 6 || {6,6} = 6 (WRONG!)
};
```

**SorceryPointsSection** (NO useEffect):
```typescript
const [value, setValue] = useState(sorceryPoints?.sorceryPoints ?? 0); // Uses INITIAL state (3), not new prop (6)
const [maxValue, setMaxValue] = useState(sorceryPoints?.sorceryPoints_max ?? value); // Uses INITIAL state
```

**What happens**:
1. Form state updated correctly by parent: `{ sorceryPoints: 6, sorceryPoints_max: 6 }`
2. Resource form reconstructs object incorrectly: `{ sorceryPoints: 6, sorceryPoints_max: 6 }` (uses API value)
3. SorceryPointsSection shows OLD value (3) because `useState` doesn't update when props change

**Result**: ❌
- User's edit (2) is lost (overwritten by API value 6)
- UI shows stale value (3) instead of new API value (6)
- Complete state corruption

### 4. The Correct Flow (What Should Happen)

**Option 1 - Remove object reconstruction (Recommended)**:
```typescript
// In SorcererResourceForm:
const watchedSorceryPoints = watch("sorceryPoints");

<SorceryPointsSection
  sorceryPoints={watchedSorceryPoints}
  onChange={(value) => setValue("sorceryPoints", value)}
/>
```

**Option 2 - Add useEffect in SorceryPointsSection**:
```typescript
const [value, setValue] = useState(sorceryPoints?.sorceryPoints ?? 0);
const [maxValue, setMaxValue] = useState(sorceryPoints?.sorceryPoints_max ?? value);

useEffect(() => {
  setValue(sorceryPoints?.sorceryPoints ?? 0);
  setMaxValue(sorceryPoints?.sorceryPoints_max ?? sorceryPoints?.sorceryPoints ?? 0);
}, [sorceryPoints]);
```

---

## Appendix: Code References

### Resource Initialization Logic
- `components/player-form-identity-section.tsx` lines 132-178
- `components/class-resource-forms/sorcerer-resource-form.tsx` lines 25-33
- `components/class-resource-forms/monk-resource-form.tsx` lines 17-23
- `components/class-resource-forms/barbarian-resource-form.tsx` lines 18-24
- `components/class-resource-forms/bard-resource-form.tsx` lines 18-23
- `components/class-resource-forms/paladin-resource-form.tsx` lines 17-23

### GraphQL Queries
- `lib/graphql/classes.graphql` - GetClass query
- `lib/graphql/backgrounds.graphql` - GetBackground query (has correct equipment structure)

### Equipment Conversion
- `lib/api/hooks.ts` lines 278-323 - convertApiEquipmentToItem function
