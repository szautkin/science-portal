// Constants
import {
  ACTIVE,
  APP_ACTION_MESSAGE,
  APP_ACTION_TYPE,
  APP_BANNER,
  APP_CONFIG,
  APP_DELETE_SESSION_INFO,
  APP_IS_LOADING,
  APP_LOADING,
  APP_SERVICE_STATUSES,
  APP_SESSION_ID,
  APP_SESSION_NAME,
  APP_SHOW_MODAL,
  APP_STATUS,
  APP_THEME,
  CANFAR,
  CLEAR_DELETE_SESSION_INFO,
  FETCH_FAILED,
  OPERATIONAL,
  OUTAGE,
  SET_APP_CONFIG,
  SET_DELETE_SESSION_INFO,
  SET_LOADING,
} from './constants';

// Types
import { AppAction, AppState } from './types';

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case CLEAR_DELETE_SESSION_INFO:
      return {
        ...state,
        [APP_DELETE_SESSION_INFO]: {
          [APP_SHOW_MODAL]: false,
          [APP_SESSION_ID]: '',
          [APP_SESSION_NAME]: '',
        },
      };
    case SET_DELETE_SESSION_INFO:
      return {
        ...state,
        [APP_DELETE_SESSION_INFO]: {
          [APP_SHOW_MODAL]: true,
          [APP_SESSION_ID]: action.payload[APP_SESSION_ID],
          [APP_SESSION_NAME]: action.payload[APP_SESSION_NAME],
        },
      };
    case SET_LOADING:
      return {
        ...state,
        [APP_LOADING]: {
          ...state[APP_LOADING],
          [action.payload[APP_ACTION_TYPE]]: action.payload[APP_IS_LOADING],
        },
        [APP_SERVICE_STATUSES]: {
          ...state[APP_SERVICE_STATUSES],
          [action.payload[APP_ACTION_TYPE]]: {
            [APP_STATUS]: action.payload[APP_IS_LOADING] ? ACTIVE : OPERATIONAL,
            [APP_ACTION_MESSAGE]: action.payload[APP_IS_LOADING]
              ? 'Loading...'
              : '',
          },
        },
      };
    case FETCH_FAILED:
      return {
        ...state,
        [APP_LOADING]: {
          ...state[APP_LOADING],
          [action.payload[APP_ACTION_TYPE]]: false,
        },
        [APP_SERVICE_STATUSES]: {
          ...state[APP_SERVICE_STATUSES],
          [action.payload[APP_ACTION_TYPE]]: {
            [APP_STATUS]: OUTAGE,
            [APP_ACTION_MESSAGE]: action.payload[APP_ACTION_MESSAGE],
          },
        },
      };
    case SET_APP_CONFIG:
      return {
        ...state,
        [APP_CONFIG]: {
          ...state[APP_CONFIG],
          [APP_THEME]: action.payload[APP_THEME],
          [APP_BANNER]: action.payload[APP_BANNER],
        },
      };
    default:
      return state;
  }
};
