'use client';

import { useFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { UserProfile, Course, Lead } from '@/types';
import { StatsCards } from '@/components/admin/stats-cards';
import { UserAcquisitionChart } from '@/components/admin/user-acquisition-chart';
import { RecentUsers } from '@/components/admin/recent-users';
import { UserList } from '@/components/admin/user-list';
import { CourseList } from '@/components/admin/course-list';
import { LeadList } from '@/components/admin/lead-list';
import { PackageOverview } from '@/components/admin/package-overview';
import { subDays, format } from 'date-fns';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Note: The main loading skeleton is now handled by the AdminLayout.
// This component assumes it will only be rendered for a verified admin.
function AdminDashboardSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-9 w-64" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-80" />
                <Skeleton className="col-span-3 h-80" />
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
  const { firestore } = useFirebase();

  // These queries are now safe to run because this component will only render
  // after the AdminLayout has confirmed the user is an admin.
  const allUsersQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc')) : null, 
    [firestore]
  );
  
  const recentUsersQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc'), limit(5)) : null,
    [firestore]
  );

  const coursesQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'courses'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );

  const leadsQuery = useMemo(() => 
    firestore ? query(collection(firestore, 'leads'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );

  const { data: allUsers, isLoading: isLoadingAllUsers } = useCollection<UserProfile>(allUsersQuery);
  const { data: recentUsers, isLoading: isLoadingRecentUsers } = useCollection<UserProfile>(recentUsersQuery);
  const { data: courses, isLoading: isLoadingCourses } = useCollection<Course>(coursesQuery);
  const { data: leads, isLoading: isLoadingLeads } = useCollection<Lead>(leadsQuery);

  const processChartData = (users: WithId<UserProfile>[] | null) => {
    if (!users) return [];
    
    const sevenDaysAgo = subDays(new Date(), 7);
    
    const dailyCounts = users.reduce((acc: { [key: string]: number }, user) => {
      const createdAt = user.createdAt ? (user.createdAt as any).toDate() : new Date();
      if (createdAt >= sevenDaysAgo) {
        const dateKey = format(createdAt, 'MMM d');
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
      return acc;
    }, {});

    const last7DaysMap: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateKey = format(date, 'MMM d');
        last7DaysMap[dateKey] = 0;
    }
    
    const mergedData = { ...last7DaysMap, ...dailyCounts };

    return Object.entries(mergedData).map(([date, users]) => ({ date, users }));
  };

  const packageCounts = useMemo(() => {
    const counts = { bronze: 0, gold: 0, platinum: 0 };
    if (allUsers) {
      for (const user of allUsers) {
        if (user.package && counts.hasOwnProperty(user.package)) {
          counts[user.package]++;
        }
      }
    }
    return counts;
  }, [allUsers]);

  const chartData = processChartData(allUsers);
  const isLoading = isLoadingAllUsers || isLoadingRecentUsers || isLoadingCourses || isLoadingLeads;
  
  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards totalUsers={allUsers?.length ?? 0} isLoading={isLoadingAllUsers} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight">User Acquisition</h3>
                <p className="text-sm text-muted-foreground mt-1">New users in the last 7 days</p>
            </div>
            <div className="p-6 pt-0">
                <UserAcquisitionChart data={chartData} isLoading={isLoadingAllUsers} />
            </div>
        </div>
        <div className="col-span-4 lg:col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight">Recent Sign Ups</h3>
                <p className="text-sm text-muted-foreground mt-1">The 5 most recent users to join.</p>
            </div>
             <div className="p-6 pt-0">
                <RecentUsers users={recentUsers || []} isLoading={isLoadingRecentUsers} />
            </div>
        </div>
      </div>
       <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight">Leads</h3>
                <p className="text-sm text-muted-foreground mt-1">Users who submitted the lander form.</p>
            </div>
             <div className="p-6 pt-0">
                <LeadList leads={leads || []} isLoading={isLoadingLeads} />
            </div>
        </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight">Package Overview</h3>
                <p className="text-sm text-muted-foreground mt-1">Distribution of users by subscription package.</p>
            </div>
            <div className="p-6 pt-0">
                <PackageOverview packageCounts={packageCounts} isLoading={isLoadingAllUsers} />
            </div>
        </div>
       <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight">All Users</h3>
                <p className="text-sm text-muted-foreground mt-1">A complete list of all registered users.</p>
            </div>
             <div className="p-6 pt-0">
                <UserList users={allUsers || []} isLoading={isLoadingAllUsers} />
            </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight">Courses</h3>
                <p className="text-sm text-muted-foreground mt-1">A list of all available courses.</p>
            </div>
                <div className="p-6 pt-0">
                <CourseList courses={courses || []} isLoading={isLoadingCourses} />
            </div>
        </div>
    </div>
  );
}
