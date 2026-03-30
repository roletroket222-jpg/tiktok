'use client';

import { useState } from 'react';

type VideoData = {
  id: string;
  title: string;
  cover: string[];
  video: string[];
  music: string[];
  author: {
    nickname: string;
    avatar: string[];
  };
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<VideoData | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch video');
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDirectly = (downloadUrl: string) => {
    // Open in new tab since direct download is blocked by CORS on external CDNs
    window.open(downloadUrl, '_blank');
  };

  return (
    <main className="w-full">
      <h1 className="animate-fade-in">TikTok Downloader</h1>
      <p className="subtitle animate-fade-in">Download your favorite content with no watermarks.</p>

      <form onSubmit={handleDownload} className="glass-panel animate-fade-in flex-col items-center mb-4">
        <label htmlFor="url-input" style={{ marginBottom: '8px', fontWeight: 500 }}>Paste Video Link Here</label>
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.tiktok.com/@username/video/1234567890"
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--card-border)',
            background: 'var(--input-bg)',
            color: 'var(--foreground)',
            fontSize: '1rem',
            marginBottom: '16px',
            outline: 'none',
            transition: 'var(--transition)',
          }}
          onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--focus-ring)'}
          onBlur={(e) => e.target.style.boxShadow = 'none'}
        />

        <button 
          type="submit" 
          disabled={loading || !url}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading || !url ? 'not-allowed' : 'pointer',
            opacity: loading || !url ? 0.7 : 1,
            transition: 'var(--transition)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <i>Fetching data...</i>
            </>
          ) : (
            'Get Download Links'
          )}
        </button>
      </form>

      {error && (
        <div className="glass-panel animate-fade-in" style={{ borderLeft: '4px solid #ef4444', marginBottom: '1rem' }}>
          <p style={{ color: '#fca5a5' }}>{error}</p>
        </div>
      )}

      {data && (
        <div className="glass-panel animate-fade-in flex-col gap-4 mt-8">
          <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
            <img 
              src={data.author.avatar[0]} 
              alt={data.author.nickname} 
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <div>
              <h3 style={{ margin: 0 }}>{data.author.nickname}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>{data.title}</p>
            </div>
          </div>
          
          <img 
            src={data.cover[0]} 
            alt="Video Cover" 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} 
          />

          <div className="flex-col gap-4">
            <button 
              onClick={() => handleDownloadDirectly(data.video[0])}
              style={{
                width: '100%', padding: '12px', background: 'var(--accent)', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                marginBottom: '10px'
              }}
            >
              Download Video (No Watermark)
            </button>
            <button 
              onClick={() => handleDownloadDirectly(data.music[0])}
              style={{
                width: '100%', padding: '12px', background: 'transparent', color: 'var(--foreground)',
                border: '1px solid var(--accent)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
              }}
            >
              Download Audio Only
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
