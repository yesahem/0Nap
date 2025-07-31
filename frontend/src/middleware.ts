import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const RATE_LIMIT_MAX_AUTH_REQUESTS = 5; // 5 auth requests per minute

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get client IP
  const ip = getClientIP(request);
  
  if (ip) {
    // Apply rate limiting
    if (isRateLimited(ip, pathname)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': getMaxRequests(pathname).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + 60).toString(),
        },
      });
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

function getClientIP(request: NextRequest): string | null {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return null;
}

function isRateLimited(ip: string, pathname: string): boolean {
  const now = Date.now();
  const key = `${ip}:${pathname}`;
  const limit = rateLimitStore.get(key);
  const maxRequests = getMaxRequests(pathname);

  if (!limit || now > limit.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (limit.count >= maxRequests) {
    return true;
  }

  // Increment count
  limit.count++;
  return false;
}

function getMaxRequests(pathname: string): number {
  // Stricter limits for auth endpoints
  if (pathname.includes('/auth') || pathname.includes('/signin') || pathname.includes('/signup')) {
    return RATE_LIMIT_MAX_AUTH_REQUESTS;
  }
  
  return RATE_LIMIT_MAX_REQUESTS;
}

// Clean up old entries periodically (in production, use a proper cleanup strategy)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};