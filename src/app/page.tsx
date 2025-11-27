
'use client';

import { Faq } from '@/components/sections/faq';
import { Hero } from '@/components/sections/hero';
import { WhatYouGet } from '@/components/sections/what-you-get';
import { Testimonials } from '@/components/sections/testimonials';
import { BonusSection } from '@/components/sections/bonus-section';
import { MainCourses } from '@/components/sections/main-courses';
import { JoinForm } from '@/components/sections/join-form';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <Hero />
        <WhatYouGet />
        <Testimonials />
        <BonusSection />
        <MainCourses />
        <Faq />
      </div>
      <section id="signup" className="py-20 md:py-28 bg-secondary/20">
         <Suspense fallback={<div className="text-center">Loading form...</div>}>
            <JoinForm />
        </Suspense>
      </section>
    </div>
  );
}
