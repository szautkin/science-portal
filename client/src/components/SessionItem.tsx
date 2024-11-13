import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

import '../styles/sessions.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';
import { Session } from '../context/data/types';
import { SCIENCE_PORTAL_URL, SESSION_URL } from '../context/data/constants';
import { useApp } from '../context/app/useApp';
import { useData } from '../context/data/useData';
import { APP_LOADING, FETCHING_SESSION } from '../context/app/constants';

interface Props {
  session: Session;
}
// Set up badging colours
let bgClass = '';
let showSpinner = false;

let uberCSS = '';
let cardCSS = 'sp-e-session-card';
let connectCSS = 'sp-e-session-connect';
let alwaysAvailableCSS = 'sp-card-text sp-session-button';
let hiddenPendingCSS = 'sp-card-text sp-session-button';
let displayGPU = true;
type TimeoutHandler = ReturnType<typeof setTimeout>
const SessionItem = (props: Props) => {
  const { fetchSessionStatus, fetchRenewSession } = useData();
  const { state, requestDeleteSessionConfirmation } = useApp();

  const timeoutRef = React.useRef<TimeoutHandler | null>(null);

  React.useEffect(() => {
    const checkAndFetch = () => {
      const isFetching = state[APP_LOADING][FETCHING_SESSION];
      if (!isFetching) {
        fetchSessionStatus(props.session?.id);
      }
      timeoutRef.current = null;
    };

    if (props.session?.status === 'Pending' && !timeoutRef.current) {
      timeoutRef.current = setTimeout(checkAndFetch, 4000);
    }

    if (props.session?.status !== 'Pending' && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [
    props.session?.id,
    props.session?.status,
    state[APP_LOADING][FETCHING_SESSION],
  ]);

  if (props.session.status === 'Running') {
    bgClass = 'success';
    showSpinner = false;
    uberCSS = '';
    cardCSS = 'sp-e-session-card';
    connectCSS = 'sp-e-session-connect';
    alwaysAvailableCSS = 'sp-card-text sp-session-button';
    hiddenPendingCSS = 'sp-card-text sp-session-button';
  } else if (props.session.status === 'Pending') {
    // Set CSS and control for pending state, to block
    // cursor events and show progress cursor when
    // item is hovered over
    bgClass = 'secondary';
    const pendingCSS = ' sp-pending';
    showSpinner = true;
    cardCSS = cardCSS + pendingCSS;
    connectCSS = connectCSS + pendingCSS;
    hiddenPendingCSS = hiddenPendingCSS + pendingCSS;
    uberCSS = 'sp-pending-cursor';
  } else {
    bgClass = 'secondary';
  }

  if (
    props.session.requestedGPUCores === '<none>' ||
    props.session.requestedGPUCores === '0'
  ) {
    displayGPU = false;
  }

  const onOpenSession = () => {
    window.open(props.session.connectURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={uberCSS}>
      <Card.Body className={cardCSS}>
        <div
          className={connectCSS}
          onClick={onOpenSession}
          data-connecturl={props.session.connectURL}
        >
          <Row>
            <Col>
              <Card.Header className="sp-float-left-full">
                <img
                  className="sp-icon-img"
                  src={props.session.logo}
                  alt={props.session.altText}
                ></img>
                <span className="sp-session-name">{props.session.name}</span>
              </Card.Header>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="sp-card-pill sp-card-text">
                {/* For next pass */}
                {/*<Badge pill bg="warning">Expiring Soon</Badge>*/}
                <span className="sp-session-spinner">
                  {showSpinner && (
                    <Spinner animation="border" variant="primary" size="sm" />
                  )}
                </span>

                <Badge pill bg={bgClass}>
                  {props.session.status}
                </Badge>
              </div>
            </Col>
          </Row>
          <Row className="sp-card-group-top">
            <Col>
              <div className="sp-card-text">
                <span className="sp-card-text-data">{props.session.image}</span>
              </div>
              {/*<br/>*/}
            </Col>
          </Row>
          <Row className="sp-card-group-top">
            <Col>
              <div className="sp-card-text">
                <span className="sp-card-text-label">started:</span>
                <span className="sp-card-text-data">
                  {props.session.startTime}
                </span>{' '}
                UTC
              </div>
              {/*<br/>*/}
            </Col>
          </Row>
          <Row className="sp-card-group-middle">
            <Col>
              <div className="sp-card-text">
                <span className="sp-card-text-label">expires:</span>
                <span className="sp-card-text-data">
                  {props.session.expiryTime}
                </span>{' '}
                UTC
              </div>
              <br />
            </Col>
          </Row>
          <Row className="sp-card-group-top">
            <Col>
              <div className="sp-card-text">
                <span className="sp-card-text-label">memory:</span>
                <span className="sp-card-text-data">
                  {props.session.ramInUse} / {props.session.requestedRAM}
                </span>
              </div>
            </Col>
          </Row>
          <Row className="sp-card-group-middle">
            <Col>
              <div className="sp-card-text">
                <span className="sp-card-text-label">CPU cores:</span>
                <span className="sp-card-text-data">
                  {props.session.coresInUse} / {props.session.requestedCPUCores}
                </span>
              </div>
            </Col>
          </Row>
          {displayGPU && (
            <>
              <Row className="sp-card-group-top">
                <Col>
                  <div className="sp-card-text">
                    <span className="sp-card-text-label">GPU memory: </span>
                    <span className="sp-card-text-data">
                      {props.session.gpuRAMInUse}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="sp-card-group-middle">
                <Col>
                  <div className="sp-card-text">
                    <span className="sp-card-text-label">GPU cores:</span>
                    <span className="sp-card-text-data">
                      {props.session.requestedGPUCores}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="sp-card-group-middle">
                <Col>
                  <div className="sp-card-text">
                    <span className="sp-card-text-label">
                      GPU utilization:{' '}
                    </span>
                    <span className="sp-card-text-data">
                      {props.session.gpuUtilization}
                    </span>
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/*  End of the connectCSS area, used for event handling */}
        </div>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col>
            <div className="sp-card-button">
              <span className="sp-card-button-span">
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip className="sp-b-tooltip">delete session</Tooltip>
                  }
                >
                  <FontAwesomeIcon
                    onClick={() =>
                      requestDeleteSessionConfirmation({
                        sessionId: props.session.id,
                        sessionName: props.session.name,
                      })
                    }
                    data-id={props.session.id}
                    data-name={props.session.name}
                    className={alwaysAvailableCSS}
                    icon={faTrashAlt}
                  />
                </OverlayTrigger>
              </span>

              <span className="sp-card-button-span">
                <a
                  href={`${SCIENCE_PORTAL_URL}${SESSION_URL}/${props.session.id}?view=events`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                      <Tooltip className="sp-b-tooltip">
                        view launch info
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon
                      className={alwaysAvailableCSS}
                      icon={faFlag}
                    />
                  </OverlayTrigger>
                </a>
              </span>

              <span className="sp-card-button-span">
                <a
                  href={`${SCIENCE_PORTAL_URL}${SESSION_URL}/${props.session.id}?view=logs`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                      <Tooltip className="sp-b-tooltip">
                        view session logs
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon
                      className={alwaysAvailableCSS}
                      icon={faFileLines}
                    />
                  </OverlayTrigger>
                </a>
              </span>
              <span className="sp-card-button-span">
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip className="sp-b-tooltip">renew session</Tooltip>
                  }
                >
                  <FontAwesomeIcon
                    onClick={() => fetchRenewSession(props.session.id!)}
                    data-id={props.session.id}
                    className={hiddenPendingCSS}
                    icon={faClock}
                  />
                </OverlayTrigger>
              </span>
            </div>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export const EmptySessionItem = () => (
  <Card className="sp-emptylist-card">
    <Card.Body>
      <Row>
        <Col>
          <Card.Title>
            <em>No interactive sessions found</em>
          </Card.Title>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

export const LoadingSessionItem = () => (
  <Card>
    <Card.Body>
      <Row className="sp-title-placeholder">
        <Col>
          <Placeholder className="sp-form-p" as={Card.Header} animation="glow">
            <Placeholder className="sp-form-placeholder" xs={12} />
          </Placeholder>
        </Col>
      </Row>

      <Placeholder className="sp-form-p" as={Card.Text} animation="glow">
        <Placeholder
          className="sp-form-placeholder sp-card-placeholder"
          xs={12}
        />
        <Placeholder
          className="sp-form-placeholder sp-card-placeholder"
          xs={12}
        />{' '}
        <Placeholder
          className="sp-form-placeholder sp-card-placeholder"
          xs={12}
        />{' '}
        <Placeholder
          className="sp-form-placeholder sp-card-placeholder"
          xs={12}
        />{' '}
      </Placeholder>
    </Card.Body>
    <Card.Footer>
      <Placeholder className="sp-form-p" as={Card.Text} animation="glow">
        <Placeholder
          className="sp-form-placeholder sp-card-placeholder"
          xs={12}
        />
      </Placeholder>
    </Card.Footer>
  </Card>
);

export default SessionItem;
