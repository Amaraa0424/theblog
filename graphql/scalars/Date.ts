import { builder } from '../../lib/builder';
 
builder.scalarType('Date', {
  serialize: (value) => (value instanceof Date ? value.toISOString() : null),
  parseValue: (value) => (value ? new Date(value) : null),
}); 