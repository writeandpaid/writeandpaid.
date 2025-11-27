
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export function Hero() {
  const videoThumbnail = placeholderImages.find(p => p.id === 'video-thumbnail');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative py-20 md:py-28 bg-secondary/20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="a" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M16 4.55a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Zm11.45 11.45a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9ZM4.55 16a1.45 1.45 0 1 0 2.9 0 1.45 1.45 0 0 0-2.9 0Zm11.45 11.45a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Z" fill="currentColor"></path></pattern></defs><rect width="100%" height="100%" fill="url(#a)"></rect></svg>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                Earn <span className="text-primary">$50–$75/hr</span> Writing Handwritten Letters From Home
              </h1>
            </div>
            
            <div 
              id="video-container" 
              className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              {videoThumbnail && (
                <Image 
                  src={videoThumbnail.imageUrl} 
                  alt="Handwritten letter" 
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={videoThumbnail.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                   <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground">
                Even with zero experience. We provide the training, tools, and contacts you need to start your own profitable letter-writing business.
              </p>
              <div className="mt-6 flex justify-center items-center space-x-4 text-muted-foreground">
                  <p className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />No experience needed</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Work your own hours</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Get paid directly</p>
              </div>
              <div className="mt-10">
                <Button asChild size="lg" className="btn-primary w-full sm:w-auto text-lg px-10 py-6">
                  <Link href="#signup">Get Instant Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Video Player</DialogTitle>
          <div className="aspect-video">
            <iframe 
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/e_bA670A4s4?autoplay=1"
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen>
            </iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
