#!/usr/bin/env tsx
/**
 * Character Data Migration Script
 *
 * Migrates character data from the old LegacyPlayableCharacter format to the new
 * discriminated union PlayableCharacter format.
 *
 * This script handles both:
 * 1. LocalStorage data (development/testing)
 * 2. Firebase Firestore data (production)
 *
 * Migration Rules:
 * - Sorcerer → sorceryPoints: SorcererResources
 * - Paladin → channelDivinityCharges: PaladinResources
 * - Monk → kiPoints: MonkResources
 * - Barbarian → rages: BarbarianResources
 * - Bard → inspiration: BardResources
 * - Druid → wildShapeForm?: string
 * - Warlock → invocationsKnown: WarlockResources
 * - Rogue/Fighter/Ranger/Cleric/Wizard → no resources (display-only features from API)
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  query,
} from "firebase/firestore";
import type {
  PlayableCharacter,
  LegacyPlayableCharacter,
  SorcererCharacter,
  PaladinCharacter,
  MonkCharacter,
  BarbarianCharacter,
  BardCharacter,
  DruidCharacter,
  WarlockCharacter,
  RogueCharacter,
  FighterCharacter,
  RangerCharacter,
  ClericCharacter,
  WizardCharacter,
  PointPool,
} from "../lib/interfaces/interfaces";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB7ry3EeEDz5r-HcZJ3DQtnZRF8rVqihXk",
  authDomain: "masters-shield.firebaseapp.com",
  projectId: "masters-shield",
  storageBucket: "masters-shield.firebasestorage.app",
  messagingSenderId: "522829524294",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:522829524294:web:f2197c9b3ba9a379ea8947",
  measurementId: "G-CL79QLWFN7",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/**
 * Type guard to check if a character is a Sorcerer
 */
function isSorcererCharacter(
  character: PlayableCharacter,
): character is SorcererCharacter {
  return character.classIndex === "sorcerer";
}

/**
 * Type guard to check if a character is a Paladin
 */
function isPaladinCharacter(
  character: PlayableCharacter,
): character is PaladinCharacter {
  return character.classIndex === "paladin";
}

/**
 * Type guard to check if a character is a Monk
 */
function isMonkCharacter(character: PlayableCharacter): character is MonkCharacter {
  return character.classIndex === "monk";
}

/**
 * Type guard to check if a character is a Barbarian
 */
function isBarbarianCharacter(
  character: PlayableCharacter,
): character is BarbarianCharacter {
  return character.classIndex === "barbarian";
}

/**
 * Type guard to check if a character is a Bard
 */
function isBardCharacter(character: PlayableCharacter): character is BardCharacter {
  return character.classIndex === "bard";
}

/**
 * Type guard to check if a character is a Druid
 */
function isDruidCharacter(
  character: PlayableCharacter,
): character is DruidCharacter {
  return character.classIndex === "druid";
}

/**
 * Type guard to check if a character is a Warlock
 */
function isWarlockCharacter(
  character: PlayableCharacter,
): character is WarlockCharacter {
  return character.classIndex === "warlock";
}

/**
 * Type guard to check if a character is a Rogue
 */
function isRogueCharacter(
  character: PlayableCharacter,
): character is RogueCharacter {
  return character.classIndex === "rogue";
}

/**
 * Type guard to check if a character is a Fighter
 */
function isFighterCharacter(
  character: PlayableCharacter,
): character is FighterCharacter {
  return character.classIndex === "fighter";
}

/**
 * Type guard to check if a character is a Ranger
 */
function isRangerCharacter(
  character: PlayableCharacter,
): character is RangerCharacter {
  return character.classIndex === "ranger";
}

/**
 * Type guard to check if a character is a Cleric
 */
function isClericCharacter(
  character: PlayableCharacter,
): character is ClericCharacter {
  return character.classIndex === "cleric";
}

/**
 * Type guard to check if a character is a Wizard
 */
function isWizardCharacter(
  character: PlayableCharacter,
): character is WizardCharacter {
  return character.classIndex === "wizard";
}

/**
 * Convert a legacy character to the new discriminated union format
 */
