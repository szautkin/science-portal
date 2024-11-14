import React from 'react';
import { createContext } from 'react';

import { AppState, AppFetch, FetchResult, AppAction, AppConfig } from './types';

export const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
      requestDeleteSessionConfirmation: ({
        sessionId,
        sessionName,
      }: {
        sessionId: string;
        sessionName: string;
      }) => void;
      clearDeleteSessionInfo: () => void;
      appFetch: (args: AppFetch) => Promise<FetchResult>;
      setConfig: (config: AppConfig) => void;
    }
  | undefined
>(undefined);
