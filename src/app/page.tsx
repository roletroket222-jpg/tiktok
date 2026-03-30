'use client';

import { useState } from 'react';

type VideoQuality = {
  label: string;
  url: string;
  size: string;
};

type VideoData = {
  id: string;
  title: string;
  cover: string;
  duration: number;
  videoQualities: VideoQuality[];
  musicUrl: string;
  author: {
    nickname: string;
    avatar: string;
  };
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<VideoData | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setData(null);
    setSelectedQuality(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch video');
      }

      setData(result.data);
      // Auto-select first quality (HD if available)
      if (result.data.videoQualities?.length > 0) {
        setSelectedQuality(result.data.videoQualities[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (targetUrl: string) => {
    window.open(targetUrl, '_blank');
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const qualityIcon = (label: string) => {
    if (label === 'HD') return '🎯';
    if (label.includes('Watermark')) return '💧';
    return '📹';
  };

  const qualityColor = (label: string, selected: boolean) => {
    if (selected) {
      if (label === 'HD') return 'var(--primary)';
      return 'var(--accent)';
    }
    return 'transparent';
  };

  return (
    <main className="w-full">
      <h1 className="animate-fade-in">TikTok Downloader</h1>
      <p className="subtitle animate-fade-in">Download your favorite content in any quality, without watermarks.</p>

      <form onSubmit={handleFetch} className="glass-panel animate-fade-in flex-col items-center mb-4">
        <label htmlFor="url-input" style={{ marginBottom: '8px', fontWeight: 500 }}>
          Paste Video Link Here
        </label>
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
          onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px var(--focus-ring)')}
          onBlur={(e) => (e.target.style.boxShadow = 'none')}
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
            gap: '8px',
          }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <i>Fetching video info...</i>
            </>
          ) : (
            '🔍 Get Download Links'
          )}
        </button>
      </form>

      {error && (
        <div
          className="glass-panel animate-fade-in"
          style={{ borderLeft: '4px solid #ef4444', marginBottom: '1rem' }}
        >
          <p style={{ color: '#fca5a5' }}>⚠️ {error}</p>
        </div>
      )}

      {data && (
        <div className="glass-panel animate-fade-in flex-col gap-4 mt-8">
          {/* Author + Meta */}
          <div className="flex items-center gap-4" style={{ marginBottom: '0.5rem' }}>
            {data.author.avatar && (
              <img
                src={data.author.avatar}
                alt={data.author.nickname}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
              />
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>@{data.author.nickname}</h3>
              {data.duration > 0 && (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⏱ {formatDuration(data.duration)}</span>
              )}
            </div>
          </div>

          {/* Title */}
          {data.title && (
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
              {data.title.length > 120 ? data.title.slice(0, 120) + '…' : data.title}
            </p>
          )}

          {/* Thumbnail */}
          {data.cover && (
            <img
              src={data.cover}
              alt="Video Thumbnail"
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '1rem',
              }}
            />
          )}

          {/* Quality Selector */}
          {data.videoQualities.length > 0 && (
            <>
              <p style={{ fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>
                🎬 Pilih Kualitas Video
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(data.videoQualities.length, 3)}, 1fr)`,
                  gap: '10px',
                  marginBottom: '1rem',
                }}
              >
                {data.videoQualities.map((q) => {
                  const isSelected = selectedQuality?.label === q.label;
                  return (
                    <button
                      key={q.label}
                      onClick={() => setSelectedQuality(q)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '12px',
                        border: isSelected ? `2px solid ${qualityColor(q.label, true)}` : '2px solid var(--card-border)',
                        background: isSelected ? `${qualityColor(q.label, true)}22` : 'transparent',
                        color: isSelected ? '#fff' : '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: isSelected ? 700 : 400,
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{qualityIcon(q.label)}</span>
                      <span style={{ fontSize: '0.85rem' }}>{q.label}</span>
                      {q.size && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '100px',
                            background: isSelected ? qualityColor(q.label, true) : 'var(--card-border)',
                            color: '#fff',
                            marginTop: '2px',
                          }}
                        >
                          {q.size}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Download Button */}
              {selectedQuality && (
                <button
                  onClick={() => handleDownload(selectedQuality.url)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    marginBottom: '10px',
                  }}
                >
                  ⬇️ Download {selectedQuality.label}
                  {selectedQuality.size ? ` (${selectedQuality.size})` : ''}
                </button>
              )}
            </>
          )}

          {/* Audio Download */}
          {data.musicUrl && (
            <button
              onClick={() => handleDownload(data.musicUrl)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: 'var(--foreground)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--card-border)')}
            >
              🎵 Download Audio Only
            </button>
          )}
        </div>
      )}
    </main>
  );
}
