'use client';

import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/types';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminLoadingSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted">
      <div className="w-full max-w-md p-8 text-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="pt-8 space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}


export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();

  const userProfileRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    // Wait until both user auth state and profile data are loaded to make a decision
    if (!isUserLoading && !isProfileLoading) {
      // If there's no user logged in, or if the profile is loaded and they are not an admin
      if (!user || (userProfile && !userProfile.isAdmin)) {
        router.replace('/signin');
      }
      // Also handle the case where the user is logged in, but we can't find a profile for them
      else if (user && !userProfile) {
         router.replace('/signin');
      }
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;
  
  // While loading, or if the user is not yet determined to be an admin, show the loading skeleton.
  // This is a critical step. It prevents the child components (like the admin dashboard page)
  // from attempting to fetch data before we've confirmed the user has admin rights.
  if (isLoading || !userProfile?.isAdmin) {
    return <AdminLoadingSkeleton />;
  }

  // Only if all checks pass (loading is false AND user is an admin), render the admin content.
  return <>{children}</>;
}
