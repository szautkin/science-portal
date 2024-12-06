import React from 'react';
import { Form, Field } from 'react-final-form';
import {
  Form as BootstrapForm,
  Button,
  Row,
  Col,
  Placeholder,
} from 'react-bootstrap';

import {
  DATA_CONTEXT,
  DATA_IMAGES,
  DATA_SESSIONS,
  DESKTOP,
  NEW_SESSION_INITIAL_VALUES,
  OPTIONS,
  PROP_AVAILABLE_CORES,
  PROP_AVAILABLE_RAM,
  PROP_CORES,
  PROP_MEMORY,
  PROP_SESSION_CORES,
  PROP_SESSION_IMAGE,
  PROP_SESSION_NAME,
  PROP_SESSION_RAM,
  PROP_SESSION_TYPE,
  VAL_CORES,
  VAL_IMAGE,
  VAL_INSTANCE_NAME,
  VAL_MEMORY,
  VAL_PROJECT,
  VAL_TYPE,
} from '../../context/data/constants';
import {
  getDefaultSessionName,
  getMissedFieldError,
  validateAlphanumericHyphen,
} from '../../utilities/form';
import FormPopover from '../common/Popover';
import FieldPlaceholder from '../common/FieldPlaceholder';
import {
  FormKeys,
  FormValues,
  ImageEx,
  NewSession,
  SortedImage,
} from '../../context/data/types';
import { useData } from '../../context/data/useData';
import labels from './labels.json';
import {
  getImagesNamesSorted,
  getProjectImagesMap,
  getProjectNames,
} from '../utilities/utils';
import { DEFAULT_IMAGE_NAMES, SKAHA_PROJECT } from '../utilities/constants';

