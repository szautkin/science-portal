// Constants
import {
  COOKIE,
  IS_AUTHENTICATED,
  LOGIN,
  LOGOUT,
  SET_COOKIE,
  USER,
  USER_NAME,
} from './constants';

// Types
import { AuthAction, AuthState } from './types';

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        [USER]: {
          [USER_NAME]: action.payload[USER_NAME],
        },
      };
    case LOGOUT:
      return {
        ...state,
        [IS_AUTHENTICATED]: false,
        [USER]: {
          [USER_NAME]: '',
        },
        [COOKIE]: '',
      };
    case SET_COOKIE:
      return {
        ...state,
        [COOKIE]: action.payload,
        [IS_AUTHENTICATED]: true,
      };
    default:
      return state;
  }
};
