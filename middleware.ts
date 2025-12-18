import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protected routes configuration
const protectedRoutes = {
  admin: ['/admin'],
  manager: ['/dashboard', '/admin'],
  user: ['/user', '/dashboard', '/admin'],
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/tours',
  '/gallery',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-code',
  '/verify-token',
  '/unauthorized',
  '/test-auth',
  '/api/auth',
  '/booking-confirmation',
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

function getRequiredRole(pathname: string): string | null {
  // Allow managers (and admins via hierarchy) to access /admin
  if (pathname.startsWith('/admin')) return 'manager';
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') return 'manager';
  if (pathname.startsWith('/user')) return 'user';
  if (pathname === '/dashboard' || pathname === '/security') return 'user'; // Any authenticated user
  return null;
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, string[]> = {
    admin: ['admin', 'manager', 'user'],
    manager: ['manager', 'user'],
    user: ['user'],
  };

  return roleHierarchy[userRole]?.includes(requiredRole) || false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try multiple approaches to get the token
  const secret = process.env.NEXTAUTH_SECRET;

  // Try different cookie names based on environment
  const cookieName = process.env.NODE_ENV === 'production' 
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';

  let token = await getToken({
    req: request,
    secret: secret,
    cookieName: cookieName
  });

  // Fallback: try the other cookie name
  if (!token) {
    const fallbackCookieName = process.env.NODE_ENV === 'production'
      ? 'next-auth.session-token'
      : '__Secure-next-auth.session-token';
    
    token = await getToken({
      req: request,
      secret: secret,
      cookieName: fallbackCookieName
    });
  }

  // Fallback: check if session cookie exists manually
  const sessionCookie = request.cookies.get('__Secure-next-auth.session-token') ||
    request.cookies.get('next-auth.session-token');

  // Debug logging only for auth issues
  // Removed to reduce noise

  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https: res.cloudinary.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live wss://ws.pusherapp.com https://www.google-analytics.com https://www.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Skip auth checks for public routes
  if (isPublicRoute(pathname)) {
    return response;
  }

  // Check if route requires authentication
  const requiredRole = getRequiredRole(pathname);

  if (requiredRole && !token) {
    // If no token but session cookie exists, allow access (fallback)
    if (sessionCookie) {
      return response;
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (requiredRole && token) {
    const userRole = token.role as string;

    if (!hasRequiredRole(userRole, requiredRole)) {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      url.searchParams.set('required', requiredRole);
      url.searchParams.set('current', userRole);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon-v2.ico |.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};