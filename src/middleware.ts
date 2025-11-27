
import { NextResponse, type NextRequest } from 'next/server';

// This middleware handles referral links.
// If a 'ref' query parameter is present, it redirects the user to the
// lander page, preserving all query parameters.
export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const refCode = nextUrl.searchParams.get('ref');

  // If there's a 'ref' code and the user is NOT already on the lander page,
  // redirect them to the lander page.
  if (refCode && nextUrl.pathname !== '/lander') {
    // Reconstruct the URL to point to '/lander' but keep all search params.
    const landerUrl = new URL(request.url);
    landerUrl.pathname = '/lander';
    
    // Redirect to the lander page with all original query params.
    return NextResponse.redirect(landerUrl);
  }

  // If no referral code or already on the lander page, continue.
  return NextResponse.next();
}

// The matcher ensures this middleware runs on all paths,
// except for API routes and static assets.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
