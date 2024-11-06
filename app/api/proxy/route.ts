import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, method, headers, body: requestBody } = body;

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // POSTリクエストでbodyがある場合のみ追加
    if (method === 'POST' && requestBody) {
      fetchOptions.body =
        typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to execute request' }, { status: 500 });
  }
}
