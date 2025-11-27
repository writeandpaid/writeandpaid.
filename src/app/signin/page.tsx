
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, User, Auth } from 'firebase/auth';
import { useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, UserCheck, Eye, EyeOff } from 'lucide-react';

function SignInAlert() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    if (message === 'account-created') {
        return (
            <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4 !text-blue-600" />
                <AlertTitle>Account Created!</AlertTitle>
                <AlertDescription>
                    Please check your email to verify your account before signing in.
                </AlertDescription>
            </Alert>
        );
    }

     if (message === 'admin-account-created') {
        return (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <UserCheck className="h-4 w-4 !text-green-600" />
                <AlertTitle>Admin Account Created!</AlertTitle>
                <AlertDescription>
                    Please check your email to verify your admin account before signing in.
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}

function SignInForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSuccessfulSignIn = async (authInstance: Auth, user: User) => {
    if (!user.emailVerified) {
        toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your inbox and verify your email address before signing in.",
        });
        // Optionally, offer to resend verification email
        await authInstance.signOut(); // Log out the user as they are not verified
        setIsLoading(false);
        return;
    }
    toast({
        title: 'Signed In!',
        description: 'Redirecting you to your dashboard...',
    });
    router.push('/dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({ variant: "destructive", title: "Error", description: "Authentication service not available." });
        return;
    };
    const authInstance = auth;
    setIsLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
        await handleSuccessfulSignIn(authInstance, userCredential.user);
    } catch (error: any) {
        let description = "An unexpected error occurred. Please try again.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            description = "Invalid email or password. Please check your credentials and try again.";
        }
        if (error.code === 'auth/email-not-verified') {
            description = "Your email has not been verified. Please check your inbox for the verification link.";
        }
        toast({
            variant: "destructive",
            title: "Sign In Failed",
            description,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <SignInAlert />
          </Suspense>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={isLoading}
                    className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
             <div className="text-right text-sm">
                <Link href="/forgot-password" className="underline-animated font-medium hover:text-primary">
                    Forgot password?
                </Link>
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Don't have an account?&nbsp;
            <Link href="/signup" className="underline-animated font-medium hover:text-primary">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
  );
}


export default function SignInPage() {
    return (
        <div className="py-20 md:py-28 flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}

    