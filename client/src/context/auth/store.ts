// Constants
import { COOKIE, IS_AUTHENTICATED, USER, USER_NAME } from './constants';

// Types
import { AuthState } from './types';

// Initial state
export const initialState: AuthState = {
  [IS_AUTHENTICATED]: false,
  [USER]: {
    [USER_NAME]: '',
  },
  [COOKIE]: '',
};
