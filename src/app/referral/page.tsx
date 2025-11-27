'use client';

import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/types';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareButton } from '@/components/ShareButton';
import { BarChart, Gift, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ReferralPageSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-10" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <div className="grid md:grid-cols-2 gap-6 pt-6">
                        <Skeleton className="h-24 rounded-lg" />
                        <Skeleton className="h-24 rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ReferralPage() {
    const { user, isUserLoading, firestore } = useFirebase();
    const router = useRouter();

    const userProfileRef = useMemo(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    if (!isUserLoading && !user) {
        router.replace('/signin');
        return <ReferralPageSkeleton />;
    }

    const isLoading = isUserLoading || isProfileLoading;

    if (isLoading) {
        return (
             <div className="py-12 md:py-16 min-h-full">
                <ReferralPageSkeleton />
            </div>
        );
    }
    
    if (!userProfile) {
        return (
            <div className="py-12 md:py-16 min-h-full text-center">
                <h2 className="text-2xl font-bold">Could not load profile.</h2>
                <p className="text-muted-foreground">Please try signing in again.</p>
                <Button onClick={() => router.push('/signin')} className="mt-4">Go to Sign In</Button>
            </div>
        )
    }

    return (
        <div className="py-12 md:py-16 bg-secondary/20 min-h-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                 <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black mb-2">
                        Referrals
                    </h1>
                    <p className="text-muted-foreground">
                        Share your link to earn rewards and track your progress here.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Gift className="h-6 w-6 text-primary" />
                           Your Referral Link
                        </CardTitle>
                        <CardDescription>
                            Share this unique link with friends. When they sign up, you'll earn points!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       <ShareButton code={userProfile.referralCode} />
                       
                       <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
                                    <BarChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userProfile.referralCount || 0}</div>
                                    <p className="text-xs text-muted-foreground">friends have joined using your code</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userProfile.rewardPoints || 0}</div>
                                    <p className="text-xs text-muted-foreground">points earned from referrals</p>
                                </CardContent>
                            </Card>
                       </div>
                    </CardContent>
                </Card>
                 <div className="mt-8 text-center">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}