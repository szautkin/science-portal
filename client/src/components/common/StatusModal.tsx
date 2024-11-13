// Libs
import React from 'react';

// Components
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

// Hooks
import { useAuth } from '../../context/auth/useAuth';
import {
  APP_LOADING,
  AUTHENTICATING,
  AVAILABLE_IMAGES,
  CREATE_SESSION,
  DELETE_SESSION,
  RENEW_SESSION,
  RETRIEVING_USER,
  RUNNING_SESSIONS,
  SESSION_STATS,
} from '../../context/app/constants';
import { UiLoading } from '../../context/app/types';
import { useApp } from '../../context/app/useApp';
import { IS_AUTHENTICATED } from '../../context/auth/constants';

const PLATFORM_LOADING_STEPS: {
  label: string;
  message: string;
  value: UiLoading;
}[] = [
  {
    label: 'Initializing',
    value: AUTHENTICATING,
    message: 'Checking user credentials...',
  },
  {
    label: 'User profile',
    value: RETRIEVING_USER,
    message: 'Retrieving user information...',
  },
  {
    label: 'Fetching sessions',
    value: RUNNING_SESSIONS,
    message: 'Checking user sessions...',
  },
  {
    label: 'Loading images',
    value: AVAILABLE_IMAGES,
    message: 'Checking available images...',
  },
  {
    label: 'Checking platform',
    value: SESSION_STATS,
    message: 'Retrieving platform usage data...',
  },
  {
    label: 'Request session',
    value: CREATE_SESSION,
    message: 'Requesting session...',
  },
  {
    label: 'Renew session',
    value: RENEW_SESSION,
    message: 'Extending session time...',
  },
  {
    label: 'Delete session',
    value: DELETE_SESSION,
    message: 'Deleting session...',
  },
];

const StatusModal = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const [status, setStatus] = React.useState<null | {
    header: string;
    message: string;
  }>(null);

  React.useEffect(() => {
    let hasFinished = true;
    for (let plStep of PLATFORM_LOADING_STEPS) {
      if (state?.[APP_LOADING]?.[plStep.value]) {
        setStatus({
          header: plStep.label,
          message: plStep.message,
        });
        hasFinished = false;
        break;
      }
    }
    if (
      hasFinished ||
      (!authState?.[IS_AUTHENTICATED] &&
        !state?.[APP_LOADING]?.[AUTHENTICATING])
    ) {
      setStatus(null);
    }
  }, [authState, authState?.[IS_AUTHENTICATED], state, state?.[APP_LOADING]]);

  if (!status) {
    return null;
  }
  return (
    <Modal
      show={!!status}
      onHide={() => setStatus(null)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="sp-modal-header">{status.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="st-modal-container">
        <Spinner animation="border" variant="primary" size="sm" />
        {status.message}
      </Modal.Body>
      <Modal.Footer> </Modal.Footer>
    </Modal>
  );
};
export default StatusModal;
