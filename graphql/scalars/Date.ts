import { GraphQLScalarType, Kind } from 'graphql';
import { builder } from '../../lib/builder';

const dateTimeConfig = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('DateTime must be a Date object');
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid DateTime value');
      }
      return date;
    }
    throw new Error('DateTime must be a string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid DateTime value');
      }
      return date;
    }
    return null;
  },
});

const dateConfig = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    throw new Error('Date must be a Date object');
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date value');
      }
      return date;
    }
    throw new Error('Date must be a string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date value');
      }
      return date;
    }
    return null;
  },
});

builder.addScalarType('DateTime', dateTimeConfig);
builder.addScalarType('Date', dateConfig);

export default builder; 