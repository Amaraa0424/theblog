import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #000 0%, #333 50%, #000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '22%',
          fontWeight: 'bold',
          fontFamily: 'system-ui',
        }}
      >
        OL
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
} 