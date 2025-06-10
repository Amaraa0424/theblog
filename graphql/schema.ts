import { builder } from '@/lib/builder';

// Import all type definitions to ensure they're included in the schema
import * as types from '@/graphql/types';  // Import all types
import '@/graphql/queries';
import '@/graphql/mutations';
import '@/graphql/scalars/Date';

// Initialize all types
Object.values(types);

export const schema = builder.toSchema(); 