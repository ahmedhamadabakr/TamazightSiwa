import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'No active session found'
          }
        },
        { status: 401 }
      );
    }

    const userId = token.sub;

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Invalid user session'
          }
        },
        { status: 401 }
      );
    }

    try {
      await database.removeAllRefreshTokens(userId as any);
    } catch (error) {
      console.error('Error removing all refresh tokens:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to logout from all devices'
          }
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    const cookiePrefix = process.env.NODE_ENV === 'production' ? '__Secure-' : '';
    const sessionCookieName = `${cookiePrefix}next-auth.session-token`;
    const csrfCookieName = process.env.NODE_ENV === 'production' 
      ? '__Host-next-auth.csrf-token' 
      : 'next-auth.csrf-token';

    response.cookies.set(sessionCookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    response.cookies.set(csrfCookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return response;

  } catch (error) {
    console.error('Logout all error:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during logout. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}