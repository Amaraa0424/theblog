import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { cookies } from 'next/headers';
import { setContext } from '@apollo/client/link/context';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function getClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie: RequestCookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
  
  // Log cookie information in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Cookie Store:', {
      hasSessionToken: cookieStore.has('next-auth.session-token'),
      allCookies: cookieStore.getAll().map((c: RequestCookie) => c.name),
    });
  }

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
    credentials: 'include',
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie: cookieHeader,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
} 