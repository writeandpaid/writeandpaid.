"use client";
import { CldImage, CldVideoPlayer } from 'next-cloudinary';

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Page() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">Cloudinary Image Example</h1>
        <CldImage
          src="cld-sample-5" // Use this sample image or upload your own via the Media Library
          width="500" // Transform the image: auto-crop to square aspect_ratio
          height="500"
          crop={{
            type: 'auto',
            source: true
          }}
          alt="Sample image from Cloudinary"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-6">Cloudinary Video Player Example</h1>
        <CldVideoPlayer
            id="player"
            width="960"
            height="540"
            src="iz9nmf9b7i8mylztpobc"
            className="rounded-lg overflow-hidden shadow-lg"
        />
      </div>
    </div>
  );
}
