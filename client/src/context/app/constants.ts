// APP constants

// State
export const APP_LOADING = 'loading';
export const APP_SERVICE_STATUSES = 'servicesStatuses';
export const APP_DELETE_SESSION_INFO = 'deleteSessionInfo';
export const APP_SHOW_MODAL = 'showModal';
export const APP_SESSION_ID = 'sessionId';
export const APP_SESSION_NAME = 'sessionName';
export const APP_ACTION_TYPE = 'type';
export const APP_ACTION_MESSAGE = 'message';
export const APP_STATUS = 'status';
export const APP_IS_LOADING = 'isLoading';
export const APP_FETCH_URL = 'fetchUrl';
export const APP_FETCH_OPTIONS = 'fetchOptions';
export const APP_FETCH_RESULT = 'fetchResult';
export const APP_PART_TYPE = 'appPartType';

// Actions
const prefix = '@APP';
export const SET_DELETE_SESSION_INFO = `${prefix}/SET_DELETE_SESSION_INFO`;
export const CLEAR_DELETE_SESSION_INFO = `${prefix}/CLEAR_DELETE_SESSION_INFO`;
export const SET_LOADING = `${prefix}/SET_LOADING`;
export const FETCH_FAILED = `${prefix}/FETCH_FAILED`;

export const BASE_HOST_URL = 'https://www.canfar.net';
export const CADC_BASE_HOST_URL =
  'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/';
export const CADC_GROUPS_URL = '/groups';
export const CADC_SEARCH_URL = '/search';
export const CADC_RESET_URL = '/auth/resetPassword.html';
export const CADC_UPDATE_URL = '/auth/update.html';

export const SCIENCE_PORTAL_URL = `${BASE_HOST_URL}/science-portal`;

// API
export const BASE_URL = '/api';
export const LOGIN_URL = '/access/login';
export const LOGOUT_URL = '/access/logout';
export const IMAGE_URL = '/image';
export const SESSION_URL = '/session';
export const FETCH_SESSION_URL = '/fetch_session';
export const RENEW_SESSION_URL = '/renew_session';
export const DELETE_SESSION_URL = '/delete_session';
export const CREATE_SESSION_URL = '/create_session';
export const SESSION_VIEW_URL = '/session_view';
export const USERINFO_URL = '/userinfo';
export const CONTEXT_URL = '/context';
export const PASSWORD_RESET_URL =
  'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/resetPassword.html';
export const ACCOUNT_REQUEST_URL =
  'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/request.html';

// State
export const AUTHENTICATING = 'authenticating';
export const RETRIEVING_USER = 'retrieving_user';
export const SESSION_STATS = 'session_stats';
export const AVAILABLE_IMAGES = 'available_images';
export const PLATFORM_CONTEXT = 'platform_context';
export const RUNNING_SESSIONS = 'running_sessions';
export const FETCHING_SESSION = 'fetching_session';
export const RENEW_SESSION = 'renew_session';
export const DELETE_SESSION = 'delete_session';
export const CREATE_SESSION = 'create_session';
export const OPERATIONAL = 'operational';
export const OUTAGE = 'outage';
export const ACTIVE = 'active';
