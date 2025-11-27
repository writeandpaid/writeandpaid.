
'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/layout/Write__Paid.svg';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LanderPageContent() {
  const router = useRouter();

  // The form submission is now handled on the client-side to simply redirect.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    router.push('/presentation');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <img src={Logo.src} alt="Write & Paid Logo" className="mx-auto h-24 w-auto" />
        <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900 max-w-2xl mx-auto">
          We teach you how to start earning up to $50-$75+/per hour by writing letters to select large businesses! All from the comfort of your home.
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Even if you have <span className="font-extrabold text-green-600">ZERO</span> experience!
        </p>
      </div>

      <Card className="mt-10 w-full max-w-lg shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold">Wanna Learn More About This Work From Home Opportunity?</h2>
            <p className="text-sm text-gray-600 mt-1">(No Recruiting, No Selling, No Posting Needed)</p>
            <p className="mt-2 font-semibold">If You Can Write, You CAN Make Money!</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="firstName" className="sr-only">First Name</Label>
              <Input id="firstName" name="firstName" type="text" required placeholder="First Name" />
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="Email Address" />
            </div>
            <div>
                <Label htmlFor="phone" className="sr-only">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Phone Number" />
            </div>
            <div>
              <Button type="submit" className="w-full h-12 text-lg font-bold btn-primary">
                SHOW ME MORE
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LanderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LanderPageContent />
        </Suspense>
    )
}
