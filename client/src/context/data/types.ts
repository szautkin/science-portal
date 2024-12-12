import {
  CARTA,
  DESKTOP_APP,
  HEADLESS,
  NOTEBOOK,
  SET_IMAGES,
  SET_SESSIONS,
  PROP_ID,
  PROP_USERID,
  PROP_RUN_AS_UID,
  PROP_RUN_AS_GID,
  PROP_SUPPLEMENTAL_GROUPS,
  PROP_APPID,
  PROP_IMAGE,
  PROP_TYPE,
  PROP_STATUS,
  PROP_NAME,
  PROP_START_TIME,
  PROP_EXPIRY_TIME,
  PROP_CONNECT_URL,
  PROP_REQUESTED_RAM,
  PROP_REQUESTED_CPU_CORES,
  PROP_REQUESTED_GPU_CORES,
  PROP_RAM_IN_USE,
  PROP_GPU_RAM_IN_USE,
  PROP_CPU_CORES_IN_USE,
  PROP_GPU_UTILIZATION,
  DESKTOP,
  CONTRIBUTED,
  SET_CONTEXT,
  PROP_DEFAULT_REQUEST_CORES,
  PROP_DEFAULT_LIMIT_CORES,
  PROP_DEFAULT_CORES,
  PROP_DEFAULT_CORES_HEADLESS,
  PROP_AVAILABLE_CORES,
  PROP_DEFAULT_REQUEST_RAM,
  PROP_DEFAULT_LIMIT_RAM,
  PROP_DEFAULT_RAM,
  PROP_DEFAULT_RAM_HEADLESS,
  PROP_AVAILABLE_RAM,
  PROP_AVAILABLE_GPUS,
  PROP_STATS_SESSION,
  PROP_STATS_DESKTOP_APP,
  PROP_STATS_HEADLESS,
  PROP_STATS_TOTAL,
  PROP_STATS_REQUESTED_CPU_CORES,
  PROP_STATS_CPU_CORES_AVAILABLE,
  PROP_STATS_MAX_CPU_CORES,
  PROP_STATS_CPU_CORES,
  PROP_STATS_WITH_RAM,
  PROP_STATS_REQUESTED_RAM,
  PROP_STATS_RAM_AVAILABLE,
  PROP_STATS_MAX_RAM,
  PROP_STATS_RAM,
  PROP_STATS_WITH_CPU_CORES,
  PROP_STATS_CORES,
  PROP_STATS_INSTANCES,
  SET_SESSIONS_STATS,
  PROP_SESSION_TYPE,
  PROP_SESSION_NAME,
  PROP_SESSION_IMAGE,
  PROP_SESSION_RAM,
  PROP_SESSION_CORES,
  SET_SESSION,
  DATA_IMAGES,
  DATA_SESSIONS,
  DATA_CONTEXT,
  DATA_USAGE,
  PROP_IMAGE_ID,
  PROP_DIGEST,
  PROP_TYPES,
  IMAGE_NAME,
  VAL_CORES,
  VAL_GPU,
  VAL_IMAGE,
  VAL_INSTANCE_NAME,
  VAL_MEMORY,
  VAL_PROJECT,
  VAL_TYPE,
  CLEAR_DATA,
  SET_REPO,
  DATA_PRIVATE_INFO,
  PROP_REPOSITORIES,
  PROP_CORES,
  OPTIONS,
  PROP_MEMORY,
  PROP_VERSION,
  PROP_IMAGE_NAME,
  VAL_REPO_USER_NAME,
  VAL_REPO_SECRET,
  VAL_REPO_HOST,
  PROP_SESSION_PROJECT,
  PROP_REPO_USER_NAME,
  PROP_REPO_SECRET,
} from './constants';
import { DEFAULT_IMAGE_NAMES } from '../../components/utilities/constants';

// State interface
export interface DataState {
  [DATA_IMAGES]: { [key: string]: { [key: string]: Image[] } };
  [DATA_SESSIONS]: { [key: string]: Session };
  [DATA_CONTEXT]: Context | null;
  [DATA_USAGE]: PlatformUsage | null;
  [DATA_PRIVATE_INFO]: Repo | null;
}
export type FormKeys =
  | typeof VAL_TYPE
  | typeof VAL_PROJECT
  | typeof VAL_IMAGE
  | typeof VAL_INSTANCE_NAME
  | typeof VAL_MEMORY
  | typeof VAL_CORES
  | typeof VAL_GPU;

export interface FormValues {
  [VAL_PROJECT]: string;
  [VAL_TYPE]: keyof DEFAULT_IMAGE_NAMES;
  [VAL_IMAGE]: string;
  [VAL_INSTANCE_NAME]: string;
  [VAL_MEMORY]: number;
  [VAL_CORES]: number;
  [VAL_GPU]: number;
}

export interface CustomFormValues {
  [VAL_TYPE]: keyof DEFAULT_IMAGE_NAMES;
  [VAL_IMAGE]: string;
  [VAL_INSTANCE_NAME]: string;
  [VAL_MEMORY]: number;
  [VAL_CORES]: number;
  [VAL_GPU]: number;
  [VAL_REPO_USER_NAME]: string;
  [VAL_REPO_SECRET]: string;
  [VAL_REPO_HOST]: string;
}

export type ImageType =
  | typeof HEADLESS
  | typeof DESKTOP_APP
  | typeof CARTA
  | typeof NOTEBOOK
  | typeof DESKTOP
  | typeof CONTRIBUTED;

