import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { database } from '@/lib/models';

/**
 * API endpoint to logout from all devices
 * Deletes all custom sessions for the current user
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
    const deletedCount = await database.deleteCustomSessionsByUser(userId);

    // Also remove all refresh tokens
    await database.removeAllRefreshTokens(userId);

    // Log security event
    await database.logSecurityEvent({
      userId,
      eventType: 'LOGIN_SUCCESS', // Using closest available type
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { action: 'logout_all_devices', sessionsDeleted: deletedCount }
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out from all devices successfully',
      sessionsDeleted: deletedCount
    });

  } catch (error) {
    console.error('Logout all error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to logout from all devices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
