
'use client';

import { Course } from '@/types';
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
import { Button } from '../ui/button';
import Link from 'next/link';

interface CourseListProps {
  courses: WithId<Course>[];
  isLoading: boolean;
}

export function CourseList({ courses, isLoading }: CourseListProps) {

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div>
        <div className="flex justify-end mb-4">
            <Button asChild>
                <Link href="/admin/course/new">Add New Course</Link>
            </Button>
        </div>
        {isLoading ? (
             <div className="space-y-2 border rounded-lg p-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : !courses || courses.length === 0 ? (
             <p className="text-sm text-muted-foreground text-center py-8">No courses found.</p>
        ) : (
            <div className="border rounded-lg">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Created On</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {courses.map((course) => (
                    <TableRow key={course.id}>
                    <TableCell className="font-medium">
                        <Link href={`/courses/${course.id}`} className="hover:underline text-primary">
                            {course.title}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary">{course.module}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(course.price)}</TableCell>
                    <TableCell>{formatDate(course.createdAt)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        )}
    </div>
  );
}
