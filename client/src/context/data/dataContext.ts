// Libs
import { createContext } from 'react';

// Types
import { DataState, NewSession } from './types';

export const DataContext = createContext<
  | {
      state: DataState;
      fetchRunningSessions: () => void;
      fetchCreateSession: (sessionPayload: NewSession) => void;
      fetchDeleteSession: (sessionId: string) => void;
      fetchRenewSession: (sessionId: string) => void;
      fetchSessionStatus: (sessionId: string) => void;
      fetchStatsData: () => void;
      fetchPlatformContext: () => void;
      fetchPlatformImages: () => void;
      clearData: () => void;
    }
  | undefined
>(undefined);
