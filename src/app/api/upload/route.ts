import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { batch } from '~/server/db/schema';
import { db } from '~/server/db';

export async function POST(request: NextRequest) {
  console.log('Request received');
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:8000',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    console.log('Processing form data...');
    const formData = await request.formData();
    console.log('FormData received:', Object.fromEntries(formData.entries()));
    
    // Get all files from formData
    const files = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('file'))
      .map(([_, file]) => file);

    console.log('Files array length:', files.length);

    if (!files || files.length === 0) {
      console.log('No files found in request');
      return NextResponse.json(
        { error: 'No files were uploaded. Please ensure files are sent with keys starting with "file"' },
        { status: 400, headers }
      );
    }

    // Process files
    const fileDetails = files.map(file => {
      if (file instanceof Blob) {
        return {
          name: (file as any).name || 'unnamed',
          type: file.type,
          size: file.size,
          status: 'pending',
        };
      }
      return { name: 'unknown' };
    });

    console.log('Processed file details:', fileDetails);

    const [result] = await db.insert(batch).values({
      isDone: new Date(Date.now() + 5000),
      files: fileDetails
    }).returning();

    console.log('Created batch in database:', result);

    const response = NextResponse.json(
      {
        ...result,
        status: 'pending',
      },
      { status: 200, headers }
    );

    console.log('Sending response:', response);
    return response;

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to process upload',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
} 