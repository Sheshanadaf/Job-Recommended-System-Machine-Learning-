import { defineFunction } from '@aws-amplify/backend';

export const userFunction = defineFunction({
  name: 'user-function',
  entry: './handler.ts',
});
