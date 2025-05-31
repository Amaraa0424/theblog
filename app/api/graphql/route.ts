import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { builder } from '@/lib/builder';
import { prisma } from '@/lib/prisma';
import { type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
import '../../../graphql/types/Like';
import '../../../graphql/queries';
import '../../../graphql/mutations';

// Import types
import '../../../graphql/scalars/Date';

const schema = builder.toSchema();

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return { prisma };
    }

    return {
      prisma,
      userId: session.user.id,
      isAdmin: session.user.role === 'ADMIN',
    };
  },
});

export { handler as GET, handler as POST }; 