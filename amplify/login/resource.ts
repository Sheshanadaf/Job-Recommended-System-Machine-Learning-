import { defineFunction } from '@aws-amplify/backend';

export const loginFunction = defineFunction({
  name: 'login-function',
  entry: './handler.ts',
});
