

'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { signOut } from 'firebase/auth';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/types';
import { doc } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { ShoppingBag, Share2, Users, DollarSign } from 'lucide-react';
import { ShareButton } from '../ShareButton';
import Logo from './Write__Paid.svg';
import { LiveViewerCount } from './live-viewer-count';

export function Navbar() {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);

  const userProfileRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Go to homepage">
              <img src={Logo.src} alt="Logo" className='h-24 w-24' />
            </Link>
            
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-gray-600">
                Live viewers: <LiveViewerCount />
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/shop" aria-label="Shop">
                    <ShoppingBag className="h-5 w-5" />
                </Link>
            </Button>
            {isUserLoading ? (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <Dialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        Dashboard
                      </DropdownMenuItem>
                    {userProfile?.isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => router.push('/admin')}>
                            Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/payouts')}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Payouts
                        </DropdownMenuItem>
                      </>
                    )}
                     <DropdownMenuItem onClick={() => router.push('/referral')}>
                        <Users className="mr-2 h-4 w-4" />
                        Referrals
                      </DropdownMenuItem>
                     {userProfile?.referralCode && (
                       <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Link
                          </DropdownMenuItem>
                        </DialogTrigger>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Refer a Friend & Earn Rewards</DialogTitle>
                    <DialogDescription>
                      Share your unique referral link with friends. When they sign up, you'll earn points!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {userProfile?.referralCode && <ShareButton code={userProfile.referralCode} />}
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                asChild
              >
                <Link href="/signin">LOGIN</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
