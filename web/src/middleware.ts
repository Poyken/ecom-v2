import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/account', '/admin', '/superadmin', '/checkout'];
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if route requires auth
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // 2. Asset check (skip static files)
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
      return NextResponse.next();
  }

  // 3. Get Tokens
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // 4. If no tokens and route is protected -> Redirect Login
  if (!accessToken && !refreshToken && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
  }

  // 5. If accessToken expired/missing but have refreshToken -> Refresh
  if (!accessToken && refreshToken) {
    try {
        // Call Backend Refresh
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Cookie': `refresh_token=${refreshToken}`
            }
        });

        if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            const newAccessToken = data.accessToken;
            
            // Should also get new refresh token from set-cookie header of response?
            // Yes, backend sets it. We need to forward it.
            const newRefreshToken = getRefreshTokenFromSetCookie(refreshResponse.headers.get('set-cookie'));
            
            // Create response with new cookies
            const response = NextResponse.next();
            
            // Set Access Token
            response.cookies.set('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            // Set New Refresh Token (Rotation) if present
            if (newRefreshToken) {
                response.cookies.set('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                });
            }

            return response;

        } else {
             // Refresh failed -> Clear cookies and Redirect Login if protected
             // If not protected, just continue as guest (clearing cookies)
             if (isProtected) {
                 const url = request.nextUrl.clone();
                 url.pathname = '/auth/login';
                 return NextResponse.redirect(url);
             }
        }

    } catch (e) {
        console.error('Middleware Refresh Error', e);
         if (isProtected) {
             return NextResponse.redirect(new URL('/auth/login', request.url));
         }
    }
  }

  return NextResponse.next();
}

function getRefreshTokenFromSetCookie(setCookie: string | null) {
    if (!setCookie) return null;
    // Simple parse, looking for refresh_token=...
    const match = setCookie.match(/refresh_token=([^;]+)/);
    return match ? match[1] : null;
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
