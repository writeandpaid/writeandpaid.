'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

const courses = [
  {
    id: 'paid-per-letter',
    title: 'Paid Per Letter',
    description: 'Get paid to write letters—simple, repeatable, and home-friendly.',
    price: '$500 Value',
    image: placeholderImages.find(p => p.id === 'paid-per-letter'),
  },
  {
    id: 'send-it-cashback',
    title: 'Send It Cashback',
    description: 'Earn and save with our cash-back app—turn everyday purchases into real savings.',
    price: '$1,000 Value',
    image: placeholderImages.find(p => p.id === 'send-it-cashback'),
  },
  {
    id: 'send-it-a2z',
    title: 'Send It A2Z Course',
    description: 'Learn the ins and outs of Amazon and e-commerce with proven playbooks.',
    price: '$2,000 Value',
    image: placeholderImages.find(p => p.id === 'send-it-a2z'),
  },
  {
    id: 'send-it-writing-gigs',
    title: 'Send It Writing Gigs',
    description: 'Find and secure paid writing opportunities with reputable companies.',
    price: '$750 Value',
    image: placeholderImages.find(p => p.id === 'send-it-writing-gigs'),
  },
  {
    id: 'tiktok-mastery',
    title: 'TikTok Mastery',
    description: 'Master TikTok for business growth—create, grow, and convert attention.',
    price: '$2,000 Value',
    image: placeholderImages.find(p => p.id === 'tiktok-mastery'),
  },
  {
    id: 'send-it-credit-repair',
    title: 'Send It Credit Repair',
    description: 'Challenge and remove negative items holding back your score.',
    price: '$500 Value',
    image: placeholderImages.find(p => p.id === 'credit-repair'),
  },
];

export function AllCourses() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
            <div className="bg-white inline-block px-6 py-3 rounded-lg shadow-md">
                <p className="text-lg font-bold">Total Bonus Value: <span className="text-primary">$7,750</span></p>
                <p className="text-sm text-gray-500">Thank your advantage look in the entire library, build momentum faster, and skip the "start over" trap.</p>
            </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-white">
              {course.image && (
                <div className="relative aspect-video">
                  <Image src={course.image.imageUrl} alt={course.title} fill className="object-cover" data-ai-hint={course.image.imageHint ?? ''} />
                </div>
              )}
              <CardHeader className="flex-row items-start justify-between">
                <CardTitle>{course.title}</CardTitle>
                <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{course.price}</div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{course.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4">
                <Button asChild className="w-full btn-primary">
                    <Link href="/signup">LEARN MORE</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
