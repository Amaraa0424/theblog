import type { Metadata } from "next";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/apollo-server";

const GET_POST_METADATA = gql`
  query GetPostMetadata($id: String!) {
    post(id: $id) {
      title
      subtitle
      content
      image
      createdAt
      author {
        name
      }
    }
  }
`;

interface Props {
  params: {
    id: string;
  };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await getClient().query({
      query: GET_POST_METADATA,
      variables: { id: await params.id },
    });

    if (!data?.post) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found.",
        openGraph: {
          title: "Post Not Found",
          description: "The requested post could not be found.",
          type: "article",
          images: [
            {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png",
              width: 1200,
              height: 630,
              alt: "Post Not Found",
            },
          ],
        },
      };
    }

    const post = data.post;
    const description =
      post.subtitle ||
      post.content.replace(/<[^>]*>/g, "").slice(0, 200) + "...";
    const defaultOgImage = `https://theblog-indol.vercel.app/images/logo.jpg`;

    return {
      title: post.title,
      description: description,
      openGraph: {
        title: post.title,
        description: description,
        type: "article",
        authors: [post.author.name],
        publishedTime: post.createdAt,
        images: [
          {
            url: post.image || defaultOgImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: description,
        images: [post.image || defaultOgImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the post.",
      openGraph: {
        title: "Error",
        description: "An error occurred while loading the post.",
        type: "article",
        images: [
          {
            url: "https://placehold.co/1200x630/ef4444/ffffff/png?text=Error",
            width: 1200,
            height: 630,
            alt: "Error",
          },
        ],
      },
    };
  }
}

export default function PostLayout({ children }: Props) {
  return children;
}
