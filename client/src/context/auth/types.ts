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

// State interface
export interface AuthState {
  [IS_AUTHENTICATED]: boolean;
  [USER]: {
    [USER_NAME]: string;
  };
  [COOKIE]: string;
}

// Action types
export type AuthAction =
  | { type: typeof LOGIN; payload: { [USER_NAME]: string } }
  | { type: typeof LOGOUT }
  | { type: typeof SET_COOKIE; payload: string };
