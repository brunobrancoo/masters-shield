# Scripts

This directory contains utility scripts for the Masters Shield project.

## Migration Script

### `migrate-character-data.ts`

Migrates character data from the old `LegacyPlayableCharacter` format to the new discriminated union `PlayableCharacter` format.

#### What it does

The script handles both LocalStorage and Firebase Firestore data:

1. **LocalStorage**: Migrates data stored in the browser's localStorage (development/testing)
2. **Firebase**: Migrates data stored in Firebase Firestore (production)

#### Migration Logic

The script converts characters by:

1. Reading all characters from storage
2. Determining the character class based on `classIndex`
3. Mapping to the appropriate class-specific type:
   - `sorcerer` → `SorcererCharacter` with `sorceryPoints`
   - `paladin` → `PaladinCharacter` with `channelDivinityCharges`
   - `monk` → `MonkCharacter` with `kiPoints`
   - `barbarian` → `BarbarianCharacter` with `rages`
   - `bard` → `BardCharacter` with `inspiration`
   - `druid` → `DruidCharacter` with `wildShapeForm`
   - `warlock` → `WarlockCharacter` with `invocationsKnown`
   - `rogue`/`fighter`/`ranger`/`cleric`/`wizard` → No resources (display-only from API)
4. Removing legacy resource fields that are no longer needed
5. Writing the migrated data back to storage

#### How to Run

```bash
npm run migrate-characters
```

#### Example Output

```
🚀 Starting character data migration...

📦 Starting LocalStorage migration...
⚠️  LocalStorage not available in this environment

🔥 Starting Firebase migration...
📊 Found 1 campaign(s) in Firebase

📁 Processing campaign: A cidade dourada (zBwwNStqiqyuHXdTb2DW)
  📊 Found 1 character(s)
  ✓ Migrated: Agerato (monk)

==================================================
✅ Firebase migration completed
   - Characters migrated: 1
==================================================

🎉 All migrations completed successfully!
```

#### Error Handling

The script includes comprehensive error handling:

- Characters that fail to migrate are logged but don't stop the entire migration
- Failed characters are left in their original state
- Detailed error messages show which characters failed and why

#### Safety

- The script uses a discriminated union type system to ensure type safety
- It validates the `classIndex` and throws an error for unknown classes
- The migration is idempotent (can be run multiple times safely)
- Firebase operations use `setDoc` to ensure data integrity

#### After Migration

After running the migration:

1. All characters will be in the new discriminated union format
2. Legacy resource fields that don't belong to the character's class will be removed
3. The application will use the new class-specific resource forms
4. Display-only features will be fetched from the API instead of being stored
