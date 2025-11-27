
'use client';

import { CourseForm, type CourseFormValues } from '@/components/admin/course-form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NewCoursePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const firestore = useFirestore();

    const handleSaveCourse = async (data: CourseFormValues) => {
        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Firestore is not initialized.',
            });
            return;
        }
        setIsSaving(true);
        
        try {
            await addDoc(collection(firestore, 'courses'), {
                ...data,
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'Course Created!',
                description: `The course "${data.title}" has been successfully added.`,
            });
            router.push('/admin');

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

    