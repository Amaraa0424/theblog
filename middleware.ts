import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Only apply to /api routes except /api/graphql
  if (!request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname === '/api/graphql') {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.isAdmin ? 'ADMIN' : 'USER');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
} 