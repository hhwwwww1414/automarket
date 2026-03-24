import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/auth';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: session.user,
      expiresAt: session.expiresAt.toISOString(),
    },
    { status: 200 }
  );
}
