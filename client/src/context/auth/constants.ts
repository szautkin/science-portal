// API
const isDev = import.meta.env.DEV;

export const BASE_URL = '/science-portal';
export const LOGIN_URL = '/access/login';
export const LOGOUT_URL = '/access/logout';
export const USERINFO_URL = '/userinfo';

// Actions
const prefix = '@AUTH';
export const LOGIN = `${prefix}/LOGIN`;
export const LOGOUT = `${prefix}/LOGOUT`;
export const SET_COOKIE = `${prefix}/SET_COOKIE`;

// State
export const IS_AUTHENTICATED = 'isAuthenticated';
export const USER = 'user';
export const USER_NAME = 'userName';
export const COOKIE = 'cookie';
