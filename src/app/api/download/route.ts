import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Strip query parameters that might break the TikWM API regex
    let cleanUrl = url;
    try {
      const urlObj = new URL(url);
      urlObj.search = '';
      cleanUrl = urlObj.toString();
    } catch(e) {
      // Ignore if URL parse fails here, let the API handle it
    }

    const params = new URLSearchParams();
    params.append('url', cleanUrl);
    params.append('hd', '1');

    const result = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      body: params
    });

    const data = await result.json();

    if (data.code === 0 && data.data) {
      // Format data to match what the frontend expects
      const mappedData = {
        id: data.data.id || '',
        title: data.data.title || '',
        cover: [data.data.cover || ''],
        video: [data.data.hdplay || data.data.play || ''],
        music: [data.data.music || ''],
        author: {
          nickname: data.data.author?.nickname || 'Unknown',
          avatar: [data.data.author?.avatar || '']
        }
      };

      return NextResponse.json({
        success: true,
        data: mappedData
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: data.msg || 'Failed to find video data from main API' }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}
