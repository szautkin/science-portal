import * as React from 'react';
import { useReducer, useCallback } from 'react';

import {
  AVAILABLE_IMAGES,
  BASE_URL,
  CLEAR_DATA,
  CONTEXT_URL,
  CREATE_SESSION,
  CREATE_SESSION_URL,
  DELETE_SESSION,
  DELETE_SESSION_URL,
  DESKTOP,
  FETCH_SESSION_URL,
  FETCHING_SESSION,
  IMAGE_URL,
  PLATFORM_CONTEXT,
  PROP_REPO_SECRET,
  PROP_REPO_USER_NAME,
  PROP_SESSION_CORES,
  PROP_SESSION_IMAGE,
  PROP_SESSION_NAME,
  PROP_SESSION_PROJECT,
  PROP_SESSION_RAM,
  PROP_SESSION_TYPE,
  RENEW_SESSION,
  RENEW_SESSION_URL,
  REPOSITORY_URL,
  SESSION_URL,
  SESSION_VIEW_URL,
  SET_CONTEXT,
  SET_IMAGES,
  SET_REPO,
  SET_SESSION,
  SET_SESSIONS,
  SET_SESSIONS_STATS,
} from './constants';
import { DataContext } from './dataContext';
import {
  APP_FETCH_OPTIONS,
  APP_FETCH_RESULT,
  APP_FETCH_URL,
  APP_PART_TYPE,
  RUNNING_SESSIONS,
  SESSION_STATS,
} from '../app/constants';
import { initialState } from './store';
import { dataReducer } from './reducer';
import { useApp } from '../app/useApp';
import { useAuth } from '../auth/useAuth';
import processPlatformUsage from '../../utilities/usage';
import {
  getTransformedSessions,
  transformSession,
} from '../../utilities/sessions';
import {
  Context,
  Image,
  NewCustomSession,
  NewSession,
  Session,
  StatsData,
} from './types';
import { getImagesByType } from '../../utilities/images';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { appFetch } = useApp();
  const { state: authState } = useAuth();
  const fetchStatsData = useCallback(async () => {
    try {
      const responseData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${SESSION_URL}/?view=stats`,
        [APP_PART_TYPE]: SESSION_STATS,
      });

      const rawStatsData = responseData?.[APP_FETCH_RESULT] as unknown;
      const reprocessedStatsData = processPlatformUsage(
        rawStatsData as StatsData,
      );

      dispatch({ type: SET_SESSIONS_STATS, payload: reprocessedStatsData });
    } catch (e) {
      console.error('Fetch data stats failed:', e);
    }
  }, [appFetch, authState]);

  const fetchRunningSessions = useCallback(async () => {
    try {
      const sessionsData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${SESSION_URL}`,
        [APP_PART_TYPE]: RUNNING_SESSIONS,
      });
      const rawSessions = sessionsData?.[APP_FETCH_RESULT] as unknown;
      const reprocessedSessions = getTransformedSessions(
        rawSessions as Session[],
      );
      dispatch({
        type: SET_SESSIONS,
        payload: { sessions: reprocessedSessions },
      });
    } catch (e) {
      console.error('Fetch sessions failed:', e);
    }
  }, [appFetch, authState]);

  const fetchDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${DELETE_SESSION_URL}/${sessionId}`,
          [APP_PART_TYPE]: DELETE_SESSION,
          [APP_FETCH_OPTIONS]: {
            method: 'DELETE',
          },
        });
        await fetchRunningSessions();
      } catch (e) {
        console.error('Fetch delete sessions failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );

  const fetchRenewSession = useCallback(
    async (sessionId: string) => {
      try {
        const renewSession = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${RENEW_SESSION_URL}/${sessionId}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ action: 'renew' }),
          },
          [APP_PART_TYPE]: RENEW_SESSION,
        });
        if (renewSession) {
          await fetchRunningSessions();
        }
      } catch (e) {
        console.error('Fetch renew sessions failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );

  const fetchSessionStatus = useCallback(
    async (sessionId: string) => {
      try {
        const sessionData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${FETCH_SESSION_URL}/${sessionId}`,
          [APP_PART_TYPE]: FETCHING_SESSION,
        });
        const rawSession = sessionData?.[APP_FETCH_RESULT] as unknown;
        const reprocessedSession = transformSession(rawSession as Session);
        dispatch({
          type: SET_SESSION,
          payload: { session: reprocessedSession },
        });
      } catch (e) {
        console.error('Fetch session status failed:', e);
      }
    },
    [appFetch, authState],
  );

  const fetchPlatformContext = useCallback(async () => {
    try {
      const contextData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${CONTEXT_URL}`,
        [APP_PART_TYPE]: PLATFORM_CONTEXT,
      });
      const rawContext = contextData?.[APP_FETCH_RESULT] as unknown;
      dispatch({
        type: SET_CONTEXT,
        payload: rawContext as Context,
      });
    } catch (e) {
      console.error('Fetch context failed:', e);
    }
  }, [appFetch, authState]);

  const fetchPlatformImages = useCallback(async () => {
    try {
      const imagesData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${IMAGE_URL}`,
        [APP_PART_TYPE]: AVAILABLE_IMAGES,
      });
      const rawImages = imagesData?.[APP_FETCH_RESULT] as unknown;
      const imagesByType = getImagesByType(rawImages as Image[]);

      dispatch({
        type: SET_IMAGES,
        payload: { images: imagesByType },
      });
    } catch (e) {
      console.error('Fetch images failed:', e);
    }
  }, [appFetch, authState]);

  const fetchPlatformRepos = useCallback(async () => {
    try {
      const imagesData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${REPOSITORY_URL}`,
        [APP_PART_TYPE]: AVAILABLE_IMAGES,
      });
      const repoArray = imagesData?.[APP_FETCH_RESULT] as unknown;

      dispatch({
        type: SET_REPO,
        payload: { repositories: repoArray as string[] },
      });
    } catch (e) {
      console.error('Fetch repos failed:', e);
    }
  }, [appFetch, authState]);

  const fetchCreateSession = useCallback(
    async (sessionPayload: NewSession) => {
      const submitPayload: NewSession = {
        [PROP_SESSION_PROJECT]: sessionPayload[PROP_SESSION_PROJECT],
        [PROP_SESSION_NAME]: sessionPayload[PROP_SESSION_NAME],
        [PROP_SESSION_TYPE]: sessionPayload[PROP_SESSION_TYPE],
        [PROP_SESSION_IMAGE]: sessionPayload[PROP_SESSION_IMAGE],
      };
      if (sessionPayload[PROP_SESSION_TYPE] !== DESKTOP) {
        submitPayload[PROP_SESSION_CORES] = sessionPayload[PROP_SESSION_CORES];
        submitPayload[PROP_SESSION_RAM] = sessionPayload[PROP_SESSION_RAM];
      }

      try {
        const sessionData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${CREATE_SESSION_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(submitPayload),
          },
          [APP_PART_TYPE]: CREATE_SESSION,
        });
        if (sessionData) {
          await fetchRunningSessions();
        }
      } catch (e) {
        console.error('Fetch create session failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );
  const fetchCreateCustomSession = useCallback(
    async (sessionPayload: NewCustomSession) => {
      const submitPayload: NewCustomSession = {
        [PROP_SESSION_NAME]: sessionPayload[PROP_SESSION_NAME],
        [PROP_SESSION_TYPE]: sessionPayload[PROP_SESSION_TYPE],
        [PROP_SESSION_IMAGE]: sessionPayload[PROP_SESSION_IMAGE],
        [PROP_REPO_USER_NAME]: sessionPayload[PROP_REPO_USER_NAME],
      };
      if (sessionPayload[PROP_SESSION_TYPE] !== DESKTOP) {
        submitPayload[PROP_SESSION_CORES] = sessionPayload[PROP_SESSION_CORES];
        submitPayload[PROP_SESSION_RAM] = sessionPayload[PROP_SESSION_RAM];
      }

      try {
        const sessionData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${CREATE_SESSION_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Repository-Secret': sessionPayload[PROP_REPO_SECRET],
              'X-Repository-username': sessionPayload[PROP_REPO_USER_NAME],
            },
            body: new URLSearchParams(submitPayload),
          },
          [APP_PART_TYPE]: CREATE_SESSION,
        });
        console.log('is res', sessionData);
        if (sessionData) {
          await fetchRunningSessions();
        }
      } catch (e) {
        console.error('Fetch create session failed:', e);
      }
    },
    [appFetch, authState, fetchRunningSessions],
  );

  const clearData = useCallback(async () => {
    dispatch({
      type: CLEAR_DATA,
    });
  }, [dispatch]);

  return (
    <DataContext.Provider
      value={{
        state,
        fetchRunningSessions,
        fetchCreateSession,
        fetchCreateCustomSession,
        fetchDeleteSession,
        fetchRenewSession,
        fetchSessionStatus,
        fetchStatsData,
        fetchPlatformContext,
        fetchPlatformImages,
        fetchPlatformRepos,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
