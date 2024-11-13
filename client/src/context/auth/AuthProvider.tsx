import * as React from 'react';
import { useReducer, useCallback } from 'react';
import { authReducer } from './reducer';
import { initialState } from './store';
import {
  LOGOUT,
  SET_COOKIE,
  BASE_URL,
  LOGIN_URL,
  LOGOUT_URL,
  USERINFO_URL,
  LOGIN,
} from './constants';
import { AuthContext } from './authContext';
import { useApp } from '../app/useApp';
import {
  APP_FETCH_OPTIONS,
  APP_FETCH_RESULT,
  APP_FETCH_URL,
  APP_PART_TYPE,
  AUTHENTICATING,
  RETRIEVING_USER,
} from '../app/constants';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { appFetch } = useApp();
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const responseData = await appFetch({
          [APP_FETCH_URL]: `${BASE_URL}${LOGIN_URL}`,
          [APP_FETCH_OPTIONS]: {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          },
          [APP_PART_TYPE]: AUTHENTICATING,
        });
        dispatch({
          type: SET_COOKIE,
          payload: responseData[APP_FETCH_RESULT].data.cookie,
        });
      } catch (e) {
        throw e;
      }
    },
    [appFetch],
  );

  const logout = useCallback(async () => {
    try {
      await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${LOGOUT_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
        },
        [APP_PART_TYPE]: AUTHENTICATING,
      });
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [appFetch]);

  const getUser = useCallback(async () => {
    try {
      const responseData = await appFetch({
        [APP_FETCH_URL]: `${BASE_URL}${USERINFO_URL}`,
        [APP_FETCH_OPTIONS]: {
          method: 'POST',
          body: JSON.stringify({ cookie: state.cookie }),
        },
        [APP_PART_TYPE]: RETRIEVING_USER,
      });
      dispatch({
        type: LOGIN,
        payload: {
          userName: responseData[APP_FETCH_RESULT].data.name as string,
        },
      });
    } catch (error) {
      console.error('Fetching user info failed:', error);
    }
  }, [appFetch, state]);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
