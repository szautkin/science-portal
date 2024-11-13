import {
  CLEAR_DATA,
  DATA_CONTEXT,
  DATA_IMAGES,
  DATA_SESSIONS,
  DATA_USAGE,
  SET_CONTEXT,
  SET_IMAGES,
  SET_SESSION,
  SET_SESSIONS,
  SET_SESSIONS_STATS,
} from './constants';
import { DataAction, DataState } from './types';
import { initialState } from './store';

export const dataReducer = (
  state: DataState,
  action: DataAction,
): DataState => {
  switch (action.type) {
    case SET_IMAGES:
      return {
        ...state,
        [DATA_IMAGES]: action.payload[DATA_IMAGES],
      };
    case SET_SESSIONS:
      return {
        ...state,
        [DATA_SESSIONS]: action.payload[DATA_SESSIONS],
      };
    case SET_SESSION:
      return {
        ...state,
        [DATA_SESSIONS]: {
          ...state[DATA_SESSIONS],
          [action.payload.session.id]: action.payload.session,
        },
      };
    case SET_CONTEXT:
      return {
        ...state,
        [DATA_CONTEXT]: action.payload,
      };
    case SET_SESSIONS_STATS:
      return {
        ...state,
        [DATA_USAGE]: action.payload,
      };
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};
