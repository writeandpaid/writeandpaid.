
'use client';

import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface PackageOverviewProps {
  packageCounts: {
    bronze: number;
    gold: number;
    platinum: number;
  };
  isLoading: boolean;
}

export function PackageOverview({ packageCounts, isLoading }: PackageOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const total = packageCounts.bronze + packageCounts.gold + packageCounts.platinum;
  const getPercentage = (count: number) => (total > 0 ? (count / total) * 100 : 0);

  const packages = [
    { name: 'Bronze', count: packageCounts.bronze, color: 'bg-yellow-600' },
    { name: 'Gold', count: packageCounts.gold, color: 'bg-yellow-400' },
    { name: 'Platinum', count: packageCounts.platinum, color: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <div key={pkg.name} className="grid grid-cols-4 items-center gap-4">
          <span className="col-span-1 text-sm font-medium capitalize">{pkg.name}</span>
          <Progress value={getPercentage(pkg.count)} className="col-span-2 h-2" />
          <span className="col-span-1 text-right text-sm text-muted-foreground">{pkg.count} users ({getPercentage(pkg.count).toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  );
}
