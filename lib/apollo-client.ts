import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from local session
  const session = await getSession();

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: session ? `Bearer ${session.user?.email}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function getClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });
} 