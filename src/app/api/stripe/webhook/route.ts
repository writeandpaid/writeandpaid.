
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseAdmin } from '@/lib/firebase.server';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
  
  const admin = getFirebaseAdmin();
  if (!admin) {
      console.error("Webhook: Firebase Admin not initialized.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Metadata is the secure way to pass your application's data
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;
    
    if (!userId || !courseId) {
      console.error('Webhook Error: Missing userId or courseId in session metadata.', session.id);
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    try {
      // Create an enrollment document to grant access
      const enrollmentRef = admin.db.collection('enrollments').doc();
      await enrollmentRef.set({
        userId,
        courseId,
        createdAt: new Date().toISOString(),
        orderId: session.id, // Use session ID as a reference to the order
      });
      
      console.log(`Successfully created enrollment for user ${userId} to course ${courseId}`);

      // Revalidate the course page and dashboard for the user
      revalidatePath(`/courses/${courseId}`);
      revalidatePath('/dashboard');
      
    } catch (error) {
      console.error('Failed to create enrollment:', error);
      return NextResponse.json({ error: 'Failed to update database.' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
