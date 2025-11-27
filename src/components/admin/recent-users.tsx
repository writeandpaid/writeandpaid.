'use client';

import { UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentUsersProps {
  users: UserProfile[];
  isLoading: boolean;
}

export function RecentUsers({ users, isLoading }: RecentUsersProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

  if (!users || users.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No recent users found.</p>
  }

  return (
    <div className="space-y-1">
      {users.map((user) => (
        <div key={user.username} className="flex items-center p-2 rounded-lg transition-colors hover:bg-secondary/50">
          <Avatar className="h-9 w-9">
             <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto font-medium capitalize text-sm text-muted-foreground">{user.package}</div>
        </div>
      ))}
    </div>
  );
}
