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

// Debug logs for production (temporary)
const isFirebaseConfigured = !!firebaseConfig.apiKey;

if (typeof window !== 'undefined') {
  console.log('Firebase Init Check:', {
    hasApiKey: isFirebaseConfigured,
    projectId: firebaseConfig.projectId,
    appCount: getApps().length
  });
}

const app = (getApps().length === 0 && isFirebaseConfigured) 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApp() : null);

if (!app && typeof window !== 'undefined') {
  console.error('FIREBASE FAILED TO INITIALIZE. Check NEXT_PUBLIC_FIREBASE_API_KEY in Vercel settings.');
}

// Provide dummy object if Firebase is not configured to avoid crashing during build
const db = app ? getFirestore(app) : ({} as any);
const auth = app ? getAuth(app) : ({} as any);
const storage = app ? getStorage(app) : ({} as any);

export { app, db, auth, storage };
