import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/sessions'; // Import the decrypt function

export async function middleware(request: NextRequest) {
	const protectedPaths = ['/', '/profile', '/start-scanning', '/reports'];

	const { pathname } = request.nextUrl;

	const session = request.cookies.get('session')?.value;
	const sessionPayload = await decrypt(session);

	const isAuthenticated = !!sessionPayload;

	// Case 1: Handle unauthenticated access to protected paths
	if (!isAuthenticated) {
		if (protectedPaths.some((path) => pathname === path)) {
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('redirect_url', pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Case 2: Handle authenticated access to public paths and root
	if (isAuthenticated) {
		if (pathname === '/login') {
			// Delete the session cookie here to fix the redirect loop
			const response = NextResponse.redirect(new URL('/', request.url));
			response.cookies.set('session', '', { expires: new Date(0) });
			return response;
		}
	}

	// Allow all other requests to proceed
	return NextResponse.next();
}

export const config = {
	matcher: ['/', '/:path*'],
};
