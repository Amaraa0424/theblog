import { builder } from '../../lib/builder';

builder.prismaObject('UserIpAddress', {
  fields: (t) => ({
    id: t.exposeID('id'),
    ipAddress: t.exposeString('ipAddress'),
    userAgent: t.exposeString('userAgent'),
    user: t.relation('user'),
    userId: t.exposeString('userId', { nullable: true }),
    isGuest: t.exposeBoolean('isGuest'),
    lastSeenAt: t.expose('lastSeenAt', { type: 'DateTime' }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
}); 