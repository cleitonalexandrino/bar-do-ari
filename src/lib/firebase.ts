import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Fallback keys for Production (Bar do Ari)
// Use environment variables if available, otherwise fall back to hardcoded production keys
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBiyk2DYyyOyjlJF3TnC0ArpY-lIvpnO54",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bar-do-ari.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bar-do-ari",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bar-do-ari.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "977707863973",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:977707863973:web:b5057ce812f7a5b4bfa24c"
};

// Debug logs
const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (typeof window !== 'undefined') {
  console.log('--- Firebase Status ---');
  console.log('Mode:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Vercel Env' : 'Production Fallback');
  console.log('Project:', firebaseConfig.projectId);
  console.log('-----------------------');
}

let app;
try {
  if (isFirebaseConfigured) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
} catch (error) {
  console.error('Firebase Initialization Error:', error);
}

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const storage = app ? getStorage(app) : null;

if (!app && typeof window !== 'undefined') {
  console.warn('⚠️ FIREBASE NOT INITIALIZED. Please check configuration.');
}

export { app, db, auth, storage };
