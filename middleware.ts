import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const searchParams = req.nextUrl.searchParams;
    
    const isAuthPage = pathname.startsWith('/login') ||
                      pathname.startsWith('/signup') ||
                      pathname.startsWith('/register') ||
                      pathname.startsWith('/forgot-password');

    const isVerifyEmailPage = pathname.startsWith('/verify-email');

    // Special handling for verify-email page
    if (isVerifyEmailPage) {
      // Allow access if:
      // 1. Has verification code in URL (from email link)
      // 2. Has email parameter (from signup flow)
      // 3. User is authenticated but not verified (they need to verify)
      const hasCode = searchParams.has('code');
      const hasEmail = searchParams.has('email');
      const isUnverifiedUser = isAuth && token?.emailVerified === false;
      
      if (hasCode || hasEmail || isUnverifiedUser) {
        return NextResponse.next();
      }
      
      // If none of the above conditions are met, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect authenticated users away from other auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow access to protected routes only if authenticated
    if (!isAuth && !isAuthPage) {
      let from = pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const searchParams = req.nextUrl.searchParams;
        
        // Allow access to auth pages without token
        const isAuthPage = pathname.startsWith('/login') ||
                          pathname.startsWith('/signup') ||
                          pathname.startsWith('/register') ||
                          pathname.startsWith('/forgot-password');
        
        if (isAuthPage) return true;
        
        // Special handling for verify-email page
        if (pathname.startsWith('/verify-email')) {
          const hasCode = searchParams.has('code');
          const hasEmail = searchParams.has('email');
          const isUnverifiedUser = !!token && token.emailVerified === false;
          
          // Allow access if any of these conditions are met
          return hasCode || hasEmail || isUnverifiedUser;
        }
        
        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/profile/dashboard/:path*',
    '/settings/:path*',
    '/posts/new/:path*',
    '/posts/:path*/edit',
    
    // Auth pages (to redirect if already logged in)
    '/login',
    '/signup', 
    '/register',
    '/forgot-password',
    '/verify-email',
  ],
}; 