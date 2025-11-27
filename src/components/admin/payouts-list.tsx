
'use client';

import { UserProfile, Payout } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WithId, useFirestore } from '@/firebase';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';

interface PayoutsListProps {
  users: WithId<UserProfile>[];
  payouts: WithId<Payout>[];
  userMap: Map<string, WithId<UserProfile>>;
  isLoading: boolean;
}

export function PayoutsList({ users, payouts, userMap, isLoading }: PayoutsListProps) {
    const { toast } = useToast();
    const [payingOut, setPayingOut] = useState<string | null>(null);
    const firestore = useFirestore();

    const handlePayout = async (userId: string, amount: number) => {
        if (!firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Firestore not available.' });
            return;
        }
        if (amount <= 0) {
            toast({ variant: 'destructive', title: 'Payout Error', description: 'User has no points to pay out.' });
            return;
        }
        setPayingOut(userId);

        try {
            await runTransaction(firestore, async (transaction) => {
                const userRef = doc(firestore, 'users', userId);
                const payoutRef = doc(collection(firestore, 'payouts'));
                
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists() || (userDoc.data()?.rewardPoints || 0) < amount) {
                    throw new Error("Insufficient points for this payout.");
                }

                transaction.set(payoutRef, {
                    userId,
                    amount,
                    createdAt: serverTimestamp(),
                    status: 'completed',
                });

                transaction.update(userRef, { rewardPoints: 0 });
            });

            toast({ title: 'Payout Successful', description: `Payout for ${userMap.get(userId)?.firstName} has been recorded.` });

        } catch (result: any) {
             toast({ variant: 'destructive', title: 'Payout Failed', description: result.message });
        } finally {
            setPayingOut(null);
        }
    }

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Pending Payouts</CardTitle>
                <CardDescription>Users with reward points ready for payout.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : !users || users.filter(u => u.rewardPoints > 0).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No users with pending rewards.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.filter(u => u.rewardPoints > 0).map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{user.rewardPoints}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm"
                                                onClick={() => handlePayout(user.id, user.rewardPoints)}
                                                disabled={payingOut === user.id}
                                            >
                                                {payingOut === user.id ? 'Processing...' : 'Mark as Paid'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>A log of all completed payouts.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="space-y-2">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : !payouts || payouts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No payout history found.</p>
                ) : (
                    <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount (Points)</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {payouts.map((payout) => (
                            <TableRow key={payout.id}>
                                <TableCell className="font-medium">{userMap.get(payout.userId)?.firstName || 'Unknown'}</TableCell>
                                <TableCell>{payout.amount}</TableCell>
                                <TableCell>{formatDate(payout.createdAt)}</TableCell>
                                <TableCell>
                                    <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'} className="capitalize bg-green-100 text-green-800">
                                        {payout.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

    