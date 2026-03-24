import { NextResponse } from 'next/server';
import { markAllUserNotificationsRead } from '@/lib/server/admin-activity';
import { getSessionUser } from '@/lib/server/auth';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const result = await markAllUserNotificationsRead(currentUser.id);
    return NextResponse.json({ ok: true, updated: result.count }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to mark notifications as read.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
