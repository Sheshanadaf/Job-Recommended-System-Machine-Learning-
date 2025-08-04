// import { defineBackend } from '@aws-amplify/backend';
// import { auth } from './auth/resource';
// import { data } from './data/resource';

// /**
//  * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
//  */
// defineBackend({
//   auth,
//   data,
// });

import { defineBackend } from '@aws-amplify/backend';
import { loginFunction } from './login/resource';
import { callbackFunction } from './callback/resource';
import { logoutFunction } from './logout/resource';
import { userFunction } from './user/resource';

defineBackend({
  loginFunction,
  callbackFunction,
  logoutFunction,
  userFunction,
});

