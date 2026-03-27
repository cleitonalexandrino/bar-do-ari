import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if we have at least the API Key to avoid build errors in Vercel
const isFirebaseConfigured = !!firebaseConfig.apiKey;

const app = (getApps().length === 0 && isFirebaseConfigured) 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApp() : null);

// Provide dummy object if Firebase is not configured to avoid crashing during build
const db = app ? getFirestore(app) : ({} as any);
const auth = app ? getAuth(app) : ({} as any);
const storage = app ? getStorage(app) : ({} as any);

export { app, db, auth, storage };
