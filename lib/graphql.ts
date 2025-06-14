import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
  credentials: 'include',
});

const getAuthLink = () => {
  return setContext(async (_, { headers: contextHeaders }) => {
    try {
      // First try to get the session directly
      const session = await getServerSession(authOptions);
      
      // If we have a session, use it
      if (session?.user?.id) {
        return {
          headers: {
            ...contextHeaders,
            'Authorization': `Bearer ${session.user.id}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        };
      }

      // For server-side requests, try to get the token from headers
      const headersList = headers();
      const token = await getToken({
        req: {
          headers: headersList,
          cookies: {},
        } as any,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // If we have a token, use it
      if (token?.sub) {
        return {
          headers: {
            ...contextHeaders,
            'Authorization': `Bearer ${token.sub}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        };
      }

      // If we have neither session nor token, return without authorization
      return {
        headers: {
          ...contextHeaders,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };
    } catch (error) {
      console.error('Error getting auth token:', error);
      return {
        headers: {
          ...contextHeaders,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };
    }
});
};

export async function executeQuery<T>(
  query: string,
  variables?: Record<string, any>
): Promise<{ data: T }> {
  try {
    const authLink = getAuthLink();
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
      },
      credentials: 'include',
    });

    const { data } = await client.query({
      query: gql`${query}`,
      variables,
      context: {
        credentials: 'include',
      },
    });
    return { data };
  } catch (error) {
    console.error('GraphQL Query Error:', error);
    throw error;
  }
} 