
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PresentationContent() {
  // Since we are no longer passing params, we just link to the standard signup page.
  const signupUrl = `/signup`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border-4 border-gray-200">
        <h1 className="text-center text-2xl md:text-4xl font-black tracking-tight text-gray-900 mb-8">
          CAN YOU REALLY EARN EXTRA CASH FROM WRITING LETTERS?
        </h1>
        
        <div className="aspect-video mb-8">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/e_bA670A4s4?autoplay=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center font-bold text-sm md:text-base text-gray-800 mb-4">
          <h2>CLICK BELOW TO JOIN</h2>
          <h2>COMP PLAN</h2>
          <h2>CLICK BELOW TO SEE A PRESENTATION</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Link href={signupUrl}>
            <img src="/get-started-today.png" alt="Get Started Today" className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" />
          </Link>
          <Link href={signupUrl}>
            <img src="/see-what-is-possible.png" alt="See What Is Possible" className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" />
          </Link>
          <Link href={signupUrl}>
            <img src="/full-presentation.png" alt="Full Presentation" className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PresentationPage() {
    return (
        <Suspense fallback={<div>Loading presentation...</div>}>
            <PresentationContent />
        </Suspense>
    )
}
