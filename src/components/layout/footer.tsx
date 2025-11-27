import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t py-8 mt-auto bg-background/80 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>© 2025 Write & Paid. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/contact" className="underline-animated hover:text-foreground transition-colors">Contact</Link>
          <Link href="/legal/terms" className="underline-animated hover:text-foreground transition-colors">Terms</Link>
          <Link href="/legal/privacy" className="underline-animated hover:text-foreground transition-colors">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
