import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (session.isLoggedIn) {
    return NextResponse.json({
      isLoggedIn: true,
      username: session.username,
    });
  }

  return NextResponse.json({ isLoggedIn: false });
}
