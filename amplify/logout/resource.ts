import { defineFunction } from '@aws-amplify/backend';

export const logoutFunction = defineFunction({
  name: 'logout-function',
  entry: './handler.ts',
});
