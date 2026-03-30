import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TikTok Downloader Pro',
  description: 'Download your favorite TikTok videos without watermarks instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
        <footer>
          <p>© {new Date().getFullYear()} TikTok Downloader Pro. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
