import { defineFunction } from '@aws-amplify/backend';

export const callbackFunction = defineFunction({
  name: 'callback-function',
  entry: './handler.ts',
});
