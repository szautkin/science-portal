// Constants
import {
  ACTIVE,
  APP_SERVICE_STATUSES,
  AVAILABLE_IMAGES,
  CREATE_SESSION,
  DELETE_SESSION,
  OUTAGE,
  RENEW_SESSION,
  RUNNING_SESSIONS,
  SESSION_STATS,
} from '../context/app/constants';

// Types
import { AppState, AlertInfo, Service, SStatuse } from '../context/app/types';

export const getProgressBarVariant = (status: SStatuse): string => {
  switch (status) {
    case ACTIVE:
      return 'primary';
    case OUTAGE:
      return 'danger';
    default:
      return 'success';
  }
};
export const NEW_SESSION_SERVICES: Service[] = [
  AVAILABLE_IMAGES,
  CREATE_SESSION,
];
export const ACTIVE_SESSION_SERVICES: Service[] = [
  RUNNING_SESSIONS,
  RENEW_SESSION,
  DELETE_SESSION,
];
export const STATS_SERVICES: Service[] = [SESSION_STATS];
export const getAlerts = (state: AppState, services: Service[]) => {
  const newSessionEvents = services.map((ev) => {
    return {
      type: ev,
      ...state?.[APP_SERVICE_STATUSES]?.[ev],
    };
  });

  return newSessionEvents.reduce((acc, ev) => {
    if (ev.status === OUTAGE) {
      // create an alert
      acc.push({
        show: true,
        status: OUTAGE,
        message: ev.message,
      });
    }
    return acc;
  }, [] as AlertInfo[]);
};
