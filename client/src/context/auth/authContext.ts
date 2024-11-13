// Libs
import React from 'react';
import { createContext } from 'react';

// Types
import { AuthState, AuthAction } from './types';

export const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<AuthAction>;
      login: (username: string, password: string) => Promise<void>;
      logout: () => Promise<void>;
      getUser: () => void;
    }
  | undefined
>(undefined);
