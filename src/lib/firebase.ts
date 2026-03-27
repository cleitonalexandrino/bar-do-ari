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
const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (typeof window !== 'undefined') {
  console.log('--- Firebase Debug ---');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Has API Key:', !!firebaseConfig.apiKey);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('----------------------');
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
  console.warn('⚠️ FIREBASE NOT INITIALIZED: Using fallback mode. Please check Vercel environment variables.');
}

export { app, db, auth, storage };