const NewSessionForm: React.FC = () => {
  //const { state, dispatch } = useAuth();
  const { state, fetchCreateSession } = useData();
  const hasImages =
    state?.[DATA_IMAGES] && Object.keys(state[DATA_IMAGES]).length > 0;
  const availableTypes =
    state?.[DATA_IMAGES] && Object.keys(state[DATA_IMAGES]);
  const createSessionName =
    state?.[DATA_SESSIONS] &&
    getDefaultSessionName(Object.keys(state[DATA_SESSIONS]).length + 1);

  const onSubmit = async (values: FormValues) => {
    const sessionPayload: NewSession = {
      [PROP_SESSION_TYPE]: values[VAL_TYPE],
      [PROP_SESSION_NAME]: values[VAL_INSTANCE_NAME],
      [PROP_SESSION_IMAGE]: values[VAL_IMAGE],
    };
    if (values[VAL_TYPE] !== DESKTOP) {
      sessionPayload[PROP_SESSION_RAM] = +values[VAL_MEMORY];
      sessionPayload[PROP_SESSION_CORES] = +values[VAL_CORES];
    }

    fetchCreateSession(sessionPayload);
  };

  const REQUIRED_FIELDS: FormKeys[] = [
    VAL_INSTANCE_NAME,
    VAL_TYPE,
    VAL_PROJECT,
    VAL_IMAGE,
  ];

  const validate = (values: FormValues) => {
    const errors: { [K in FormKeys]?: string } = {};
    REQUIRED_FIELDS.forEach((fieldProp: FormKeys) => {
      if (!values[fieldProp]) {
        errors[fieldProp] = getMissedFieldError(fieldProp);
      }
    });

    if (values[VAL_TYPE] !== DESKTOP) {
      if (!values[VAL_MEMORY]) {
        errors[VAL_MEMORY] = getMissedFieldError(VAL_MEMORY);
      }
      if (!values[VAL_CORES]) {
        errors[VAL_CORES] = getMissedFieldError(VAL_CORES);
      }
    }

    if (!errors[VAL_INSTANCE_NAME]) {
      errors[VAL_INSTANCE_NAME] = validateAlphanumericHyphen(
        values[VAL_INSTANCE_NAME],
      );
    }

    if (!values.project) {
      errors.project = 'Project is required';
    }
    if (!values.type) {
      errors.type = 'Type is required';
    }
    // validate name
    errors[VAL_INSTANCE_NAME] = validateAlphanumericHyphen(
      values[VAL_INSTANCE_NAME],
    );
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={NEW_SESSION_INITIAL_VALUES}
      render={({ handleSubmit, form, submitting, pristine, values }) => {
        const images = state[DATA_IMAGES];
        const projectsOfType = images?.[values[VAL_TYPE]];
        const availableProjects = getProjectNames(projectsOfType) || [];
        const defaultImages = projectsOfType?.[SKAHA_PROJECT] || [];
        const imagesOfProject = getImagesNamesSorted(
          projectsOfType ? projectsOfType[values[VAL_PROJECT]] : defaultImages,
        );
        const defaultImageName =
          DEFAULT_IMAGE_NAMES[values?.[VAL_TYPE]] || undefined;
        const defaultImageId = defaultImageName
          ? imagesOfProject.find((mObj) => mObj.name === defaultImageName)?.id
          : imagesOfProject[0]?.id;
        console.log('form values', values);
        console.log('form imagesOfProject', imagesOfProject);
        console.log('form defaultImageName', defaultImageName);
        console.log('form defaultImageId', defaultImageId);
        return (
          <BootstrapForm onSubmit={handleSubmit}>
            <Field name={VAL_TYPE}>
              {({ input, meta }) => (
                <BootstrapForm.Group as={Row} className="mb-3">
                  <BootstrapForm.Label
                    column="sm"
                    sm="4"
                    className="text-end fw-bold"
                  >
                    {labels.form.type}
                    <FormPopover
                      headerText={'Session Type'}
                      bodyText={
                        'Select from the list of supported session types'
                      }
                    />
                  </BootstrapForm.Label>
                  <Col sm={7}>
                    {hasImages ? (
                      <BootstrapForm.Select
                        {...input}
                        isInvalid={meta.touched && meta.error}
                      >
                        <option value="">Select a type</option>
                        {availableTypes.map((pType) => (
                          <option key={pType} value={pType}>
                            {pType}
                          </option>
                        ))}
                      </BootstrapForm.Select>
                    ) : (
                      <FieldPlaceholder />
                    )}
                  </Col>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_PROJECT}>
              {({ input, meta }) => (
                <BootstrapForm.Group as={Row} className="mb-3">
                  <BootstrapForm.Label
                    column="sm"
                    sm="4"
                    className="text-end fw-bold"
                  >
                    {labels.form.project}
                    <FormPopover
                      headerText={'Project'}
                      bodyText={'The project within which an image created'}
                    />
                  </BootstrapForm.Label>
                  <Col sm={7}>
                    {hasImages ? (
                      <BootstrapForm.Select
                        {...input}
                        isInvalid={meta.touched && meta.error}
                      >
                        <option value="">Select a project</option>
                        {availableProjects.map((prj) => (
                          <option key={prj} value={prj}>
                            {prj}
                          </option>
                        ))}
                      </BootstrapForm.Select>
                    ) : (
                      <FieldPlaceholder />
                    )}
                  </Col>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_IMAGE}>
              {({ input, meta }) => (
                <BootstrapForm.Group as={Row} className="mb-3">
                  <BootstrapForm.Label
                    column="sm"
                    sm="4"
                    className="text-end fw-bold"
                  >
                    {labels.form.container_image}
                    <FormPopover
                      headerText={'Container Image'}
                      bodyText={'The Docker image for the session.'}
                    />
                  </BootstrapForm.Label>
                  <Col sm={7}>
                    {hasImages ? (
                      <BootstrapForm.Select
                        {...input}
                        value={input.value || defaultImageId}
                        isInvalid={meta.touched && meta.error}
                      >
                        <option value="">Select an image</option>
                        {imagesOfProject.map((image: SortedImage) => (
                          <option key={image.id} value={image.id}>
                            {image.name}
                          </option>
                        ))}
                      </BootstrapForm.Select>
                    ) : (
                      <FieldPlaceholder />
                    )}
                  </Col>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field
              name={VAL_INSTANCE_NAME}
              initialValue={
                values?.[VAL_TYPE] ? createSessionName(values?.[VAL_TYPE]) : ''
              }
            >
              {({ input, meta }) => (
                <BootstrapForm.Group as={Row} className="mb-3">
                  <BootstrapForm.Label
                    column="sm"
                    sm="4"
                    className="text-end fw-bold"
                  >
                    {labels.form.session_name}
                    <FormPopover
                      headerText={'Session Name'}
                      bodyText={
                        "Name for the session. Alphanumeric and '-' characters only."
                      }
                    />
                  </BootstrapForm.Label>
                  <Col sm={7}>
                    {hasImages ? (
                      <BootstrapForm.Control
                        {...input}
                        type="text"
                        placeholder="Instance name"
                        isInvalid={meta.touched && meta.error}
                      />
                    ) : (
                      <FieldPlaceholder />
                    )}
                  </Col>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            {values?.[VAL_TYPE] !== DESKTOP && (
              <Field name={VAL_MEMORY}>
                {({ input, meta }) => (
                  <BootstrapForm.Group as={Row} className="mb-3">
                    <BootstrapForm.Label
                      column="sm"
                      sm="4"
                      className="text-end fw-bold"
                    >
                      {labels.form.memory}
                      <FormPopover
                        headerText={'Memory'}
                        bodyText={'System memory (RAM) in gigabytes.'}
                      />
                    </BootstrapForm.Label>
                    <Col sm={7}>
                      {hasImages ? (
                        <BootstrapForm.Select
                          {...input}
                          isInvalid={meta.touched && meta.error}
                        >
                          <option value="">Select instance RAM</option>
                          {state?.[DATA_CONTEXT]?.[PROP_MEMORY]?.[OPTIONS]?.map(
                            (mem) => (
                              <option key={mem} value={mem}>
                                {mem}
                              </option>
                            ),
                          )}
                        </BootstrapForm.Select>
                      ) : (
                        <FieldPlaceholder />
                      )}
                    </Col>
                    <BootstrapForm.Control.Feedback type="invalid">
                      {meta.error}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>
                )}
              </Field>
            )}
            {values?.[VAL_TYPE] !== DESKTOP && (
              <Field name={VAL_CORES}>
                {({ input, meta }) => (
                  <BootstrapForm.Group as={Row} className="mb-3">
                    <BootstrapForm.Label
                      column="sm"
                      sm="4"
                      className="text-end fw-bold"
                    >
                      {labels.form.cores}
                      <FormPopover
                        headerText={'# of Cores'}
                        bodyText={
                          'Number of cores used by the session. Default: 2'
                        }
                      />
                    </BootstrapForm.Label>
                    <Col sm={7}>
                      {hasImages ? (
                        <BootstrapForm.Select
                          {...input}
                          isInvalid={meta.touched && meta.error}
                        >
                          <option value="">
                            Select instance number of cores
                          </option>
                          {state?.[DATA_CONTEXT]?.[PROP_CORES]?.[OPTIONS]?.map(
                            (core) => (
                              <option key={core} value={core}>
                                {core}
                              </option>
                            ),
                          )}
                        </BootstrapForm.Select>
                      ) : (
                        <FieldPlaceholder />
                      )}
                    </Col>
                    <BootstrapForm.Control.Feedback type="invalid">
                      {meta.error}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>
                )}
              </Field>
            )}
            <Row className="mt-3">
              <Col sm={4}> </Col>
              <Col sm={7}>
                {hasImages ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting || !hasImages}
                    size="sm"
                    className="m-1"
                  >
                    Launch
                  </Button>
                ) : (
                  <Placeholder.Button
                    className="sp-button-placeholder"
                    bg="primary"
                    aria-hidden="true"
                    animation="glow"
                  />
                )}

                {hasImages ? (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => form.reset()}
                    disabled={submitting || pristine || !hasImages}
                    size="sm"
                    className="m-1"
                  >
                    Reset
                  </Button>
                ) : (
                  <Placeholder.Button
                    className="sp-button-placeholder"
                    bg="secondary"
                    aria-hidden="true"
                    animation="glow"
                  />
                )}
              </Col>
            </Row>
          </BootstrapForm>
        );
      }}
    />
  );
};

export default NewSessionForm;
