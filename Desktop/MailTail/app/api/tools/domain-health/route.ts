import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  try {
    const apiUrl = `https://www.suped.com/api/trpc/dmarc.domainHealthCheck?input=${encodeURIComponent(
      JSON.stringify({ json: { domain } })
    )}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Domain health check error:', error);
    return NextResponse.json(
      { error: 'Failed to check domain health' },
      { status: 500 }
    );
  }
}
