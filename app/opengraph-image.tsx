import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'OurLab.fun - Where Ideas Come to Life';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            OurLab.fun
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '300',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Where Ideas Come to Life
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '20px',
              fontWeight: '300',
            }}
          >
            A modern blog platform for authentic expression
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
} 