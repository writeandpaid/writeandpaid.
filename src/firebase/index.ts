'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firestoreInstance: any = null;

export function initializeFirebase() {
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is missing. Please check your .env file.");
    return null;
  }
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const sdks = getSdks(app);

  if (sdks.firestore && !firestoreInstance) {
      firestoreInstance = sdks.firestore;
      if (typeof window !== 'undefined') {
        enableIndexedDbPersistence(firestoreInstance).catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn('Firestore persistence failed: multiple tabs open.');
          } else if (err.code == 'unimplemented') {
            console.warn('Firestore persistence not available in this browser.');
          }
        });
      }
  }
  
  return sdks;
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
