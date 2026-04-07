import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDuPcVD-xSCEKJ0osXUHp0kKdI831zaAIU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "enlightened-wiki-78d5d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "enlightened-wiki-78d5d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "enlightened-wiki-78d5d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "255615358990",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:255615358990:web:279f31d2cd33bf4c67445f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FPZVZ54N8X"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize the services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };

import { terminate, clearIndexedDbPersistence } from "firebase/firestore";

// Add this temporary "Nuke" function
export const nukeCache = async () => {
  await terminate(db);
  await clearIndexedDbPersistence(db);
  console.log("Firestore Cache Cleared");
};