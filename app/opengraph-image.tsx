import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TheBlog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #5a67d8, #4c51bf)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 24,
          }}
        >
          TheBlog
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
          }}
        >
          A modern blog platform for sharing your thoughts and ideas
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 