function migrateCharacter(
  legacyCharacter: LegacyPlayableCharacter,
): PlayableCharacter {
  const { classIndex } = legacyCharacter;
  const baseCharacter = { ...legacyCharacter };

  // Remove all legacy resource fields - they'll be added back only for the correct class
  delete (baseCharacter as any).sorceryPoints;
  delete (baseCharacter as any).kiPoints;
  delete (baseCharacter as any).rages;
  delete (baseCharacter as any).inspiration;
  delete (baseCharacter as any).channelDivinityCharges;
  delete (baseCharacter as any).invocationsKnown;
  delete (baseCharacter as any).wildShapeForm;
  delete (baseCharacter as any).featResources;

  // Map to class-specific type based on classIndex
  switch (classIndex) {
    case "sorcerer": {
      const sorcerer: SorcererCharacter = {
        ...baseCharacter,
        classIndex: "sorcerer",
        sorceryPoints: legacyCharacter.sorceryPoints,
      };
      return sorcerer;
    }

    case "paladin": {
      const paladin: PaladinCharacter = {
        ...baseCharacter,
        classIndex: "paladin",
        channelDivinityCharges: legacyCharacter.channelDivinityCharges,
      };
      return paladin;
    }

    case "monk": {
      const monk: MonkCharacter = {
        ...baseCharacter,
        classIndex: "monk",
        kiPoints: legacyCharacter.kiPoints,
      };
      return monk;
    }

    case "barbarian": {
      const barbarian: BarbarianCharacter = {
        ...baseCharacter,
        classIndex: "barbarian",
        rages: legacyCharacter.rages,
      };
      return barbarian;
    }

    case "bard": {
      const bard: BardCharacter = {
        ...baseCharacter,
        classIndex: "bard",
        inspiration: legacyCharacter.inspiration,
      };
      return bard;
    }

    case "druid": {
      const druid: DruidCharacter = {
        ...baseCharacter,
        classIndex: "druid",
        wildShapeForm: legacyCharacter.wildShapeForm,
      };
      return druid;
    }

    case "warlock": {
      const warlock: WarlockCharacter = {
        ...baseCharacter,
        classIndex: "warlock",
        invocationsKnown: legacyCharacter.invocationsKnown,
      };
      return warlock;
    }

    case "rogue": {
      const rogue: RogueCharacter = {
        ...baseCharacter,
        classIndex: "rogue",
      };
      return rogue;
    }

    case "fighter": {
      const fighter: FighterCharacter = {
        ...baseCharacter,
        classIndex: "fighter",
      };
      return fighter;
    }

    case "ranger": {
      const ranger: RangerCharacter = {
        ...baseCharacter,
        classIndex: "ranger",
      };
      return ranger;
    }

    case "cleric": {
      const cleric: ClericCharacter = {
        ...baseCharacter,
        classIndex: "cleric",
      };
      return cleric;
    }

    case "wizard": {
      const wizard: WizardCharacter = {
        ...baseCharacter,
        classIndex: "wizard",
      };
      return wizard;
    }

    default:
      // Unknown class - throw error with details
      throw new Error(
        `Unknown classIndex: "${classIndex}" for character "${legacyCharacter.name}" (id: ${legacyCharacter.id})`,
      );
  }
}

/**
 * Migrate LocalStorage character data
 */
async function migrateLocalStorage(): Promise<void> {
  console.log("📦 Starting LocalStorage migration...");

  if (typeof localStorage === "undefined") {
    console.log("⚠️  LocalStorage not available in this environment");
    return;
  }

  const STORAGE_KEY = "masters-shield";

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log("✅ No LocalStorage data found");
      return;
    }

    const parsed = JSON.parse(data);
    const playableCharacters = parsed.playableCharacters || [];

    if (playableCharacters.length === 0) {
      console.log("✅ No characters to migrate in LocalStorage");
      return;
    }

    console.log(`📊 Found ${playableCharacters.length} character(s) in LocalStorage`);

    // Migrate each character
    const migratedCharacters = playableCharacters.map((char: any) => {
      try {
        const migrated = migrateCharacter(char);
        console.log(`  ✓ Migrated: ${char.name} (${char.classIndex})`);
        return migrated;
      } catch (error) {
        console.error(`  ✗ Failed to migrate: ${char.name} - ${error}`);
        return char; // Keep original if migration fails
      }
    });

    // Save back to LocalStorage
    parsed.playableCharacters = migratedCharacters;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

    console.log("✅ LocalStorage migration completed successfully");
  } catch (error) {
    console.error("❌ LocalStorage migration failed:", error);
    throw error;
  }
}

/**
 * Migrate Firebase Firestore character data
 */
async function migrateFirebase(): Promise<void> {
  console.log("🔥 Starting Firebase migration...");

  try {
    // Get all campaigns
    const campaignsSnapshot = await getDocs(collection(db, "campaigns"));

    if (campaignsSnapshot.empty) {
      console.log("✅ No campaigns found in Firebase");
      return;
    }

    const campaigns = campaignsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📊 Found ${campaigns.length} campaign(s) in Firebase`);

    let totalCharactersMigrated = 0;
    let totalCharactersFailed = 0;

    // Migrate each campaign's characters
    for (const campaign of campaigns) {
      const campaignId = campaign.id as string;
      const campaignName = (campaign as any).name || campaignId;

      console.log(`\n📁 Processing campaign: ${campaignName} (${campaignId})`);

      const charactersSnapshot = await getDocs(
        collection(db, "campaigns", campaignId, "playableCharacters"),
      );

      if (charactersSnapshot.empty) {
        console.log("  ℹ️  No characters in this campaign");
        continue;
      }

      const characters = charactersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`  📊 Found ${characters.length} character(s)`);

      // Migrate each character
      for (const character of characters as LegacyPlayableCharacter[]) {
        try {
          const migrated = migrateCharacter(character);
          const characterRef = doc(
            db,
            "campaigns",
            campaignId,
            "playableCharacters",
            character.id,
          );

          await setDoc(characterRef, migrated, { merge: false });

          console.log(
            `  ✓ Migrated: ${character.name} (${character.classIndex})`,
          );
          totalCharactersMigrated++;
        } catch (error) {
          console.error(
            `  ✗ Failed to migrate: ${character.name} - ${error}`,
          );
          totalCharactersFailed++;
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Firebase migration completed`);
    console.log(`   - Characters migrated: ${totalCharactersMigrated}`);
    if (totalCharactersFailed > 0) {
      console.log(`   - Characters failed: ${totalCharactersFailed}`);
    }
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Firebase migration failed:", error);
    throw error;
  }
}

/**
 * Run the migration for both LocalStorage and Firebase
 */
async function runMigration(): Promise<void> {
  console.log("🚀 Starting character data migration...\n");

  try {
    // Migrate LocalStorage
    await migrateLocalStorage();
    console.log("");

    // Migrate Firebase
    await migrateFirebase();
    console.log("");

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("\n💥 Migration failed with error:", error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
