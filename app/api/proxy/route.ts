import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, method, headers } = body;

    const response = await fetch(url, {
      method,
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to execute request' }, { status: 500 });
  }
}
