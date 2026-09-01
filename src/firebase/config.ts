import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCJrqtcBRzM7J3nwJyqToFsKAs6INtdkVc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tanovax-d6226.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tanovax-d6226',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tanovax-d6226.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '757694097727',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:757694097727:web:30922dbfd43576794c8b8a',
};

// Real Firebase is now 100% active
export const isFirebaseConfigured = true;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
