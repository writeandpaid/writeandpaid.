
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="py-20 md:py-28 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <MailCheck className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className="mt-4 text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription>
                        Thanks for signing up! A verification link has been sent to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {email && (
                        <p className="text-muted-foreground">
                            Please click the link sent to <span className="font-semibold text-foreground">{decodeURIComponent(email)}</span> to activate your account.
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        You can close this window. Once your email is verified, you can sign in.
                    </p>
                    <Button asChild>
                        <Link href="/signin">Back to Sign In</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
