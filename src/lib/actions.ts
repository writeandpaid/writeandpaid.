
'use server';

import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  runTransaction,
  serverTimestamp,
  increment,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { initializeFirebase } from '@/firebase';
import { getAuth, setCustomUserClaims } from 'firebase/auth';
import { getFirebaseAdmin } from './firebase.server';


// This file is being refactored. The functions below are now either handled
// on the client or are being deprecated because the server-side auth is unreliable.
// We will move Firebase operations to client-side components and hooks where
// the user's auth context is available and secure via Firestore rules.

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

// Hardcoded for now as per user request to simplify debugging.
const ADMIN_EMAIL = 'admin@example.com';
const REWARD_POINTS_PER_REFERRAL = 100;

export async function captureLead(data: {
  firstName: string;
  email: string;
  phone?: string;
  ref?: string | null;
}) {
  // This action is now disabled as it depends on an unauthenticated write
  // which is better handled on the client if needed, or removed.
  console.log('[captureLead] This server action is disabled.');
  return { success: true };
}

export async function finishSignUp(uid: string, data: any) {
    const context = 'finishSignUp';

    const admin = await getFirebaseAdmin();
    if (!admin) {
        console.error(`[${context}] Server authentication error. Cannot save user profile.`);
        return { success: false, message: 'Server authentication error. Cannot save user profile.' };
    }

    const { db, auth } = admin;
    
    if (!data.email) {
        return { success: false, message: 'Email is required.' };
    }

    const referralCode = nanoid();
    const isNewUserAdmin = data.email === ADMIN_EMAIL;

    const userRef = db.collection('users').doc(uid);
    const referralCodeRef = db.collection('referralCodes').doc(referralCode);

    try {
        await userRef.set({
            ...data,
            referralCode,
            referralCount: 0,
            rewardPoints: 0,
            createdAt: new Date().toISOString(),
            isAdmin: isNewUserAdmin,
        }, { merge: true });

        await referralCodeRef.set({
            uid,
            createdAt: new Date().toISOString(),
        });


        if (isNewUserAdmin) {
            await auth.setCustomUserClaims(uid, { admin: true });
        }

        revalidatePath('/admin');
        if (isNewUserAdmin) {
            revalidatePath('/admin', 'layout');
        }

        return { success: true, isAdmin: isNewUserAdmin };

    } catch (error: any) {
        console.error(`[${context}] Error:`, error);
        // Cleanup orphaned auth user
        try {
            await auth.deleteUser(uid);
        } catch (delErr) {
             console.error(`[${context}] CRITICAL: Failed to delete orphaned user ${uid}.`);
        }
        
        return { 
            success: false, 
            message: `Failed to save user data. Please try again. Server Error: ${error.message}` 
        };
    }
}


export async function getReferrerName(refCode: string | null): Promise<string | null> {
  if (!refCode) return null;
  const admin = await getFirebaseAdmin();
  if (!admin) {
    return null;
  }
  try {
    const referralCodeDoc = await admin.db.collection('referralCodes').doc(refCode).get();
    if (!referralCodeDoc.exists) {
        return null;
    }
    const referrerUid = referralCodeDoc.data()?.uid;
    if (!referrerUid) {
        return null;
    }
    const userDoc = await admin.db.collection('users').doc(referrerUid).get();
    if (!userDoc.exists) {
        return null;
    }
    return userDoc.data()?.firstName || null;
  } catch (error) {
    return null;
  }
}

export async function addCourse(data: {
  title: string;
  description: string;
  videoUrl: string;
  module: string;
  order: number;
  price: number;
}) {
  const admin = await getFirebaseAdmin();
  if (!admin) {
    return { success: false, message: 'Server authentication error.' };
  }

  try {
    const courseRef = admin.db.collection('courses').doc();
    await courseRef.set({
      ...data,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath(`/courses/${courseRef.id}`);
    return { success: true, courseId: courseRef.id };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to add course.' };
  }
}

export async function createPayout(userId: string, amount: number) {
  const admin = await getFirebaseAdmin();
  if (!admin) {
    return { success: false, message: 'Server authentication error.' };
  }

  try {
    await admin.db.runTransaction(async (transaction) => {
      const userRef = admin.db.collection('users').doc(userId);
      const payoutRef = admin.db.collection('payouts').doc();
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists || (userDoc.data()?.rewardPoints || 0) < amount) {
          throw new Error("Insufficient points for this payout.");
      }
      transaction.set(payoutRef, {
        userId,
        amount,
        createdAt: new Date().toISOString(),
        status: 'completed',
      });
      transaction.update(userRef, { rewardPoints: 0 });
    });
    revalidatePath('/admin/payouts');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create payout.' };
  }
}

export async function createCheckoutSession(data: { product: any; userId: string; }) {
    let stripe: import('stripe');
    try {
        const Stripe = (await import('stripe')).default;
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set.');
        }
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-06-20',
        });
    } catch (e) {
        const err = e as Error;
        return { error: err.message };
    }

    const { product, userId } = data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
        return { error: 'NEXT_PUBLIC_SITE_URL is not set.' };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: product.image ? [product.image] : [],
                    },
                    unit_amount: product.price,
                },
                quantity: 1,
            }],
            metadata: {
                userId: userId,
                courseId: product.id,
            },
            success_url: `${siteUrl}/courses/${product.id}?purchase=success`,
            cancel_url: `${siteUrl}/courses/${product.id}`,
        });
        
        return { sessionId: session.id };

    } catch (error: any) {
        return { error: error.message || 'Could not create checkout session.' };
    }
}

    