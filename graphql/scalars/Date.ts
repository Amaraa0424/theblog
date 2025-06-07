import { builder } from '@/lib/builder';

const dateTimeConfig = {
  serialize: (value: unknown) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return null;
  },
  parseValue: (value: unknown) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid DateTime value');
      }
      return date;
    }
    throw new Error('DateTime must be a string or number');
  },
};

// Implement both Date and DateTime scalars with the same configuration
builder.scalarType('Date', dateTimeConfig);
builder.scalarType('DateTime', dateTimeConfig); 