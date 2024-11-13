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
} from './constants';

// Reducer
import { appReducer } from './reducer';

// Store
import { initialState } from './store';

// Types
import { AppAction, AppFetch } from './types';

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

  const fetchFn = useCallback(
    (dispatch: Dispatch<AppAction>) => async (payload: AppFetch) => {
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
        const data = await response.json();
        return {
          [APP_FETCH_RESULT]: data,
        };
      } catch (e: unknown) {
        console.error('Fetch failed:', e);
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
    },
    [],
  );
  const appFetch = fetchFn(dispatch);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        appFetch,
        requestDeleteSessionConfirmation,
        clearDeleteSessionInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
