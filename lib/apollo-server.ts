import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { cookies } from 'next/headers';
import { onError } from '@apollo/client/link/error';
import { ServerError } from '@apollo/client/link/utils';

export async function getClient() {
  const cookieStore = cookies();
  const cookieArray = await Promise.resolve(cookieStore.getAll());
  const cookieString = cookieArray.map(c => `${c.name}=${c.value}`).join('; ');
  
  // Log cookie information in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Cookie context:', {
      hasCookies: cookieArray.length > 0,
      cookieCount: cookieArray.length,
    });
  }

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error(
          '[GraphQL error]:', {
            message,
            locations,
            path,
            extensions,
            operationName: operation.operationName,
            variables: operation.variables,
            context: operation.getContext(),
          }
        );
      });
    }
    if (networkError) {
      const serverError = networkError as ServerError;
      console.error('[Network error]:', {
        name: networkError.name,
        message: networkError.message,
        stack: networkError.stack,
        statusCode: 'statusCode' in serverError ? serverError.statusCode : undefined,
        operation: operation.operationName,
        variables: operation.variables,
        context: operation.getContext(),
      });
    }
    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
    credentials: 'include',
    headers: {
      cookie: cookieString,
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, httpLink]),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      },
      mutate: {
        errorPolicy: 'all',
      },
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      }
    },
  });
} 