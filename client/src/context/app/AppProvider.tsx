// Libs
import * as React from 'react';
import { Dispatch, useCallback, useReducer } from 'react';

// Constants
import {
  APP_ACTION_MESSAGE,
  APP_ACTION_TYPE,
  APP_FETCH_OPTIONS,
  APP_FETCH_RESULT,
  APP_FETCH_URL,
  APP_IS_LOADING,
  APP_PART_TYPE,
  FETCH_FAILED,
  SET_LOADING,
  SET_DELETE_SESSION_INFO,
  CLEAR_DELETE_SESSION_INFO,
  SET_APP_CONFIG,
} from './constants';

// Reducer
import { appReducer } from './reducer';

// Store
import { initialState } from './store';

// Types
import { AppAction, AppConfig, AppFetch } from './types';

// Utils
import { fetchWithAuth } from './authFetch';

// Context
import { AppContext } from './appContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const requestDeleteSessionConfirmation = React.useCallback(
    ({
      sessionId,
      sessionName,
    }: {
      sessionId: string;
      sessionName: string;
    }) => {
      dispatch({
        type: SET_DELETE_SESSION_INFO,
        payload: {
          sessionId,
          sessionName,
        },
      });
    },
    [dispatch],
  );

  const clearDeleteSessionInfo = React.useCallback(() => {
    dispatch({
      type: CLEAR_DELETE_SESSION_INFO,
    });
  }, [dispatch]);

  const appFetch = useCallback(async (payload: AppFetch) => {
    dispatch({
      type: SET_LOADING,
      payload: {
        [APP_IS_LOADING]: true,
        [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
      },
    });
    try {
      const response = await fetchWithAuth(
        payload[APP_FETCH_URL],
        payload[APP_FETCH_OPTIONS],
      );
      if (response.ok) {
        try {
          const contentType = response.headers.get('Content-Type');

          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return {
              [APP_FETCH_RESULT]: data,
            };
          } else if (contentType && contentType.includes('text/')) {
            const data = await response.text();
            return {
              [APP_FETCH_RESULT]: data,
            };
          } else {
            dispatch({
              type: FETCH_FAILED,
              payload: {
                [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
                [APP_ACTION_MESSAGE]: `Unsupported content type: ${contentType || 'unknown'}`,
              },
            });
          }
        } catch (error) {
          dispatch({
            type: FETCH_FAILED,
            payload: {
              [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
              [APP_ACTION_MESSAGE]: `Error processing response: ${error.message || 'unknown error'}`,
            },
          });
        }
      } else {
        dispatch({
          type: FETCH_FAILED,
          payload: {
            [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
            [APP_ACTION_MESSAGE]: `Network Error: ${response.status} - ${response.statusText}`,
          },
        });

        return {
          [APP_FETCH_RESULT]: {
            data: undefined,
          },
        };
      }
    } catch (e: unknown) {
      console.error('Fetch failed:', (e as Error).message);
      dispatch({
        type: FETCH_FAILED,
        payload: {
          [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
          [APP_ACTION_MESSAGE]: (e as Error).message,
        },
      });
      throw e;
    } finally {
      dispatch({
        type: SET_LOADING,
        payload: {
          [APP_IS_LOADING]: false,
          [APP_ACTION_TYPE]: payload[APP_PART_TYPE],
        },
      });
    }
  }, []);

  const setAppConfig = useCallback(
    (dispatch: Dispatch<AppAction>) => (config: AppConfig) => {
      dispatch({
        type: SET_APP_CONFIG,
        payload: config,
      });
    },
    [],
  );

  const setConfig = setAppConfig(dispatch);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        setConfig,
        appFetch,
        requestDeleteSessionConfirmation,
        clearDeleteSessionInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
