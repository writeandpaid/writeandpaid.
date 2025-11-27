
'use client';

import { useFirebase } from '@/firebase';
import { useDoc, WithId } from '@/firebase/firestore/use-doc';
import { UserProfile, Course } from '@/types';
import { doc, collection } from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareButton } from '@/components/ShareButton';
import { BarChart, BookOpen, Share2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DashboardSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
            </div>
            <div className="mt-12">
                <Skeleton className="h-8 w-1/4 mb-6" />
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { user, isUserLoading, firestore } = useFirebase();
    const router = useRouter();

    const userProfileRef = useMemo(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    // This effect handles redirecting unauthenticated users.
    useEffect(() => {
        // Wait until the loading state is resolved.
        if (!isUserLoading && !user) {
            router.replace('/signin');
        }
    }, [isUserLoading, user, router]);

    const isLoading = isUserLoading || isProfileLoading;

    // While loading or if there's no user, show a skeleton.
    // The useEffect will handle the redirect.
    if (isLoading || !user) {
        return (
            <div className="py-12 md:py-16 min-h-full">
                <DashboardSkeleton />
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-black mb-2">
                    Welcome Back, {userProfile.firstName}!
                </h1>
                <p className="text-muted-foreground mb-8">
                    Here's a snapshot of your account and progress.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mb-4">Share this code to earn rewards.</p>
                            <ShareButton code={userProfile.referralCode} />
                        </CardContent>
                    </Card>
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
                
                <div className="mt-12">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">My Courses</h2>
                    {/* This is a placeholder. A real implementation would fetch user's enrolled courses. */}
                    <div className="space-y-4">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Paid Per Letter Program</CardTitle>
                                    <CardDescription>Your foundational course to start earning.</CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="#">Start Learning</Link>
                                </Button>
                            </CardHeader>
                        </Card>
                         <Card className="border-dashed bg-transparent">
                            <CardHeader className="text-center">
                               <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                                <CardTitle className="text-lg">Ready for more?</CardTitle>
                                <CardDescription>Expand your skills with our advanced courses.</CardDescription>
                                <div className="pt-2">
                                     <Button asChild variant="outline">
                                        <Link href="/shop">Browse Course Shop</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
