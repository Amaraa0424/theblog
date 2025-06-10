import { ImageResponse } from 'next/og';
import { getClient } from '@/lib/apollo-server';
import { gql } from '@apollo/client';

const GET_POST_IMAGE = gql`
  query GetPostImage($id: String!) {
    post(id: $id) {
      image
      title
    }
  }
`;

export const runtime = 'edge';
export const alt = 'Blog Post Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const client = await getClient();
    const { data } = await client.query({
      query: GET_POST_IMAGE,
      variables: { id: params.id },
    });

    if (!data?.post?.image) {
      // Fallback to a default image if no post image is available
      return new ImageResponse(
        (
          <div
            style={{
              background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: '60px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              {data?.post?.title || 'Blog Post'}
            </div>
          </div>
        ),
        {
          ...size,
          fonts: [
            {
              name: 'Inter',
              data: await fetch(
                new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap')
              ).then((res) => res.arrayBuffer()),
              style: 'normal',
              weight: 700,
            },
          ],
        }
      );
    }

    // Return an image with the post's actual image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
          }}
        >
          
          <img
            src={data.post.image}
            alt={data.post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Return a fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            background: '#ef4444',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          Error Loading Image
        </div>
      ),
      {
        ...size,
      }
    );
  }
} 