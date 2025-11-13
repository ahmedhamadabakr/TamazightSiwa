import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { database } from '@/lib/models';

/**
 * Fast logout from all devices - minimal operations
 */
export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete sessions and tokens in background (non-blocking)
    Promise.all([
      database.deleteCustomSessionsByUser(userId),
      database.removeAllRefreshTokens(userId)
    ]).catch(() => {});

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
