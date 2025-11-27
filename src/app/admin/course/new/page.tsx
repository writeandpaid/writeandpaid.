
'use client';

import { CourseForm, type CourseFormValues } from '@/components/admin/course-form';
import { addCourse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';


export default function NewCoursePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveCourse = async (data: CourseFormValues) => {
        setIsSaving(true);
        
        try {
            const result = await addCourse({
                title: data.title,
                description: data.description,
                module: data.module,
                order: data.order,
                price: data.price, // Price is already in cents from the form
                videoUrl: data.videoUrl,
            });

            if (result.success) {
                toast({
                    title: 'Course Created!',
                    description: `The course "${data.title}" has been successfully added.`,
                });
                router.push('/admin');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error Creating Course',
                    description: result.message || 'An unexpected error occurred.',
                });
            }
        } catch(error: any) {
             toast({
                variant: 'destructive',
                title: 'Error Creating Course',
                description: error.message || 'A network or server error occurred.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center gap-4">
                 <Link href="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Course</CardTitle>
                    <CardDescription>Fill out the details below to add a new course to the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CourseForm onSave={handleSaveCourse} isSaving={isSaving} />
                </CardContent>
            </Card>
        </div>
    );
}
