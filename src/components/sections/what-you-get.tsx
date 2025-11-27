'use client';

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { placeholderImages } from '@/lib/placeholder-images';

const features = [
  "Comprehensive Video Training",
  "Directory of Paying Contacts",
  "Proven Letter Templates",
  "Lifetime Access to All Materials",
  "Work From Anywhere, Anytime",
  "Community Support Group",
  "Quarterly Live Q&A Sessions",
  "Resource & Tool Kit"
];

export function WhatYouGet() {
  const image = placeholderImages.find(p => p.id === "what-you-get");

  return (
    <section id="what-you-get" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black">Everything You Need to Succeed</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We provide a complete toolkit to ensure you can start earning as quickly as possible.
            </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
