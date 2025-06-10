// This is a Server Component
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { executeQuery } from "@/lib/graphql";
import { DashboardClient } from "./DashboardClient";

const DashboardQuery = `
  query DashboardQuery {
    me {
      id
      name
      email
      avatar
      posts {
        id
        title
        subtitle
        published
        createdAt
      }
      followers {
        id
        follower {
          id
          name
          avatar
        }
      }
      following {
        id
        following {
          id
          name
          avatar
        }
      }
    }
  }
`;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { data } = await executeQuery<{
    me: {
      id: string;
      name: string | null;
      email: string;
      avatar: string | null;
      posts: Array<{
        id: string;
        title: string;
        subtitle: string | null;
        published: boolean;
        createdAt: string;
      }>;
      followers: Array<{
        id: string;
        follower: {
          id: string;
          name: string | null;
          avatar: string | null;
        };
      }>;
      following: Array<{
        id: string;
        following: {
          id: string;
          name: string | null;
          avatar: string | null;
        };
      }>;
    };
  }>(DashboardQuery);

  if (!data?.me) {
    redirect('/login');
  }

  // Add follower and following counts to the data
  const enhancedData = {
    me: {
      ...data.me,
      _count: {
        posts: data.me.posts.length,
        followers: data.me.followers.length,
        following: data.me.following.length
      }
    }
  };

  return <DashboardClient data={enhancedData} />;
} 