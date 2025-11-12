import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }

    const userId = token.sub;

    const user = await database.findUserById(userId as any);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'User not found'
          }
        },
        { status: 404 }
      );
    }

    const sessionParts = sessionId.split('_');
    if (sessionParts.length !== 2 || sessionParts[0] !== userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Invalid session ID'
          }
        },
        { status: 400 }
      );
    }

    const tokenIndex = parseInt(sessionParts[1]);
    if (isNaN(tokenIndex) || tokenIndex < 0 || tokenIndex >= user.refreshTokens.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Session not found'
          }
        },
        { status: 404 }
      );
    }

    const targetToken = user.refreshTokens[tokenIndex];
    const currentRefreshToken = request.cookies.get('refreshToken')?.value;

    if (targetToken.token === currentRefreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Cannot logout current session. Use regular logout instead.'
          }
        },
        { status: 400 }
      );
    }

    await database.removeRefreshToken(userId as any, targetToken.token);

    return NextResponse.json({
      success: true,
      message: 'Session terminated successfully'
    });

  } catch (error) {
    console.error('Session termination error:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to terminate session'
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}