import { NextResponse } from 'next/server';

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

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
      const d = data.data;

      // Build quality options — only include ones that have a valid URL
      const videoQualities: { label: string; url: string; size: string }[] = [];

      if (d.hdplay) {
        videoQualities.push({
          label: 'HD',
          url: d.hdplay,
          size: formatBytes(d.hd_size),
        });
      }
      if (d.play) {
        videoQualities.push({
          label: 'Normal (No Watermark)',
          url: d.play,
          size: formatBytes(d.size),
        });
      }
      if (d.wmplay) {
        videoQualities.push({
          label: 'With Watermark',
          url: d.wmplay,
          size: formatBytes(d.wm_size),
        });
      }

      const mappedData = {
        id: d.id || '',
        title: d.title || '',
        cover: d.cover || '',
        duration: d.duration || 0,
        videoQualities,
        musicUrl: d.music || '',
        author: {
          nickname: d.author?.nickname || 'Unknown',
          avatar: d.author?.avatar || '',
        },
      };

      return NextResponse.json({ success: true, data: mappedData }, { status: 200 });
    } else {
      return NextResponse.json({ error: data.msg || 'Failed to find video data' }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}
