
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/lib/actions';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

// Make sure to use your actual publishable key from your .env.local file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Product {
  id: string; // Course ID
  name: string;
  description: string;
  price: number; // Price in cents
  image: string;
}

interface CheckoutButtonProps {
  product: Product;
}

export function CheckoutButton({ product }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useFirebase();
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Not Signed In',
            description: 'You must be signed in to purchase a course.',
        });
        router.push('/signin');
        setIsLoading(false);
        return;
    }

    try {
      // Pass user and product IDs for the webhook to use
      const { sessionId, error } = await createCheckoutSession({
        product,
        userId: user.uid,
      });

      if (error || !sessionId) {
        throw new Error(error || 'Failed to create checkout session.');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        console.error('Stripe redirection error:', stripeError);
        toast({
          variant: 'destructive',
          title: 'Checkout Error',
          description: stripeError.message || 'Could not redirect to Stripe.',
        });
      }
    } catch (err: any) {
      console.error('Checkout failed:', err);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: err.message || 'Could not initiate checkout.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className="btn-primary">
      {isLoading ? 'Processing...' : 'Buy Now'}
    </Button>
  );
}
