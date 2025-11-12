import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Verification token is required'
          }
        },
        { status: 400 }
      );
    }

    const verifiedUser = await database.verifyEmail(token);

    if (!verifiedUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Invalid or expired verification token'
          }
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Your account is now active.',
      data: {
        user: {
          id: verifiedUser._id!.toString(),
          name: verifiedUser.name,
          fullName: verifiedUser.fullName,
          email: verifiedUser.email,
          role: verifiedUser.role,
          isActive: verifiedUser.isActive,
          emailVerified: verifiedUser.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during email verification. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    const verifiedUser = await database.verifyEmail(token);

    if (!verifiedUser) {
      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
    }

    return NextResponse.redirect(new URL('/login?verified=true', request.url));

  } catch (error) {
    console.error('Email verification GET error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}