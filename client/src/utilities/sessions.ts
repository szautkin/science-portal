import { session_types as SESSION_TYPES } from '../session/sessiontype_map_en.json';
import { Session } from '../context/data/types';
import {
  BASE_HOST_URL,
  NOTEBOOK,
  PROP_EXPIRY_TIME,
  PROP_IMAGE,
  PROP_LOGO,
  PROP_START_TIME,
  SP_IMAGE_URL,
} from '../context/data/constants';

export const getSessionTypeData = (session: Session) => {
  const availableSessions = Object.keys(SESSION_TYPES);
  const sessionType = availableSessions.includes(session.type)
    ? (session.type as keyof typeof SESSION_TYPES)
    : NOTEBOOK;

  return SESSION_TYPES[sessionType];
};

export const getStrippedTime = (time: string) => {
  return time
    .slice(0, time.length - 1)
    .split('T')
    .join(' ');
};

export const getSessionImageName = (session: Session) => {
  return session?.[PROP_IMAGE]?.split('/').reduce(
    (acc, str: string, ind: number) => {
      if (ind !== 0) {
        acc = acc + str + (ind !== 2 ? '/' : '');
      }
      return acc;
    },
    '',
  );
};

export const transformSession = (session: Session) => {
  const sessionLogo = getSessionTypeData(session)?.portal_icon;
  const stripedStartTime = getStrippedTime(session[PROP_START_TIME]);
  const stripedExpiryTime = getStrippedTime(session[PROP_EXPIRY_TIME]);
  return {
    ...session,
    [PROP_START_TIME]: stripedStartTime,
    [PROP_EXPIRY_TIME]: stripedExpiryTime,
    [PROP_IMAGE]: getSessionImageName(session),
    [PROP_LOGO]: `${BASE_HOST_URL}${SP_IMAGE_URL}${sessionLogo}`,
  };
};
export const getTransformedSessions = (sessions: Session[]) => {
  return sessions.reduce(
    (acc: { [key: string]: Session }, session: Session) => {
      if (session.status === 'Terminating') {
        return acc;
      }
      acc[session.id] = transformSession(session);
      return acc;
    },
    {} as { [key: string]: Session },
  );
};
