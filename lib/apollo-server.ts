import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { cookies } from 'next/headers';
import { onError } from '@apollo/client/link/error';

export function getClient() {
  const cookieStore = cookies();
  
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Extensions:`,
          extensions,
        ),
      );
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`, {
        operation: operation.operationName,
        variables: operation.variables,
      });
    }
    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, httpLink]),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'network-only', // Disable cache for debugging
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
} 