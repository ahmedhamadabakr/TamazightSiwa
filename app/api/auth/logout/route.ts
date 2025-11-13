import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { database } from '@/lib/models';

/**
 * API endpoint to logout from current device
 * This is called before NextAuth signOut to clean up custom sessions
 */
export async function POST(req: NextRequest) {
  try {
    // Get current session
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID not found' },
        { status: 400 }
      );
    }

    // Delete all custom sessions for this user
    // Note: NextAuth's signOut event will also trigger deleteCustomSessionsByUser
    // but we do it here as well to ensure cleanup
    const deletedCount = await database.deleteCustomSessionsByUser(userId);

    // Log security event
    await database.logSecurityEvent({
      userId,
      eventType: 'LOGIN_SUCCESS', // Using closest available type
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { action: 'logout', sessionsDeleted: deletedCount }
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      sessionsDeleted: deletedCount
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to logout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
