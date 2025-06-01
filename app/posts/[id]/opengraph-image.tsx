import { ImageResponse } from 'next/og';
import { getClient } from '@/lib/apollo-server';
import { gql } from '@apollo/client';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      title
      subtitle
      author {
        name
      }
    }
  }
`;

export default async function OG({ params }: { params: { id: string } }) {
  try {
    const { data } = await getClient().query({
      query: GET_POST,
      variables: { id: params.id },
    });

    const post = data.post;
    const title = post.title;
    const subtitle = post.subtitle || '';
    const author = post.author.name;

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #5a67d8, #4c51bf)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '48px',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 16,
              maxWidth: '80%',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 24,
                maxWidth: '70%',
              }}
            >
              {subtitle}
            </div>
          )}
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            By {author} · TheBlog
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    // Fallback OG image
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #ef4444, #dc2626)',
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
              fontSize: 48,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 24,
            }}
          >
            Post Not Found
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            TheBlog
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
} 