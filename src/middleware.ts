import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const protectedPaths = [
		'/dashboard',
		'/profile',
		'/start-scanning',
		'/reports',
	];
	const publicPaths = ['/login'];

	const { pathname } = request.nextUrl;

	const isAuthenticated = request.cookies.has('token');

	if (!isAuthenticated) {
		if (pathname === '/') {
			return NextResponse.rewrite(new URL('/login', request.url));
		}

		if (protectedPaths.some((path) => pathname.startsWith(path))) {
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('redirect_url', pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	if (isAuthenticated) {
		if (publicPaths.includes(pathname) || pathname === '/') {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/', '/:path*', '/dashboard/:path*', '/profile', '/login'],
};
