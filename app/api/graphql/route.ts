import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { builder } from '../../../lib/builder';
import { verifyToken } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { type NextRequest } from 'next/server';

// Import all type definitions to ensure they're included in the schema
import '../../../graphql/types/User';
import '../../../graphql/types/Post';
import '../../../graphql/types/Comment';
import '../../../graphql/types/Share';
import '../../../graphql/types/View';
import '../../../graphql/types/Tag';
import '../../../graphql/types/Session';
import '../../../graphql/types/VerificationToken';
import '../../../graphql/types/ResetToken';
import '../../../graphql/queries';
import '../../../graphql/mutations';

const schema = builder.toSchema();

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const authorization = req.headers.get('authorization') || '';
    const token = authorization.replace('Bearer ', '');
    
    if (!token) {
      return { prisma };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { prisma };
    }

    return {
      prisma,
      userId: payload.userId,
      isAdmin: payload.isAdmin,
    };
  },
});

export { handler as GET, handler as POST }; 