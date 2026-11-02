import { ImageResponse } from 'next/og';

export const alt = 'Brike Web — Your website first. You pay when you love it.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 72,
          background: 'linear-gradient(135deg, #0B1F3A 0%, #13305A 40%, #1E6FFF 85%, #5CC8FF 100%)',
          color: 'white',
          fontSize: 64,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85, marginBottom: 16 }}>Brike Web</div>
        <div style={{ maxWidth: 900, lineHeight: 1.1 }}>
          Your website first. You pay when you love it.
        </div>
      </div>
    ),
    { ...size },
  );
}
