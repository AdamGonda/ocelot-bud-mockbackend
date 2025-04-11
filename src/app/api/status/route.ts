import { NextRequest, NextResponse } from 'next/server';

// Mock data for different statuses
const mockData = {
  '0': {
    status: 'completed',
    files: [
      {
        name: 'Quartzdevs Freelancer Contract - Adam Gonda - Final.pdf',
        status: 'completed',
      },
    //   {
    //     name: 'file2.txt',
    //     status: 'failed',
    //   },
    //   {
    //     name: 'file3.txt',
    //     status: 'completed',
    //   },
    ]
  },
  '1': {
    status: 'failed',
    files: [
      {
        name: 'Quartzdevs Freelancer Contract - Adam Gonda - Final.pdf',
        status: 'completed',
      },
    //   {
    //     name: 'file2.txt',
    //     status: 'failed',
    //   },
    //   {
    //     name: 'file3.txt',
    //     status: 'completed',
    //   },
    ]
  },
};

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

    // Get the mock data for the provided ID
    const data = mockData[id as keyof typeof mockData];

    // If no data found for the ID
    if (!data) {
      return NextResponse.json(
        { error: `No data found for ID: ${id}` },
        { status: 404, headers: corsHeaders }
      );
    }

    // Return the mock data
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
