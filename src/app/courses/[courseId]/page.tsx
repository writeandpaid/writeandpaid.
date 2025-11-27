

'use client';

import { useFirebase, useDoc, WithId, useCollection } from '@/firebase';
import { Course, Enrollment } from '@/types';
import { doc, collection, query, where } from 'firebase/firestore';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckoutButton } from '@/components/checkout-button';
import Link from 'next/link';
import { ArrowLeft, Lock, BadgeCheck, PlayCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function PurchaseSuccessAlert() {
    const searchParams = useSearchParams();
    const purchaseStatus = searchParams.get('purchase');

    if (purchaseStatus !== 'success') {
        return null;
    }

    return (
        <Alert className="mb-8 border-green-500 text-green-700 bg-green-50">
            <BadgeCheck className="h-4 w-4 !text-green-600" />
            <AlertTitle>Purchase Successful!</AlertTitle>
            <AlertDescription>
                You now have access to this course. Enjoy!
            </AlertDescription>
        </Alert>
    )
}

function CoursePageContent({ course, isEnrolled }: { course: WithId<Course>; isEnrolled: boolean }) {
    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        return `$${(price / 100).toFixed(2)}`;
    };

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/shop" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shop
                </Link>
            </div>
             <Suspense>
                <PurchaseSuccessAlert />
            </Suspense>
            <Card className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {isEnrolled && course.videoUrl ? (
                         <video controls src={course.videoUrl} className="w-full h-full object-cover">
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8 z-10">
                            <Lock className="w-16 h-16 text-white/50 mb-4" />
                            <h3 className="text-2xl font-bold text-white">Content Locked</h3>
                            <p className="text-white/80 mt-2">
                                Purchase this course to watch the video and get full access.
                            </p>
                        </div>
                    )}
                     {!isEnrolled && course.videoUrl && (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center blur-sm scale-105">
                           {/* This is a blurred placeholder, not the real video */}
                        </div>
                     )}
                     {!course.videoUrl && (
                         <div className="text-muted-foreground">No video preview available</div>
                     )}
                </div>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                    <CardDescription className="pt-2 text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardFooter className="bg-secondary/50 p-6 flex items-center justify-between">
                    <p className="text-3xl font-bold text-primary">{formatPrice(course.price)}</p>
                    {isEnrolled ? (
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <BadgeCheck />
                            <span>Enrolled</span>
                        </div>
                    ) : (
                        <CheckoutButton 
                            product={{
                                id: course.id,
                                name: course.title,
                                description: course.description,
                                price: course.price,
                                image: '', // No image for individual course checkout for now
                            }}
                        />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

function CoursePageSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
             <div className="mb-8">
                <Skeleton className="h-6 w-32" />
            </div>
            <Card>
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-full mt-2" />
                    <Skeleton className="h-5 w-2/3 mt-1" />
                </CardHeader>
                <CardFooter className="bg-secondary/50 p-6 flex items-center justify-between">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        </div>
    );
}

function CoursePageWrapper() {
    const params = useParams();
    const courseId = params.courseId as string;
    const { firestore, user, isUserLoading } = useFirebase();

    const courseRef = useMemo(() => {
        if (!firestore || !courseId) return null;
        return doc(firestore, 'courses', courseId);
    }, [firestore, courseId]);

    const enrollmentQuery = useMemo(() => {
        if (!firestore || !user || !courseId) return null;
        return query(
            collection(firestore, 'enrollments'),
            where('userId', '==', user.uid),
            where('courseId', '==', courseId)
        );
    }, [firestore, user, courseId]);

    const { data: course, isLoading: isCourseLoading, error: courseError } = useDoc<Course>(courseRef);
    const { data: enrollments, isLoading: isEnrollmentLoading, error: enrollmentError } = useCollection<Enrollment>(enrollmentQuery);

    const isLoading = isCourseLoading || isUserLoading || isEnrollmentLoading;
    const error = courseError || enrollmentError;
    const isEnrolled = !!(enrollments && enrollments.length > 0);

    if (isLoading) {
        return <CoursePageSkeleton />;
    }

    if (error) {
        return <div className="text-center py-20 text-destructive">Error: {error.message}</div>;
    }

    if (!course) {
        return <div className="text-center py-20 text-muted-foreground">Course not found.</div>;
    }

    return <CoursePageContent course={course} isEnrolled={isEnrolled} />;
}


export default function CoursePage() {
    return (
        <Suspense fallback={<CoursePageSkeleton />}>
            <CoursePageWrapper />
        </Suspense>
    )
}
