'use client';

import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { useEffect, useState } from 'react';
import { getClient } from './apollo-client';

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    setClient(getClient());
  }, []);

  if (!client) {
    return null;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
} 