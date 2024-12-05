import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Placeholder from 'react-bootstrap/Placeholder';
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {
  DEFAULT_CORES_NUMBER,
  DEFAULT_RAM_NUMBER,
} from '../utilities/constants';
import { useData } from '../../context/data/useData';
import {
  DATA_PRIVATE_INFO,
  PROP_REPOSITORIES,
} from '../../context/data/constants';
import { useAuth } from '../../context/auth/useAuth';
import {
  IS_AUTHENTICATED,
  USER,
  USER_NAME,
} from '../../context/auth/constants';

interface FormData {
  sessionName: string;
  selectedType: string;
  types?: string[];
  repositoryHosts?: string[];
  contextData?: {
    defaultRAM: number;
    defaultCores: number;
    availableRAM?: number[];
    availableCores: number[];
  };
  formFields?: {
    showRAM?: boolean;
    showCores?: boolean;
  };
  repositorySecret?: string;
  submitHandler: (event: React.FormEvent) => void;
  changeTypeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  resetHandler: () => void;
}

const NewSessionCustomImageForm = () => {
  const { state } = useData();
  const { state: authState } = useAuth();
  console.log('state data', state);
  const initialRAM = state?.context
    ? Math.max(state?.context.defaultRAM, DEFAULT_RAM_NUMBER)
    : DEFAULT_RAM_NUMBER;

  const initialCores = state?.context
    ? Math.max(state?.context.defaultCores, DEFAULT_CORES_NUMBER)
    : DEFAULT_CORES_NUMBER;

  const initialUsername = authState?.[IS_AUTHENTICATED]
    ? authState?.[USER]?.[USER_NAME]
    : '';

  let fData;

  const repositoryHosts = state?.[DATA_PRIVATE_INFO]?.[PROP_REPOSITORIES];

  const [formState, setFormState] = useState({
    fData,
    selectedRAM: initialRAM,
    selectedCores: initialCores,
    repositoryUsername: initialUsername,
    repositoryHost:
      repositoryHosts && repositoryHosts.length > 0 ? repositoryHosts[0] : '',
    image: '',
    repositorySecret: '',
  });

  useEffect(() => {
    setFormState((prev) => ({ ...prev, fData }));
  }, [fData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpData = { ...formState.fData };
    tmpData.sessionName = event.target.value;
    setFormState((prev) => ({ ...prev, fData: tmpData }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, image: event.target.value }));
  };

  const handleRepositoryUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormState((prev) => ({
      ...prev,
      repositoryUsername: event.target.value,
    }));
  };

  const handleRepositorySecretChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormState((prev) => ({ ...prev, repositorySecret: event.target.value }));
  };

  const handleRAMChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      selectedRAM: Number(event.target.value),
    }));
  };

  const handleCoresChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      selectedCores: Number(event.target.value),
    }));
  };

  const resetForm = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFormState((prev) => ({
      ...prev,
      selectedCores: Math.max(
        fData?.contextData?.defaultCores ?? DEFAULT_CORES_NUMBER,
        DEFAULT_CORES_NUMBER,
      ),
      selectedRAM: Math.max(
        fData?.contextData?.defaultRAM ?? DEFAULT_RAM_NUMBER,
        DEFAULT_RAM_NUMBER,
      ),
      repositoryUsername:
        authenticatedUsername && authenticatedUsername !== 'Login'
          ? authenticatedUsername
          : '',
    }));
    formState.fData?.resetHandler();
  };

  const renderPopover = (headerText: string, bodyText: string) => (
    <OverlayTrigger
      trigger="click"
      key="top"
      placement="top"
      rootClose={true}
      overlay={
        <Popover id={`popover-positioned-top`}>
          <Popover.Header as="h3">{headerText}</Popover.Header>
          <Popover.Body className="sp-form">{bodyText}</Popover.Body>
        </Popover>
      }
    >
      <FontAwesomeIcon
        className="sp-form-cursor popover-blue"
        icon={faQuestionCircle}
      />
    </OverlayTrigger>
  );

  const renderPlaceholder = () => (
    <Col md={6}>
      <Placeholder className="sp-form-p" as="p" animation="glow">
        <Placeholder
          className="sp-form-placeholder"
          bg="secondary"
          md={12}
          sz="sm"
        />
      </Placeholder>
    </Col>
  );

  const showRAM = formState.fData?.formFields?.showRAM ?? false;
  const showCores = formState.fData?.formFields?.showCores ?? false;

  const repositoryHostComponent =
    formState.fData?.repositoryHosts?.length > 1 ? (
      <Form.Select
        name="repositoryHost"
        size="sm"
        className="sp-form-cursor sp-form-input"
      >
        {formState.fData?.repositoryHosts?.map((mapObj) => (
          <option className="sp-form" key={mapObj} name={mapObj} value={mapObj}>
            {mapObj}
          </option>
        ))}
      </Form.Select>
    ) : (
      <Form.Control
        type="text"
        disabled={true}
        defaultValue={formState.repositoryHost}
        name="repositoryHost"
        className="sp-form-input"
      />
    );

  if (formState.fData && Object.keys(formState.fData).length === 0) {
    return (
      <Form className="sp-form">
        {/* Placeholder form content */}
        <Row className="sp-form-row">
          <Col className="sp-placeholder" sm={3}>
            <Form.Label className="sp-form-label" column="sm">
              type
              {renderPopover(
                'Session Type',
                'Select from the list of supported session types',
              )}
            </Form.Label>
          </Col>
          {renderPlaceholder()}
        </Row>
        {/* ... Other placeholder rows ... */}
      </Form>
    );
  }

  return (
    <Form onSubmit={formState.fData?.submitHandler} className="sp-form">
      <fieldset className="mt-3">
        <div className="ps-4 pe-4 pt-4 w-75">
          <legend className="fs-6">Image access</legend>
          <hr />
        </div>

        <Row className="sp-form-row">
          <Col sm={4}>
            <Form.Label className="sp-form-label" column="sm">
              container image
              {renderPopover(
                'Container Image',
                'The full Docker image URI for the session.',
              )}
            </Form.Label>
          </Col>
          <Col sm={3} className="pe-1">
            {repositoryHostComponent}
          </Col>
          <Col sm={4} className="ps-1">
            <Form.Control
              type="text"
              placeholder="project/example-image:1.0.0"
              value={formState.image}
              onChange={handleImageChange}
              name="image"
              className="sp-form-input"
            />
          </Col>
        </Row>

        <Row className="sp-form-row">
          <Col sm={4}>
            <Form.Label className="sp-form-label" column="sm">
              repository username
              {renderPopover(
                'Image repository username',
                'The username for authenticated access to the Image Repository.',
              )}
            </Form.Label>
          </Col>
          <Col sm={7}>
            <Form.Control
              type="text"
              placeholder="Repository username"
              value={formState.repositoryUsername}
              onChange={handleRepositoryUsernameChange}
              name="repositoryAuthUsername"
              className="sp-form-input"
            />
          </Col>
        </Row>

        <Row className="sp-form-row">
          <Col sm={4}>
            <Form.Label className="sp-form-label" column="sm">
              repository secret
              {renderPopover(
                'Image repository secret',
                'The secret for authenticated access to the Image Repository.',
              )}
            </Form.Label>
          </Col>
          <Col sm={7}>
            <Form.Control
              type="password"
              placeholder="Repository secret"
              value={formState.fData?.repositorySecret}
              onChange={handleRepositorySecretChange}
              name="repositoryAuthSecret"
              className="sp-form-input"
            />
          </Col>
        </Row>
      </fieldset>

      <fieldset>
        <div className="ps-4 pe-4 pt-4 w-75">
          <legend className="fs-6">Launch session</legend>
          <hr />
        </div>

        <Row className="sp-form-row">
          <Col sm={4}>
            <Form.Label className="sp-form-label" column="sm">
              type
              {renderPopover(
                'Session Type',
                'Pick from the list of supported session types',
              )}
            </Form.Label>
          </Col>
          <Col sm={7}>
            <Form.Select
              value={formState.fData?.selectedType}
              onChange={formState.fData?.changeTypeHandler}
              name="type"
              size="sm"
              className="sp-form-cursor"
            >
              {formState.fData?.types?.map((mapObj) => (
                <option
                  className="sp-form"
                  key={mapObj}
                  name={mapObj}
                  value={mapObj}
                >
                  {mapObj}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="sp-form-row">
          <Col sm={4}>
            <Form.Label className="sp-form-label" column="sm">
              session name
              {renderPopover(
                'Session Name',
                "Name for the session. Alphanumeric and '-' characters only.",
              )}
            </Form.Label>
          </Col>
          <Col sm={7}>
            <Form.Control
              type="text"
              maxLength={15}
              placeholder="Enter session name"
              value={formState.fData?.sessionName}
              onChange={handleChange}
              name="name"
              className="sp-form-input"
            />
          </Col>
        </Row>

        {showRAM && (
          <Row className="sp-form-row">
            <Col sm={4}>
              <Form.Label className="sp-form-label" column="sm">
                memory
                {renderPopover('Memory', 'System memory (RAM) in gigabytes.')}
              </Form.Label>
            </Col>
            <Col sm={7}>
              <Form.Select
                value={
                  formState.selectedRAM ||
                  formState.fData?.contextData?.defaultRAM
                }
                name="ram"
                className="sp-form-cursor"
                onChange={handleRAMChange}
              >
                {formState.fData?.contextData?.availableRAM?.map((mapObj) => (
                  <option key={mapObj} value={mapObj}>
                    {mapObj}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        )}

        {showCores && (
          <Row className="sp-form-row">
            <Col sm={4}>
              <Form.Label className="sp-form-label" column="sm">
                # cores
                {renderPopover(
                  '# of Cores',
                  'Number of cores used by the session.',
                )}
              </Form.Label>
            </Col>
            <Col sm={7}>
              <Form.Select
                name="cores"
                className="sp-form-cursor"
                value={
                  formState.selectedCores ||
                  formState.fData?.contextData?.defaultCores
                }
                onChange={handleCoresChange}
              >
                {formState.fData?.contextData?.availableCores.map((mapObj) => (
                  <option key={mapObj} value={mapObj}>
                    {mapObj}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        )}

        <Row className="sp-form-row">
          <Col sm={4}>
            {/* placeholder column so buttons line up with form entry elements */}
          </Col>
          <Col sm={7}>
            <Button
              variant="primary"
              type="submit"
              size="sm"
              className="sp-form-button"
            >
              Launch
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetForm}
              className="sp-reset-button"
            >
              Reset
            </Button>
          </Col>
        </Row>
      </fieldset>
    </Form>
  );
};

export default NewSessionCustomImageForm;
