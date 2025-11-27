
'use client';

import { Lead } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WithId } from '@/firebase';

interface LeadListProps {
  leads: WithId<Lead>[];
  isLoading: boolean;
}

export function LeadList({ leads, isLoading }: LeadListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 border rounded-lg p-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No leads found.</p>;
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Referred By</TableHead>
            <TableHead>Submitted On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.firstName}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>
                {lead.ref ? <Badge variant="secondary">{lead.ref}</Badge> : <span className="text-muted-foreground">None</span>}
              </TableCell>
              <TableCell>{formatDate(lead.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
