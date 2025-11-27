
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { CheckoutButton } from '@/components/checkout-button';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Course } from '@/types';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function ShopPageSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter className="flex items-center justify-between p-6 bg-secondary/50">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


export default function ShopPage() {
  const firestore = useFirestore();

  const coursesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'courses'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: courses, isLoading, error } = useCollection<Course>(coursesQuery);

  const defaultCourseImage = placeholderImages.find(p => p.id === 'library-books');

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black">Expand Your Skills</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your handwriting business to the next level with our advanced courses and workshops.
          </p>
        </div>

        {isLoading && <ShopPageSkeleton />}

        {error && <div className="text-center text-destructive">Error loading courses: {error.message}</div>}

        {!isLoading && !error && courses && (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                 <Link href={`/courses/${course.id}`} className="block">
                    <div className="relative aspect-video">
                        <Image 
                            src={defaultCourseImage?.imageUrl ?? '/placeholder.jpg'} 
                            alt={course.title} 
                            fill 
                            className="object-cover" 
                            data-ai-hint={defaultCourseImage?.imageHint ?? 'library books'}
                        />
                    </div>
                </Link>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/courses/${course.id}`} className="hover:underline">
                      {course.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="pt-2 min-h-[60px]">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardFooter className="flex items-center justify-between p-6 bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{formatPrice(course.price)}</p>
                  <CheckoutButton 
                    product={{
                      id: course.id,
                      name: course.title,
                      description: course.description,
                      price: course.price,
                      image: defaultCourseImage?.imageUrl ?? '',
                    }}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && courses?.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold text-muted-foreground">No Courses Available Yet</h3>
            <p className="mt-2 text-muted-foreground">Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
