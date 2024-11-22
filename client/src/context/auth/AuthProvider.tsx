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
        if (responseData) {
          dispatch({
            type: SET_COOKIE,
            payload: responseData?.[APP_FETCH_RESULT]?.cookie,
          });
        }
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
        [APP_PART_TYPE]: RETRIEVING_USER,
      });
      if (responseData?.[APP_FETCH_RESULT]?.name) {
        dispatch({
          type: LOGIN,
          payload: {
            userName: responseData?.[APP_FETCH_RESULT]?.name as string,
          },
        });
      }
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
