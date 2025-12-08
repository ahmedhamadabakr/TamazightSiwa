import { NextRequest, NextResponse } from 'next/server'

// Force every request to hit the database and skip any caching layer
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'Authentication is disabled' },
    { status: 404 }
  )
}

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'Authentication is disabled' },
    { status: 404 }
  )
}
