
'use server';

// This file is no longer needed as all Firebase logic has been moved to the client-side
// to resolve the persistent server authentication issues. Keeping it empty prevents
// any accidental imports or usage.

export async function getFirebaseAdmin() {
    console.error("[getFirebaseAdmin] This function is deprecated and should not be called. Server-side admin is disabled.");
    return null;
}
