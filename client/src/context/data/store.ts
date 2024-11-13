// Constants
import {
  DATA_CONTEXT,
  DATA_IMAGES,
  DATA_SESSIONS,
  DATA_USAGE,
} from './constants';

// Types
import { DataState } from './types';

// Initial state
export const initialState: DataState = {
  [DATA_USAGE]: null,
  [DATA_IMAGES]: {},
  [DATA_SESSIONS]: {},
  [DATA_CONTEXT]: null,
};
