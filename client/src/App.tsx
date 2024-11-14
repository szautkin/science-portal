// Libs
import * as React from 'react';

// Components
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';

// Canfar components
import CanfarLoginModal from './components/canfar/CanfarLoginModal';
import CanfarNavbar from './components/canfar/CanfarNavbar';

/* import SRCLoginModal from "./components/SRCLoginModal";
import SRCNavbar from "./components/SRCNavbar"; */
import SessionItem, {
  EmptySessionItem,
  LoadingSessionItem,
} from './components/SessionItem'; /*
import SciencePortalConfirm from "./components/SciencePortalConfirm"*/
import SciencePortalForm from './components/SciencePortalForm'; /*
import SciencePortalModal from "./components/SciencePortalModal";*/
import SciencePortalPlatformLoad from './components/SciencePortalPlatformLoad';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

// hooks
import {
  ACTIVE_SESSION_SERVICES,
  getAlerts,
  getProgressBarVariant,
  NEW_SESSION_SERVICES,
  STATS_SERVICES,
} from './utilities/appUI';
import StatusModal from './components/common/StatusModal';
import DeleteSessionModal from './components/common/DeleteSessionModal';
import { useAuth } from './context/auth/useAuth';
import { useData } from './context/data/useData';
import { useApp } from './context/app/useApp';
import {
  APP_BANNER,
  APP_CONFIG,
  APP_LOADING,
  APP_SERVICE_STATUSES,
  APP_THEME,
  AVAILABLE_IMAGES,
  RETRIEVING_USER,
  RUNNING_SESSIONS,
  SESSION_STATS,
  SRC,
} from './context/app/constants';
import { DATA_SESSIONS } from './context/data/constants';
import { IS_AUTHENTICATED, USER, USER_NAME } from './context/auth/constants';
import { AppProps } from './main';
import { AppTheme } from './context/app/types';
import SRCNavbar from './components/src/SRCNavbar';
import SRCLoginModal from './components/src/SRCLoginModal';

