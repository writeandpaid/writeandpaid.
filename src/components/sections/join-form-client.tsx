
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Progress } from '../ui/progress';
import { ArrowLeft, Eye, EyeOff, Gift } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { doc, setDoc, serverTimestamp, runTransaction, getDoc, collection, increment } from 'firebase/firestore';
import { nanoid } from 'nanoid';

const generateCaptchaText = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const getReferrerNameClient = async (firestore: any, refCode: string | null): Promise<string | null> => {
    if (!refCode) return null;

    try {
        const referralCodeRef = doc(firestore, 'referralCodes', refCode);
        const referralCodeDoc = await getDoc(referralCodeRef);
        if (!referralCodeDoc.exists()) return null;

        const referrerUid = referralCodeDoc.data()?.uid;
        if (!referrerUid) return null;
        
        const userRef = doc(firestore, 'users', referrerUid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) return null;

        return userDoc.data()?.firstName || null;

    } catch (error) {
        console.error("Error getting referrer name on client:", error);
        return null;
    }
}


export function JoinForm() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState('');

  useEffect(() => {
    setCaptchaText(generateCaptchaText());
  }, []);

  const formSchema = useMemo(() => z
    .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(1, 'Phone number is required'),
      username: z.string().min(1, 'Desired username is required'),
      country: z.string().min(1, 'Country is required'),
      state: z.string().min(1, 'State/Province is required'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
      verification: z.string().refine((val) => val.toUpperCase() === captchaText.toUpperCase(), {
        message: 'Incorrect CAPTCHA text.',
      }),
      terms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms.',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }), [captchaText]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      country: 'usa',
      state: '',
      password: '',
      confirmPassword: '',
      verification: '',
      terms: false,
    },
  });
  
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && firestore) {
      getReferrerNameClient(firestore, refCode).then(name => {
        if (name) {
          setReferrerName(name);
        }
      });
    }
  }, [searchParams, firestore]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (step === 1) {
       fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'country', 'state', 'username', 'password', 'confirmPassword'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Services not ready. Please try again.',
      });
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      // 2. Send verification email & update profile display name
      await sendEmailVerification(user);
      await updateProfile(user, { displayName: `${values.firstName} ${values.lastName}` });

      const referralCode = nanoid(8);
      const isAdmin = values.email.toLowerCase() === 'admin@example.com';
      const refCodeFromQuery = searchParams.get('ref');
      
      const userRef = doc(firestore, 'users', user.uid);
      const referralCodeRef = doc(firestore, 'referralCodes', referralCode);

      // 3. Save user profile to Firestore
      await setDoc(userRef, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(),
        phone: values.phone,
        username: values.username,
        country: values.country,
        state: values.state,
        referralCode,
        referralCount: 0,
        rewardPoints: 0,
        createdAt: serverTimestamp(),
        isAdmin: isAdmin,
        package: 'bronze',
        referredBy: refCodeFromQuery || null,
      });

      // 4. Save referral code mapping
      await setDoc(referralCodeRef, {
          uid: user.uid,
          createdAt: serverTimestamp(),
      });

      // 5. Handle referral claim in a transaction
      if (refCodeFromQuery) {
        await runTransaction(firestore, async (transaction) => {
            const referrerCodeMappingRef = doc(firestore, 'referralCodes', refCodeFromQuery);
            const referrerCodeMappingDoc = await transaction.get(referrerCodeMappingRef);

            if (referrerCodeMappingDoc.exists()) {
                const referrerUid = referrerCodeMappingDoc.data().uid;
                if (referrerUid && referrerUid !== user.uid) {
                    const referrerRef = doc(firestore, 'users', referrerUid);
                    const referralRecordRef = doc(collection(firestore, 'referrals'));

                    transaction.update(referrerRef, {
                        referralCount: increment(1),
                        rewardPoints: increment(100),
                    });
                    
                    transaction.set(referralRecordRef, {
                        referrerUid: referrerUid,
                        refereeUid: user.uid,
                        createdAt: serverTimestamp(),
                        source: 'web',
                    });
                }
            }
        });
      }


      // 6. Sign out user to force email verification
      await auth.signOut();
      
      const destination = isAdmin ? `/signin?message=admin-account-created` : `/verify-email?email=${encodeURIComponent(values.email)}`;
      router.push(destination);

    } catch (error: any) {
      console.error('Error during signup: ', error);
      let errorMessage = 'Could not create your account.';
       if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in or use a different email.';
        setStep(1); 
      }
      toast({
        variant: 'destructive',
        title: 'Signup Error',
        description: errorMessage,
      });
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          {referrerName && (
             <div className="mb-4 text-center p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
                <p className="font-semibold flex items-center justify-center gap-2">
                    <Gift className="h-5 w-5" />
                    You've been invited by {referrerName}!
                </p>
             </div>
          )}
          <CardTitle className="text-3xl font-bold">Join Write & Paid</CardTitle>
          <CardDescription>
            Fill out the form below to create your account and get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8 space-y-4">
            <Progress value={(step / totalSteps) * 100} />
            <p className="text-sm text-muted-foreground text-center">Step {step} of {totalSteps}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold">Account Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Username *</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input type={showPassword ? 'text' : 'password'} {...field} className="pr-10" />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password *</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input type={showConfirmPassword ? 'text' : 'password'} {...field} className="pr-10" />
                            </FormControl>
                             <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="usa">United States</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Nevada" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold">Final Steps</h3>
                  <div className="space-y-2">
                    <Label>Referred by</Label>
                    <Input value={referrerName ? `${referrerName} (${searchParams.get('ref')})` : searchParams.get('ref') || 'None'} disabled />
                    <FormDescription>
                      This code was automatically applied from a referral link.
                    </FormDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name="verification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification *</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input className="w-48" {...field} placeholder="Enter the text" />
                          </FormControl>
                          <div className="bg-black text-white font-mono text-xl px-4 py-1 tracking-widest select-none">
                            {captchaText}
                          </div>
                        </div>
                        <FormDescription>
                          Enter the text from the box to verify you're human.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the Terms & confirm I'm 18+.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex items-center gap-4 pt-8">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}
                <div className="flex-grow"></div>
                {step < totalSteps && (
                  <Button type="button" onClick={nextStep} className="btn-primary">
                    Next Step
                  </Button>
                )}
                {step === totalSteps && (
                  <Button type="submit" size="lg" className="btn-primary" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating Account...' : 'Create My Account'}
                  </Button>
                )}
              </div>
              <div className="text-center text-sm pt-4">
                <p>
                  Already have an account?&nbsp;
                  <Link href="/signin" className="underline-animated font-medium hover:text-primary">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    