import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getSession } from 'next-auth/react';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  // Get the session
  const session = await getSession();
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: session ? `Bearer ${session.user.id}` : "",
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

let client: ApolloClient<any> | null = null;

export function getClient() {
  if (!client || typeof window === 'undefined') {
    client = new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }
  return client;
} 