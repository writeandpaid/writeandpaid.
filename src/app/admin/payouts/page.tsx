
'use client';

import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { UserProfile, Payout } from '@/types';
import { useMemo } from 'react';
import { PayoutsList } from '@/components/admin/payouts-list';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PayoutsPage() {
  const firestore = useFirestore();

  // Fetch all users sorted by reward points
  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('rewardPoints', 'desc'));
  }, [firestore]);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);

  // Fetch all payouts
  const payoutsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'payouts'), orderBy('createdAt', 'desc'));
  }, [firestore]);
  const { data: payouts, isLoading: isLoadingPayouts } = useCollection<Payout>(payoutsQuery);
  
  // Create a map of users for easy lookup
  const userMap = useMemo(() => {
    if (!users) return new Map();
    return new Map(users.map(u => [u.id, u]));
  }, [users]);


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
       <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
            </Link>
        </div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Payouts</h2>
      </div>
      
      <PayoutsList
        users={users || []}
        payouts={payouts || []}
        userMap={userMap}
        isLoading={isLoadingUsers || isLoadingPayouts}
      />
    </div>
  );
}
