import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/shop/') // Don't rewrite if already /shop/
  ) {
    return NextResponse.next();
  }

  // Extract subdomain from hostname
  const hostParts = hostname.split('.');
  const subdomain = hostParts[0];
  
  console.log('Middleware Debug:', { hostname, subdomain, pathname: url.pathname });

  // Skip for localhost development
  if (hostname.includes('localhost')) {
    // Only allow /dashboard, /auth, /demo on localhost
    if (
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/auth') ||
      url.pathname.startsWith('/demo') ||
      url.pathname === '/'
    ) {
      return NextResponse.next();
    }
  }

  // For production with rname.ink domain
  if (hostname.includes('rname.ink')) {
    // If it's the main domain (rname.ink), allow normal routing
    if (hostname === 'rname.ink') {
      return NextResponse.next();
    }
    
    // If it's a subdomain (like pizzapls.rname.ink), rewrite to /shop/[subdomain]
    if (subdomain && subdomain !== 'www' && hostParts.length >= 3) {
      console.log('Rewriting to:', `/shop/${subdomain}${url.pathname}`);
      url.pathname = `/shop/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};