const App = (props: AppProps) => {
  const { state: authState, getUser } = useAuth();
  const { state: appState, setConfig } = useApp();

  const {
    state: dataState,
    fetchStatsData,
    fetchRunningSessions,
    fetchPlatformContext,
    fetchPlatformImages,
  } = useData();

  React.useEffect(() => {
    if (
      props.initialData &&
      appState?.[APP_CONFIG]?.[APP_THEME] !== props.initialData?.themeName
    ) {
      console.log('config', props);
      setConfig({
        [APP_THEME]: props.initialData?.themeName as AppTheme,
        [APP_BANNER]: props.initialData?.bannerText,
      });
    }
  }, [props.initialData, appState, setConfig]);

  React.useEffect(() => {
    if (
      !authState?.[IS_AUTHENTICATED] &&
      !authState?.[USER]?.[USER_NAME] &&
      !appState?.[APP_LOADING]?.[RETRIEVING_USER]
    ) {
      getUser();
    }
  }, []);

  React.useEffect(() => {
    if (authState?.[IS_AUTHENTICATED]) {
      fetchStatsData();
      fetchRunningSessions();
      fetchPlatformContext();
      fetchPlatformImages();
    }
  }, [authState, authState?.[IS_AUTHENTICATED]]);

  const refreshStats = () => {
    fetchStatsData();
  };
  const refreshSessions = () => {
    fetchRunningSessions();
  };
  console.log('appState', appState);
  console.log('authState', authState);
  console.log('dataState', dataState);
  /*  let isAuthenticated = true
  if (typeof this.state.userInfo.isAuth !== "undefined") {
    isAuthenticated = this.state.userInfo.isAuth
  }

  const name = (typeof this.state.userInfo.name !== "undefined") ? this.state.userInfo.name : "Login"
 
  let navbar
  let authModalImplementation
   if (this.state.themeName === "src") {
    navbar = <SRCNavbar isAuthenticated={isAuthenticated}
                        authenticatedUser={name}
                        bannerText={this.state.bannerText} />

    authModalImplementation = <SRCLoginModal isOpen={true}
                                             submitHandler={this.state.userInfo.loginHandler}
                                             errMsg={this.state.userInfo.errMsg}/>
  } else { 
    navbar = <CanfarNavbar headerURLs={[]}
                           isAuthenticated={state.isAuthenticated}
                           authenticatedUser={state.user.username}
                           bannerText={'banner'} />

    authModalImplementation = <CanfarLoginModal isOpen={true}
                                                modalURLs={null}
                                                submitHandler={null}
                                                errMsg={'error'}/>
  } */

  const newSessionAlerts = getAlerts(appState, NEW_SESSION_SERVICES);
  const activeSessionAlerts = getAlerts(appState, ACTIVE_SESSION_SERVICES);
  const activeStatsAlerts = getAlerts(appState, STATS_SERVICES);

  return (
    <Container fluid className="bg-white">
      {appState?.[APP_CONFIG]?.[APP_THEME] === SRC ? (
        <SRCNavbar />
      ) : (
        <CanfarNavbar />
      )}
      <Container fluid className="sp-body">
        <Row>
          <Col>
            <h3 className="sp-page-header">Science Portal</h3>
          </Col>
        </Row>

        <Container
          fluid
          className="bg-white sp-session-list-container rounded-1"
        >
          <Row>
            <Col>
              <div className="sp-title sp-panel-heading">
                Active Sessions
                <span className="sp-header-button">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip className="sp-b-tooltip">
                        refresh session list
                      </Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="sp-session-reload"
                      onClick={refreshSessions}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </OverlayTrigger>
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar
                variant={getProgressBarVariant(
                  appState?.[APP_SERVICE_STATUSES]?.[RUNNING_SESSIONS]?.status,
                )}
                now={100}
                animated={appState?.[APP_LOADING]?.[RUNNING_SESSIONS]}
                className="sp-progress-bar"
              />
              {activeSessionAlerts.map((alert, index) => (
                <Alert
                  key={`${alert.status} + ${index}`}
                  variant={getProgressBarVariant(alert.status)}
                >
                  {alert.message}{' '}
                </Alert>
              ))}
            </Col>
          </Row>

          <Row xs={1} md={3} className="g-4">
            {dataState?.[DATA_SESSIONS] &&
              Object.keys(dataState?.[DATA_SESSIONS]).length !== 0 && (
                <>
                  {dataState?.[DATA_SESSIONS] &&
                    Object.keys(dataState[DATA_SESSIONS]).map((sessionId) => (
                      <Col key={sessionId} className="sp-card-container">
                        <SessionItem
                          session={dataState[DATA_SESSIONS]?.[sessionId]}
                        />
                      </Col>
                    ))}
                </>
              )}
            {appState?.[APP_LOADING]?.[RUNNING_SESSIONS] && (
              <Col className="sp-card-container">
                <LoadingSessionItem />
              </Col>
            )}
            {!appState?.[APP_LOADING]?.[RUNNING_SESSIONS] &&
              dataState?.[DATA_SESSIONS] &&
              Object.keys(dataState[DATA_SESSIONS]).length === 0 && (
                <Col className="sp-card-container">
                  <EmptySessionItem />
                </Col>
              )}
          </Row>
        </Container>

        <Container fluid className="bg-white sp-container rounded-1">
          <Row>
            {' '}
            <Col sm={7}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <div className="sp-title sp-panel-heading">
                        New Session{' '}
                        <span className="sp-header-button small">
                          <a
                            className="small"
                            href="https://www.opencadc.org/science-containers/"
                          >
                            Help
                          </a>
                        </span>
                      </div>
                      <ProgressBar
                        variant={getProgressBarVariant(
                          appState?.[APP_SERVICE_STATUSES]?.[AVAILABLE_IMAGES]
                            ?.status,
                        )}
                        now={100}
                        animated={appState?.[APP_LOADING]?.[AVAILABLE_IMAGES]}
                        className="sp-progress-bar"
                      />
                      {newSessionAlerts.map((alert, index) => (
                        <Alert
                          key={`${alert.status} + ${index}`}
                          variant={getProgressBarVariant(alert.status)}
                        >
                          {alert.message}{' '}
                        </Alert>
                      ))}
                    </Col>
                  </Row>

                  <SciencePortalForm />
                </Card.Body>
              </Card>
            </Col>
            <Col sm={5}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <div className="sp-title sp-panel-heading">
                        Platform Load
                        <span className="sp-header-button">
                          <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                              <Tooltip className="sp-b-tooltip">
                                refresh statistics
                              </Tooltip>
                            }
                          >
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="sp-e-usage-reload sp-session-usage"
                              onClick={refreshStats}
                            >
                              <FontAwesomeIcon icon={faRefresh} />
                            </Button>
                          </OverlayTrigger>
                        </span>
                      </div>
                      <ProgressBar
                        variant={getProgressBarVariant(
                          appState?.[APP_SERVICE_STATUSES]?.[SESSION_STATS]
                            ?.status,
                        )}
                        now={100}
                        animated={appState?.[APP_LOADING]?.[SESSION_STATS]}
                        className="sp-progress-bar"
                      />

                      {activeStatsAlerts.map((alert, index) => (
                        <Alert
                          key={`${alert.status} + ${index}`}
                          variant={getProgressBarVariant(alert.status)}
                        >
                          {alert.message}{' '}
                        </Alert>
                      ))}
                    </Col>
                  </Row>
                  <SciencePortalPlatformLoad />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        {!authState[IS_AUTHENTICATED] &&
          (appState?.[APP_CONFIG]?.[APP_THEME] === SRC ? (
            <SRCLoginModal />
          ) : (
            <CanfarLoginModal />
          ))}
        {<StatusModal />}
        {<DeleteSessionModal />}
      </Container>
    </Container>
  );
};

export default App;
