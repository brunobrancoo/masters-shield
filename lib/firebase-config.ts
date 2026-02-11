import { initializeApp, getApps } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB7ry3EeEDz5r-HcZJ3DQtnZRF8rVqihXk",
  authDomain: "masters-shield.firebaseapp.com",
  projectId: "masters-shield",
  storageBucket: "masters-shield.firebasestorage.app",
  messagingSenderId: "522829524294",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:522829524294:web:f2197c9b3ba9a379ea8947",
  measurementId: "G-CL79QLWFN7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Multiple tabs open, persistence can only be enabled in one tab");
  } else if (err.code === "unimplemented") {
    console.warn("The current browser does not support persistence");
  }
});

export const auth = getAuth(app);