export interface Image {
  [PROP_IMAGE_ID]: string;
  [PROP_DIGEST]: string;
  [PROP_TYPES]: ImageType[];
}

export interface SortedImage extends Image {
  [PROP_IMAGE_NAME]: string;
  [PROP_NAME]: string;
  [PROP_VERSION]: string;
}

export interface KeyedImages {
  [key: string]: Image[];
}
export interface KeyedSortedImages {
  [key: string]: SortedImage[];
}

export interface ImageEx extends Image {
  [IMAGE_NAME]: string;
}

export interface KeyedImageType {
  [HEADLESS]?: KeyedImages;
  [DESKTOP_APP]?: KeyedImages;
  [CARTA]?: KeyedImages;
  [NOTEBOOK]?: KeyedImages;
  [DESKTOP]?: KeyedImages;
  [CONTRIBUTED]?: KeyedImages;
}

export interface KeyedImageName {
  [CARTA]?: string;
  [NOTEBOOK]?: string;
  [DESKTOP]?: string;
  [CONTRIBUTED]?: string;
}

export interface Session {
  [PROP_ID]: string;
  [PROP_USERID]: string;
  [PROP_RUN_AS_UID]: string;
  [PROP_RUN_AS_GID]: string;
  [PROP_SUPPLEMENTAL_GROUPS]: number[];
  [PROP_APPID]: string;
  [PROP_IMAGE]: string;
  [PROP_TYPE]: ImageType;
  [PROP_STATUS]: string;
  [PROP_NAME]: string;
  [PROP_START_TIME]: string;
  [PROP_EXPIRY_TIME]: string;
  [PROP_CONNECT_URL]: string;
  [PROP_REQUESTED_RAM]: string;
  [PROP_REQUESTED_CPU_CORES]: string;
  [PROP_REQUESTED_GPU_CORES]: string;
  [PROP_RAM_IN_USE]: string;
  [PROP_GPU_RAM_IN_USE]: string;
  [PROP_CPU_CORES_IN_USE]: string;
  [PROP_GPU_UTILIZATION]: string;
  logo?: string;
  altText?: string;
  coresInUse?: string;
}

export interface Context {
  [PROP_CORES]: {
    [PROP_DEFAULT_CORES]: number;
    [PROP_DEFAULT_LIMIT_CORES]: number;
    [PROP_DEFAULT_REQUEST_CORES]: number;
    [PROP_DEFAULT_CORES_HEADLESS]: number;
    [OPTIONS]: number[];
  };
  [PROP_MEMORY]: {
    [PROP_DEFAULT_RAM]: number;
    [PROP_DEFAULT_RAM_HEADLESS]: number;
    [OPTIONS]: number[];
    [PROP_DEFAULT_REQUEST_RAM]: number;
    [PROP_DEFAULT_LIMIT_RAM]: number;
  };
}

export interface Repo {
  [PROP_REPOSITORIES]: string[];
}

export interface StandardSession {
  [PROP_SESSION_TYPE]: ImageType;
  [PROP_SESSION_NAME]: string;
  [PROP_SESSION_IMAGE]: string;
  [PROP_SESSION_RAM]?: number;
  [PROP_SESSION_CORES]?: number;
}

export interface NewSession extends StandardSession {
  [PROP_SESSION_PROJECT]: string;
}

export interface NewCustomSession extends StandardSession {
  [PROP_REPO_USER_NAME]?: string;
  [PROP_REPO_SECRET]?: string;
}

export interface StatsData {
  [PROP_STATS_INSTANCES]: {
    [PROP_STATS_SESSION]: number;
    [PROP_STATS_DESKTOP_APP]: number;
    [PROP_STATS_HEADLESS]: number;
    [PROP_STATS_TOTAL]: number;
  };
  [PROP_STATS_CORES]: {
    [PROP_STATS_REQUESTED_CPU_CORES]: number;
    [PROP_STATS_CPU_CORES_AVAILABLE]: number;
    [PROP_STATS_MAX_CPU_CORES]: {
      [PROP_STATS_CPU_CORES]: number;
      [PROP_STATS_WITH_RAM]: string;
    };
  };
  [PROP_STATS_RAM]: {
    [PROP_STATS_REQUESTED_RAM]: string;
    [PROP_STATS_RAM_AVAILABLE]: string;
    [PROP_STATS_MAX_RAM]: {
      [PROP_STATS_RAM]: string;
      [PROP_STATS_WITH_CPU_CORES]: number;
    };
  };
}

export interface PlatformUsage {
  updated: string;
  cpu: {
    used: number;
    free: number;
    total: number;
    display: {
      free: string;
      total: string;
    };
  };
  ram: {
    unit: string;
    used: number;
    free: number;
    total: number;
    display: {
      free: string;
      total: string;
    };
  };
  instances: {
    labels: string[];
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    total: number;
    biggestCount: number;
  };
  listType: string;
}

// Action types
export type DataAction =
  | { type: typeof SET_CONTEXT; payload: Context }
  | { type: typeof SET_REPO; payload: Repo }
  | { type: typeof SET_SESSIONS_STATS; payload: PlatformUsage }
  | {
      type: typeof SET_SESSIONS;
      payload: { [DATA_SESSIONS]: { [key: string]: Session } };
    }
  | { type: typeof SET_SESSION; payload: { session: Session } }
  | { type: typeof CLEAR_DATA }
  | {
      type: typeof SET_IMAGES;
      payload: { [DATA_IMAGES]: { [key: string]: { [key: string]: Image[] } } };
    };
