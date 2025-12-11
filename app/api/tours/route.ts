import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';

// Force every request to hit the database and skip any caching layer
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// GET all tours or search by name
export async function GET(request: NextRequest) {
  try {
    // Skip build time check in development
    if (process.env.NODE_ENV !== 'development') {
      // Check if we're in build time only in production
      const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

      if (isBuildTime) {
        return NextResponse.json({
          success: false,
          error: 'API routes are not available during build time'
        }, { status: 503 });
      }
    }

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const db = await dbConnect();

    let query: any = {};

    if (title) {
      // Search for tours by title (case-insensitive, partial match)
      query.$or = [
        { title: { $regex: title, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // If no filters, return all tours
    const tours = await db.collection('tours')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Add id field for frontend compatibility
    const serializedTours = tours.map(tour => ({
      ...tour,
      id: tour._id.toString(),
      _id: tour._id.toString()
    }));

    // Explicitly disable caching so new tours are always visible immediately
    return NextResponse.json(
      { success: true, data: serializedTours },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

// POST a new tour
export async function POST(request: NextRequest) {
  try {
    // Skip build time check in development
    if (process.env.NODE_ENV !== 'development') {
      // Check if we're in build time only in production
      const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

      if (isBuildTime) {
        return NextResponse.json({
          success: false,
          error: 'API routes are not available during build time'
        }, { status: 503 });
      }
    }

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const db = await dbConnect();
    const body = await request.json();

    const {
      title,
      description,
      duration,
      price,
      location,
      images,
      category,
      featured = false,
      status = 'active',
      difficulty = 'Easy',
      groupSize = '',
      highlights = []
    } = body;

    // Basic validation
    if (!title || !description || !duration || !price || !location || !category) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = generateSlug(title);

    // Check if slug already exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    while (await db.collection('tours').findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tourData = {
      title,
      slug, // Add slug field
      description,
      duration,
      price: Number(price),
      location,
      images: images || [],
      category,
      featured: Boolean(featured),
      status,
      difficulty,
      groupSize,
      highlights: Array.isArray(highlights) ? highlights : [highlights].filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('tours').insertOne(tourData);
    const newTour = {
      ...tourData,
      id: result.insertedId.toString(),
      _id: result.insertedId.toString()
    };

    // Ensure any statically cached routes get revalidated right after creation
    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json(
      { success: true, data: newTour },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}