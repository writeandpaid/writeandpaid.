
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider, type FirebaseContextState } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Only initialize Firebase on the client-side
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []); // Empty dependency array ensures this runs only once on mount

  // During SSR or if initialization fails, we provide a null/default context.
  if (!firebaseServices) {
    // Provide a default, "unauthenticated" context value during SSR.
    const ssrContextValue: FirebaseContextState = {
      areServicesAvailable: false,
      firebaseApp: null,
      firestore: null,
      auth: null,
      storage: null,
      user: null,
      isUserLoading: true, // Assume loading on the server
      userError: null,
    };
    return (
        <FirebaseProvider value={ssrContextValue}>
            {children}
        </FirebaseProvider>
    );
  }

  // On the client, provide the fully initialized context.
  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
      storage={firebaseServices.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
