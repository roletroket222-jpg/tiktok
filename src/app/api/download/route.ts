import { NextResponse } from 'next/server';
import Tiktok from '@tobyg74/tiktok-api-dl';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Try @tobyg74/tiktok-api-dl version 1
    const result = await Tiktok.Downloader(url, {
      version: 'v1',
    });

    if (result.status === 'success') {
      return NextResponse.json({
        success: true,
        data: result.result
      }, { status: 200 });
    } else {
      // Fallback or error
      return NextResponse.json({ error: 'Failed to find video data from main API' }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}
