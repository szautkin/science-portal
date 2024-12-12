// Libs
import { createContext } from 'react';

// Types
import { DataState, NewCustomSession, NewSession } from './types';

export const DataContext = createContext<
  | {
      state: DataState;
      fetchRunningSessions: () => void;
      fetchCreateSession: (sessionPayload: NewSession) => void;
      fetchCreateCustomSession: (
        customSessionPayload: NewCustomSession,
      ) => void;
      fetchDeleteSession: (sessionId: string) => void;
      fetchRenewSession: (sessionId: string) => void;
      fetchSessionStatus: (sessionId: string) => void;
      fetchStatsData: () => void;
      fetchPlatformContext: () => void;
      fetchPlatformImages: () => void;
      fetchPlatformRepos: () => void;
      clearData: () => void;
    }
  | undefined
>(undefined);
