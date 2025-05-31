import { builder } from '@/lib/builder';

// Import all type definitions to ensure they're included in the schema
import '@/graphql/types';  // This imports all types in the correct order
import '@/graphql/queries';
import '@/graphql/mutations';
import '@/graphql/scalars/Date';

export const schema = builder.toSchema(); 