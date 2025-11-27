import { JoinForm } from '@/components/sections/join-form';
import { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <div className="py-20 md:py-28">
      <Suspense fallback={<div className="text-center">Loading form...</div>}>
        <JoinForm />
      </Suspense>
    </div>
  );
}
