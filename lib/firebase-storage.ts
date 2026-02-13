import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  queryEqual,
} from "firebase/firestore";
import { db } from "./firebase-config";
import type { Monster, PlayableCharacter, NPC, Homebrew } from "@/lib/interfaces/interfaces";
import { generateInviteCode } from "./utils/invite-code";
import { sanitizeForFirebase } from "@/lib/interfaces/interfaces";

export interface Campaign {
  id: string;
  name: string;
  masterId: string;
  inviteCode: string;
  members: string[];
}

export async function createCampaign(
  name: string,
  userId: string,
): Promise<string> {
  const campaignRef = await addDoc(collection(db, "campaigns"), {
    name,
    masterId: userId,
    members: [userId],
    inviteCode: generateInviteCode(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return campaignRef.id;
}

export async function getCampaignMasterId(campaignId: string) {
  const campaignRef = doc(db, "campaigns", campaignId);
  const snapshot = await getDoc(campaignRef);

  if (!snapshot.exists()) {
    throw new Error("Campaign not found");
  }

  return snapshot.data().masterId as string;
}

export async function joinCampaign(
  campaignId: string,
  userId: string,
): Promise<void> {
  const campaignRef = doc(db, "campaigns", campaignId);
  const campaign = await getDoc(campaignRef);

  if (!campaign.exists()) {
    throw new Error("Campanha não encontrada");
  }

  const members = campaign.data()?.members || [];
  if (members.includes(userId)) {
    throw new Error("Você já é membro desta campanha");
  }

  await updateDoc(campaignRef, {
    members: [...members, userId],
    updatedAt: serverTimestamp(),
  });
}

export async function getCampaign(campaignId: string): Promise<Campaign | null> {
  const campaignRef = doc(db, "campaigns", campaignId);
  const snapshot = await getDoc(campaignRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Campaign;
}

export async function regenerateInviteCode(
  campaignId: string,
): Promise<string> {
  const campaignRef = doc(db, "campaigns", campaignId);
  const newCode = generateInviteCode();
  await updateDoc(campaignRef, {
    inviteCode: newCode,
    updatedAt: serverTimestamp(),
  });
  return newCode;
}

export function getPlayableCharacters(campaignId: string) {
  return getDocs(collection(db, "campaigns", campaignId, "playableCharacters"));
}

export async function getPlayableCharacter(
  campaignId: string,
  playableCharacterId: string,
): Promise<PlayableCharacter | null> {
  const playableCharacterRef = doc(db, "campaigns", campaignId, "playableCharacters", playableCharacterId);
  const snapshot = await getDoc(playableCharacterRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() }) as PlayableCharacter
    : null;
}

export async function createPlayableCharacter(
  campaignId: string,
  playableCharacter: Omit<PlayableCharacter, "id">,
): Promise<string> {
  const playableCharacterRef = await addDoc(
    collection(db, "campaigns", campaignId, "playableCharacters"),
    {
      ...sanitizeForFirebase(playableCharacter),
      createdAt: serverTimestamp(),
    },
  );
  return playableCharacterRef.id;
}

export async function updatePlayableCharacter(
  campaignId: string,
  playableCharacterId: string,
  updates: Partial<PlayableCharacter>,
): Promise<void> {
  await updateDoc(
    doc(db, "campaigns", campaignId, "playableCharacters", playableCharacterId),
    sanitizeForFirebase(updates),
  );
}

export async function updatePlayableCharacterOrSet(
  campaignId: string,
  playableCharacterId: string,
  updates: Partial<PlayableCharacter>,
): Promise<void> {
  await setDoc(
    doc(db, "campaigns", campaignId, "playableCharacters", playableCharacterId),
    sanitizeForFirebase(updates),
    { merge: true },
  );
}

export async function deletePlayableCharacter(
  campaignId: string,
  playableCharacterId: string,
): Promise<void> {
  await deleteDoc(doc(db, "campaigns", campaignId, "playableCharacters", playableCharacterId));
}

export function getMonsters(campaignId: string) {
  return getDocs(collection(db, "campaigns", campaignId, "monsters"));
}

export async function getMonster(
  campaignId: string,
  monsterId: string,
): Promise<Monster | null> {
  const monsterRef = doc(db, "campaigns", campaignId, "monsters", monsterId);
  const snapshot = await getDoc(monsterRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Monster)
    : null;
}

export async function createMonster(
  campaignId: string,
  monster: Omit<Monster, "id">,
): Promise<string> {
  const monsterRef = await addDoc(
    collection(db, "campaigns", campaignId, "monsters"),
    sanitizeForFirebase(monster),
  );
  return monsterRef.id;
}

export async function updateMonster(
  campaignId: string,
  monsterId: string,
  updates: Partial<Monster>,
): Promise<void> {
  await updateDoc(
    doc(db, "campaigns", campaignId, "monsters", monsterId),
    sanitizeForFirebase(updates),
  );
}

export async function deleteMonster(
  campaignId: string,
  monsterId: string,
): Promise<void> {
  await deleteDoc(doc(db, "campaigns", campaignId, "monsters", monsterId));
}

export function getNPCs(campaignId: string) {
  return getDocs(collection(db, "campaigns", campaignId, "npcs"));
}

export async function getNPC(
  campaignId: string,
  npcId: string,
): Promise<NPC | null> {
  const npcRef = doc(db, "campaigns", campaignId, "npcs", npcId);
  const snapshot = await getDoc(npcRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as NPC)
    : null;
}

export async function createNPC(
  campaignId: string,
  npc: Omit<NPC, "id">,
): Promise<string> {
  const npcRef = await addDoc(
    collection(db, "campaigns", campaignId, "npcs"),
    sanitizeForFirebase(npc),
  );
  return npcRef.id;
}

export async function updateNPC(
  campaignId: string,
  npcId: string,
  updates: Partial<NPC>,
): Promise<void> {
  await updateDoc(doc(db, "campaigns", campaignId, "npcs", npcId), sanitizeForFirebase(updates));
}

export async function deleteNPC(
  campaignId: string,
  npcId: string,
): Promise<void> {
  await deleteDoc(doc(db, "campaigns", campaignId, "npcs", npcId));
}

export function onPlayableCharactersChange(
  campaignId: string,
  callback: (playableCharacters: PlayableCharacter[]) => void,
) {
  const q = collection(db, "campaigns", campaignId, "playableCharacters");
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const playableCharacters = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as PlayableCharacter,
    );
    callback(playableCharacters);
  });
  return unsubscribe;
}

export function onMonstersChange(
  campaignId: string,
  callback: (monsters: Monster[]) => void,
) {
  const q = collection(db, "campaigns", campaignId, "monsters");
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const monsters = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Monster,
    );
    callback(monsters);
  });
  return unsubscribe;
}

export function onNPCsChange(
  campaignId: string,
  callback: (npcs: NPC[]) => void,
) {
  const q = collection(db, "campaigns", campaignId, "npcs");
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const npcs = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as NPC,
    );
    callback(npcs);
  });
  return unsubscribe;
}

export function getHomebrews(campaignId: string) {
  return getDocs(collection(db, "campaigns", campaignId, "homebrews"));
}

export async function createHomebrew(
  campaignId: string,
  homebrew: Omit<Homebrew, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const homebrewRef = await addDoc(
    collection(db, "campaigns", campaignId, "homebrews"),
    {
      ...sanitizeForFirebase(homebrew),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
  return homebrewRef.id;
}

export function onHomebrewsChange(
  campaignId: string,
  callback: (homebrews: Homebrew[]) => void,
) {
  const q = collection(db, "campaigns", campaignId, "homebrews");
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const homebrews = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Homebrew,
    );
    callback(homebrews);
  });
  return unsubscribe;
}
