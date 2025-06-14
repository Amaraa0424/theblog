import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    domain: process.env.NEXTAUTH_URL || 'not-set',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'not-set',
  });
} 