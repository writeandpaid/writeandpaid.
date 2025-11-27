
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CldUploadWidget, type CldUploadWidgetResults } from 'next-cloudinary';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const courseFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  videoUrl: z.string().url({ message: "A valid video URL is required. Please upload a video." }),
  module: z.string().min(1, { message: 'Module name is required.' }),
  order: z.coerce.number().min(0, { message: 'Order must be a non-negative number.' }),
  price: z.coerce.number().min(0, { message: 'Price must be a non-negative number.' }),
});


export type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  onSave: (data: CourseFormValues) => Promise<void>;
  initialData?: Partial<CourseFormValues>;
  isSaving?: boolean;
}

export function CourseForm({ onSave, initialData, isSaving }: CourseFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      videoUrl: '',
      module: '',
      order: 0,
      price: 0,
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    // Convert price from dollars to cents before saving
    const dataInCents = {
        ...data,
        price: Math.round(data.price * 100),
    };
    await onSave(dataInCents);
  };
  
  const handleUploadSuccess = (results: CldUploadWidgetResults) => {
    setIsUploading(false);
    if (results.info && typeof results.info === 'object' && 'secure_url' in results.info) {
        const secureUrl = results.info.secure_url as string;
        form.setValue('videoUrl', secureUrl, { shouldValidate: true });
        toast({
            title: 'Upload Successful',
            description: 'Video URL has been set.',
        });
    } else {
         toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'Could not get a secure URL from Cloudinary.',
      });
    }
  };

  const handleUploadError = (error: any) => {
      setIsUploading(false);
      toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message || 'Could not upload video to Cloudinary.',
      });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Advanced Calligraphy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the course content." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Course Video</FormLabel>
                    <div className="flex items-center gap-4">
                         <CldUploadWidget 
                            signatureEndpoint="/api/cloudinary/sign"
                            onSuccess={handleUploadSuccess}
                            onError={handleUploadError}
                            onUploadAdded={() => setIsUploading(true)}
                        >
                            {({ open }) => (
                                <Button type="button" variant="outline" onClick={() => open()} disabled={isUploading}>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="mr-2 h-4 w-4" />
                                            Upload Video
                                        </>
                                    )}
                                </Button>
                            )}
                        </CldUploadWidget>
                        <FormControl>
                            <Input placeholder="Upload a video to populate the URL" {...field} readOnly />
                        </FormControl>
                    </div>
                    <FormDescription>
                        Click to upload. A secure signature will be generated for the upload.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
            control={form.control}
            name="module"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Module</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Getting Started" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                </FormControl>
                 <FormDescription>
                    The display order.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter the price in dollars.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <Button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? 'Saving...' : 'Save Course'}
        </Button>
      </form>
    </Form>
  );
}
