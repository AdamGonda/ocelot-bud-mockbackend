import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { batch } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    // Get the ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Check if ID is provided
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    //  {
    //   status: 'completed',
    //   files: [
    //     {
    //       name: 'Quartzdevs Freelancer Contract - Adam Gonda - Final.pdf',
    //       status: 'completed',
    //     },
    //   ]
    // }
    const data = await db.query.batch.findFirst({
      where: eq(batch.id, parseInt(id)),
    });

    // If no data found for the ID
    if (!data) {
      return NextResponse.json(
        { error: `No data found for ID: ${id}` },
        { status: 404, headers: corsHeaders }
      );
    }

    const isCompleted = data.isDone ? new Date(data.isDone) < new Date() : false;

    if (data.status === 'completed') {
      return NextResponse.json(data, { headers: corsHeaders });
    }

    const updateBatch = {
      ...data,
      status: isCompleted ? 'completed' : 'pending',
      files: (data.files as any[]).map((file) => ({
        ...file,
        status: getFileStatus(),
      })),
    };

    await db.update(batch).set({
      status: updateBatch.status,
      files: updateBatch.files,
    }).where(eq(batch.id, parseInt(id)));

    // Return the mock data
    return NextResponse.json(updateBatch, { headers: corsHeaders });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

function getFileStatus() {
  return Math.random() < 0.5 ? 'completed' : 'failed';
}