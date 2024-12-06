// APP constants
import { FormValues } from './types';

export const BASE_HOST_URL = 'https://www.canfar.net';
export const SCIENCE_PORTAL_URL = `${BASE_HOST_URL}/science-portal`;

// API
export const BASE_URL = '/science-portal';
export const IMAGE_URL = '/image';
export const SESSION_URL = '/session';
export const RENEW_SESSION_URL = '/renew_session';
export const FETCH_SESSION_URL = '/fetch_session';
export const DELETE_SESSION_URL = '/delete_session';
export const CREATE_SESSION_URL = '/create_session';
export const SESSION_VIEW_URL = '/session_view';
export const CONTEXT_URL = '/context';
export const REPOSITORY_URL = '/repository';

// Actions
const prefix = '@DATA';
export const SET_IMAGES = `${prefix}/SET_IMAGES`;
export const SET_SESSIONS = `${prefix}/SET_SESSIONS`;
export const SET_SESSION = `${prefix}/SET_SESSION`;
export const SET_SESSIONS_STATS = `${prefix}/SET_SESSIONS_STATS`;
export const SET_CONTEXT = `${prefix}/SET_CONTEXT`;
export const SET_REPO = `${prefix}/SET_REPO`;
export const CLEAR_DATA = `${prefix}/CLEAR_DATA`;

// State
export const DATA_IMAGES = 'images';
export const DATA_SESSIONS = 'sessions';
export const DATA_CONTEXT = 'context';
export const DATA_PRIVATE_INFO = 'privateInfo';
export const DATA_USAGE = 'usage';

export const SESSION_STATS = 'session_stats';
export const AVAILABLE_IMAGES = 'available_images';
export const PLATFORM_CONTEXT = 'platform_context';
export const RUNNING_SESSIONS = 'running_sessions';
export const FETCHING_SESSION = 'fetching_session';
export const RENEW_SESSION = 'renew_session';
export const DELETE_SESSION = 'delete_session';
export const CREATE_SESSION = 'create_session';

// Images
export const PROP_IMAGE_ID = 'id';
export const PROP_DIGEST = 'digest';
export const PROP_TYPES = 'types';
// Sorted Images
export const PROP_VERSION = 'version';
export const PROP_IMAGE_NAME = 'imageName';

// Image types
export const HEADLESS = 'headless';
export const DESKTOP_APP = 'desktop-app';
export const CARTA = 'carta';
export const NOTEBOOK = 'notebook';
export const DESKTOP = 'desktop';
export const CONTRIBUTED = 'contributed';

// Session
export const PROP_ID = 'id';
export const PROP_USERID = 'userid';
export const PROP_RUN_AS_UID = 'runAsUID';
export const PROP_RUN_AS_GID = 'runAsGID';
export const PROP_SUPPLEMENTAL_GROUPS = 'supplementalGroups';
export const PROP_APPID = 'appid';
export const PROP_IMAGE = 'image';
export const PROP_TYPE = 'type';
export const PROP_STATUS = 'status';
export const PROP_NAME = 'name';
export const PROP_START_TIME = 'startTime';
export const PROP_EXPIRY_TIME = 'expiryTime';
export const PROP_CONNECT_URL = 'connectURL';
export const PROP_REQUESTED_RAM = 'requestedRAM';
export const PROP_REQUESTED_CPU_CORES = 'requestedCPUCores';
export const PROP_REQUESTED_GPU_CORES = 'requestedGPUCores';
export const PROP_RAM_IN_USE = 'ramInUse';
export const PROP_GPU_RAM_IN_USE = 'gpuRAMInUse';
export const PROP_CPU_CORES_IN_USE = 'cpuCoresInUse';
export const PROP_GPU_UTILIZATION = 'gpuUtilization';

// Context PROPS
export const PROP_DEFAULT_REQUEST_CORES = 'defaultRequest';
export const PROP_DEFAULT_LIMIT_CORES = 'defaultLimit';
export const PROP_DEFAULT_CORES = 'default';
export const PROP_DEFAULT_CORES_HEADLESS = 'defaultHeadless';
export const PROP_AVAILABLE_CORES = 'availableCores';
export const PROP_DEFAULT_REQUEST_RAM = 'defaultRequest';
export const PROP_DEFAULT_LIMIT_RAM = 'defaultLimit';
export const PROP_DEFAULT_RAM = 'default';
export const PROP_DEFAULT_RAM_HEADLESS = 'defaultHeadless';
export const PROP_MEMORY = 'memoryGB';
export const PROP_CORES = 'cores';
export const PROP_AVVAILABLE_RAM = 'availableRAM';
export const PROP_AVAILABLE_GPUS = 'availableGPUs';

// PRIVATE_INFO_PROPS
export const PROP_REPOSITORIES = 'repositories';

// UI constants
export const PROP_LOGO = 'logo';
export const SP_IMAGE_URL = '/science-portal/images/';
export const DEFAULT_LOGO = 'fas_cube.png';
export const OPTIONS = 'options';

// Form
// Constants
export const VAL_PROJECT = 'project';
export const VAL_TYPE = 'type';
export const VAL_IMAGE = 'image';
export const VAL_INSTANCE_NAME = 'instanceName';
export const VAL_MEMORY = 'memory';
export const VAL_CORES = 'cores';
export const VAL_GPU = 'gpu';

export const NEW_SESSION_INITIAL_VALUES: FormValues = {
  [VAL_PROJECT]: 'skaha',
  [VAL_TYPE]: NOTEBOOK,
  [VAL_IMAGE]: '',
  [VAL_INSTANCE_NAME]: '',
  [VAL_MEMORY]: 2,
  [VAL_CORES]: 2,
  [VAL_GPU]: 0,
};

// New Session props
export const PROP_SESSION_TYPE = 'sessionType';
export const PROP_SESSION_NAME = 'sessionName';
export const PROP_SESSION_IMAGE = 'sessionImage';
export const PROP_SESSION_RAM = 'sessionRam';
export const PROP_SESSION_CORES = 'sessionCores';

// Stats props
// Instance properties
export const PROP_STATS_INSTANCES = 'instances';
export const PROP_STATS_SESSION = 'session';
export const PROP_STATS_DESKTOP_APP = 'desktopApp';
export const PROP_STATS_HEADLESS = 'headless';
export const PROP_STATS_TOTAL = 'total';

// Core properties
export const PROP_STATS_REQUESTED_CPU_CORES = 'requestedCPUCores';
export const PROP_STATS_CPU_CORES_AVAILABLE = 'cpuCoresAvailable';
export const PROP_STATS_MAX_CPU_CORES = 'maxCPUCores';
export const PROP_STATS_CPU_CORES = 'cpuCores';
export const PROP_STATS_CORES = 'cores';
export const PROP_STATS_WITH_RAM = 'withRam';

// RAM properties
export const PROP_STATS_REQUESTED_RAM = 'requestedRAM';
export const PROP_STATS_RAM_AVAILABLE = 'ramAvailable';
export const PROP_STATS_MAX_RAM = 'maxRAM';
export const PROP_STATS_RAM = 'ram';
export const PROP_STATS_WITH_CPU_CORES = 'withCPUCores';
