import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/members',
  '/find-partner',
  '/profile',
  '/interests',
  '/messages',
  '/my-profile',
];

// List of auth routes that should redirect to /members if already logged in
const authRoutes = ['/login', '/register'];

// Helper function to validate JWT token
function isTokenValid(token: string): boolean {
  try {
    // Decode JWT token (format: header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Validate token if it exists
  const hasValidToken = token ? isTokenValid(token) : false;
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !hasValidToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    // Clear invalid token cookie if it exists
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete('token');
    }
    return response;
  }
  
  // COMMENTED OUT: Allow logged-in users to access login/register pages
  // This allows users to logout and re-login or access these pages directly
  // Uncomment if you want to prevent logged-in users from seeing these pages
  // if (isAuthRoute && hasValidToken) {
  //   return NextResponse.redirect(new URL('/members', request.url));
  // }
  
  // Clear invalid token from cookies if found
  if (token && !hasValidToken) {
    const response = NextResponse.next();
    response.cookies.delete('token');
    return response;
  }
  
  return NextResponse.next();
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)',
  ],
};
