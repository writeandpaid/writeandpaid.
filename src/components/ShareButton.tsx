'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

interface ShareButtonProps {
  code: string;
}

export function ShareButton({ code }: ShareButtonProps) {
  const { toast } = useToast();
  
  // Use the environment variable for the site URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const referralLink = `${siteUrl}/signup?ref=${code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(
      () => {
        toast({
          title: 'Copied to clipboard!',
          description: 'You can now share your referral link.',
        });
      },
      (err) => {
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy link to clipboard.',
        });
        console.error('Failed to copy: ', err);
      }
    );
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" value={referralLink} readOnly />
      <Button type="button" size="icon" onClick={copyToClipboard} aria-label="Copy referral link">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
