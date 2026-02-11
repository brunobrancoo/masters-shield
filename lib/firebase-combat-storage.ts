import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase-config";
import type { CombatData } from "@/lib/combat-storage";

export async function getCombat(campaignId: string): Promise<CombatData | null> {
  const combatRef = doc(db, "campaigns", campaignId, "combat", "active");
  const snapshot = await getDoc(combatRef);
  return snapshot.exists() ? snapshot.data() as CombatData : null;
}

export async function updateCombat(campaignId: string, updates: Partial<CombatData>): Promise<void> {
  const combatRef = doc(db, "campaigns", campaignId, "combat", "active");
  await setDoc(combatRef, updates, { merge: true });
}

export async function clearCombat(campaignId: string): Promise<void> {
  await deleteDoc(doc(db, "campaigns", campaignId, "combat", "active"));
}

export function onCombatChange(campaignId: string, callback: (combat: CombatData | null) => void) {
  const combatRef = doc(db, "campaigns", campaignId, "combat", "active");
  const unsubscribe = onSnapshot(combatRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() as CombatData : null);
  });
  return unsubscribe;
}
