import {
  SET_LOADING,
  SESSION_STATS,
  AVAILABLE_IMAGES,
  RUNNING_SESSIONS,
  OPERATIONAL,
  OUTAGE,
  ACTIVE,
  FETCH_FAILED,
  AUTHENTICATING,
  CLEAR_DELETE_SESSION_INFO,
  SET_DELETE_SESSION_INFO,
  DELETE_SESSION,
  CREATE_SESSION,
  RENEW_SESSION,
  FETCHING_SESSION,
  APP_LOADING,
  APP_SERVICE_STATUSES,
  APP_DELETE_SESSION_INFO,
  APP_SHOW_MODAL,
  APP_SESSION_ID,
  APP_SESSION_NAME,
  APP_ACTION_TYPE,
  APP_IS_LOADING,
  APP_ACTION_MESSAGE,
  APP_STATUS,
  APP_FETCH_URL,
  APP_FETCH_OPTIONS,
  APP_FETCH_RESULT,
  APP_PART_TYPE,
  PLATFORM_CONTEXT,
  RETRIEVING_USER,
} from './constants';

// State interface
export interface AppState {
  [APP_LOADING]: {
    [AUTHENTICATING]: boolean;
    [RETRIEVING_USER]: boolean;
    [DELETE_SESSION]: boolean;
    [CREATE_SESSION]: boolean;
    [SESSION_STATS]: boolean;
    [AVAILABLE_IMAGES]: boolean;
    [FETCHING_SESSION]: boolean;
    [PLATFORM_CONTEXT]: boolean;
    [RUNNING_SESSIONS]: boolean;
    [RENEW_SESSION]: boolean;
  };
  [APP_SERVICE_STATUSES]: ServiceStatus;
  [APP_DELETE_SESSION_INFO]: SessionDeleteInfo;
}

export interface SessionDeleteInfo {
  [APP_SHOW_MODAL]: boolean;
  [APP_SESSION_ID]: string;
  [APP_SESSION_NAME]: string;
}

export type SStatuse = typeof OPERATIONAL | typeof OUTAGE | typeof ACTIVE;

export type Service =
  | typeof SESSION_STATS
  | typeof AVAILABLE_IMAGES
  | typeof CREATE_SESSION
  | typeof RUNNING_SESSIONS
  | typeof FETCHING_SESSION
  | typeof RENEW_SESSION
  | typeof AUTHENTICATING
  | typeof RETRIEVING_USER
  | typeof DELETE_SESSION;

export interface Status {
  [APP_STATUS]: SStatuse;
  [APP_ACTION_MESSAGE]: string;
}

export interface AlertInfo extends Status {
  show: boolean;
}

export interface ServiceStatus {
  [SESSION_STATS]: Status;
  [CREATE_SESSION]: Status;
  [RENEW_SESSION]: Status;
  [FETCHING_SESSION]: Status;
  [DELETE_SESSION]: Status;
  [AVAILABLE_IMAGES]: Status;
  [RUNNING_SESSIONS]: Status;
  [AUTHENTICATING]: Status;
  [RETRIEVING_USER]: Status;
}

export type UiLoading =
  | typeof SESSION_STATS
  | typeof RUNNING_SESSIONS
  | typeof FETCHING_SESSION
  | typeof RENEW_SESSION
  | typeof AVAILABLE_IMAGES
  | typeof PLATFORM_CONTEXT
  | typeof AUTHENTICATING
  | typeof RETRIEVING_USER
  | typeof CREATE_SESSION
  | typeof DELETE_SESSION;

// Action types
export type AppAction =
  | {
      [APP_ACTION_TYPE]: typeof SET_LOADING;
      payload: { [APP_ACTION_TYPE]: UiLoading; [APP_IS_LOADING]: boolean };
    }
  | {
      type: typeof FETCH_FAILED;
      payload: { [APP_ACTION_TYPE]: UiLoading; [APP_ACTION_MESSAGE]: string };
    }
  | {
      type: typeof SET_DELETE_SESSION_INFO;
      payload: Omit<SessionDeleteInfo, 'showModal'>;
    }
  | { [APP_ACTION_TYPE]: typeof CLEAR_DELETE_SESSION_INFO };

export interface AppFetch {
  [APP_FETCH_URL]: string;
  [APP_FETCH_OPTIONS]: RequestInit;
  [APP_PART_TYPE]: UiLoading;
}

export interface FetchResult {
  [APP_FETCH_RESULT]: {
    data: { [key: string]: never };
  };
}
