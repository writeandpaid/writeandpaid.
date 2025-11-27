'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

export function LiveViewerCount() {
  const [viewerCount, setViewerCount] = useState<number | null>(null);

  const generateRandomCount = () => {
    // Generates a random integer between 100 and 200
    return Math.floor(Math.random() * (200 - 100 + 1)) + 100;
  };

  useEffect(() => {
    // Generate the initial random number only on the client-side to avoid hydration errors.
    setViewerCount(generateRandomCount());

    // Set up an interval to periodically update the count for a "live" effect.
    const interval = setInterval(() => {
      setViewerCount(generateRandomCount());
    }, 5000); // Update every 5 seconds

    // Clean up the interval when the component unmounts.
    return () => clearInterval(interval);
  }, []); // The empty dependency array ensures this runs only once on mount.

  // Show a loading skeleton until the initial number is generated on the client.
  if (viewerCount === null) {
    return <Skeleton className="h-4 w-8 inline-block" />;
  }
  
  return <span className="font-semibold text-gray-800">{viewerCount}</span>;
}
