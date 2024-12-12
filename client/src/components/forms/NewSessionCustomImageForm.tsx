import React from 'react';

// Components
import { Form } from 'react-final-form';
import {
  Form as BootstrapForm,
  Button,
  Row,
  Col,
  Placeholder,
} from 'react-bootstrap';
import FieldPlaceholder from '../common/FieldPlaceholder';
import FormField, { PlainFormField } from './FromField';

// Constants
import {
  DATA_CONTEXT,
  DATA_IMAGES,
  DATA_PRIVATE_INFO,
  DATA_SESSIONS,
  DESKTOP,
  NEW_CUSTOM_SESSION_INITIAL_VALUES,
  OPTIONS,
  PROP_CORES,
  PROP_DEFAULT_CORES,
  PROP_DEFAULT_RAM,
  PROP_MEMORY,
  PROP_REPOSITORIES,
  VAL_CORES,
  VAL_IMAGE,
  VAL_INSTANCE_NAME,
  VAL_MEMORY,
  VAL_REPO_HOST,
  VAL_REPO_SECRET,
  VAL_REPO_USER_NAME,
  VAL_TYPE,
  PROP_SESSION_CORES,
  PROP_SESSION_IMAGE,
  PROP_SESSION_NAME,
  PROP_SESSION_PROJECT,
  PROP_SESSION_RAM,
  PROP_SESSION_TYPE,
  PROP_REPO_USER_NAME,
  PROP_REPO_SECRET,
  NOTEBOOK,
} from '../../context/data/constants';

import {
  DEFAULT_CORES_NUMBER,
  DEFAULT_RAM_NUMBER,
} from '../utilities/constants';

// Hooks
import { useData } from '../../context/data/useData';
import { useAuth } from '../../context/auth/useAuth';

// Messages & labels
import labels from './labels.json';

// Types
import {
  CustomFormValues,
  FormKeys,
  NewCustomSession,
} from '../../context/data/types';

// Utils
import {
  getDefaultSessionName,
  getMissedFieldError,
  validateAlphanumericHyphen,
} from '../../utilities/form';
import FormPopover from '../common/Popover';

const NewSessionCustomImageForm: React.FC = () => {
  const { state, fetchCreateCustomSession } = useData();
  const { state: authState } = useAuth();

  const repositoryHosts = state?.[DATA_PRIVATE_INFO]?.[PROP_REPOSITORIES];
  const availableTypes =
    state?.[DATA_IMAGES] && Object.keys(state[DATA_IMAGES]);
  const createSessionName =
    state?.[DATA_SESSIONS] &&
    getDefaultSessionName(Object.keys(state[DATA_SESSIONS]).length + 1);

  const initialUsername = authState?.IS_AUTHENTICATED
    ? authState?.USER?.USER_NAME
    : '';

  const [initialFormValues, setInitialFormValues] = React.useState(
    NEW_CUSTOM_SESSION_INITIAL_VALUES,
  );

  React.useEffect(() => {
    if (state?.[DATA_CONTEXT]) {
      const newFormValues = {
        ...NEW_CUSTOM_SESSION_INITIAL_VALUES,
        [VAL_REPO_USER_NAME]: initialUsername,
        [VAL_INSTANCE_NAME]: createSessionName(NOTEBOOK),
        [VAL_CORES]: Math.max(
          state?.[DATA_CONTEXT]?.[PROP_CORES]?.[PROP_DEFAULT_CORES] ?? 0,
          DEFAULT_CORES_NUMBER,
        ),
        [VAL_MEMORY]: Math.max(
          state?.[DATA_CONTEXT]?.[PROP_MEMORY]?.[PROP_DEFAULT_RAM] ?? 0,
          DEFAULT_RAM_NUMBER,
        ),
        [VAL_REPO_HOST]: repositoryHosts?.[0] || '',
      };

      setInitialFormValues(newFormValues);
    }
  }, [state, initialUsername]);

  const REQUIRED_FIELDS: FormKeys[] = [
    VAL_INSTANCE_NAME,
    VAL_TYPE,
    VAL_REPO_HOST,
    VAL_IMAGE,
    VAL_REPO_USER_NAME,
    VAL_REPO_SECRET,
  ];

  const validate = (values: CustomFormValues) => {
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

    return errors;
  };

  const onSubmit = async (values: CustomFormValues) => {
    const sessionPayload: NewCustomSession = {
      [PROP_SESSION_TYPE]: values[VAL_TYPE],
      [PROP_SESSION_NAME]: values[VAL_INSTANCE_NAME],
      [PROP_SESSION_IMAGE]: `${values[VAL_REPO_HOST]}/${values[VAL_IMAGE]}`,
      [PROP_REPO_USER_NAME]: values[VAL_REPO_USER_NAME],
      [PROP_REPO_SECRET]: values[VAL_REPO_SECRET],
    };

    if (values[VAL_TYPE] !== DESKTOP) {
      sessionPayload[PROP_SESSION_RAM] = +values[VAL_MEMORY];
      sessionPayload[PROP_SESSION_CORES] = +values[VAL_CORES];
    }

    fetchCreateCustomSession(sessionPayload);
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialFormValues}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <BootstrapForm onSubmit={handleSubmit}>
          <fieldset className="mt-3">
            <div className="p-4">
              <legend>Image access</legend>
              <hr />
            </div>
            <Row className="mb-2">
              <BootstrapForm.Label
                column="sm"
                sm="4"
                className="text-end fw-bold"
              >
                <FormPopover
                  anchor={labels.form.container_image}
                  headerText={labels.popover.container_image.headerText}
                  bodyText={labels.popover.container_image.bodyText}
                />
              </BootstrapForm.Label>
              <Col sm={3} className="mb-2">
                <PlainFormField name={VAL_REPO_HOST}>
                  {({ input, meta }) =>
                    repositoryHosts?.length > 1 ? (
                      <BootstrapForm.Select
                        {...input}
                        size="sm"
                        isInvalid={meta.touched && meta.error}
                      >
                        {repositoryHosts.map((host) => (
                          <option key={host} value={host}>
                            {host}
                          </option>
                        ))}
                      </BootstrapForm.Select>
                    ) : (
                      <BootstrapForm.Control
                        {...input}
                        type="text"
                        disabled={true}
                        isInvalid={meta.touched && meta.error}
                      />
                    )
                  }
                </PlainFormField>
              </Col>
              <Col sm={4} className="mb-2">
                <PlainFormField name={VAL_IMAGE}>
                  {({ input, meta }) => (
                    <BootstrapForm.Control
                      {...input}
                      type="text"
                      placeholder="project/example-image:1.0.0"
                      isInvalid={meta.touched && meta.error}
                    />
                  )}
                </PlainFormField>
              </Col>
            </Row>
            <FormField
              name={VAL_REPO_USER_NAME}
              label={labels.form.repositoryUsername}
              popover={{
                headerText: labels.popover.repositoryUsername.headerText,
                bodyText: labels.popover.repositoryUsername.bodyText,
              }}
            >
              {({ input, meta }) => (
                <BootstrapForm.Control
                  {...input}
                  type="text"
                  placeholder="Repository username"
                  isInvalid={meta.touched && meta.error}
                />
              )}
            </FormField>

            <FormField
              name={VAL_REPO_SECRET}
              label={labels.form.repositorySecret}
              popover={{
                headerText: labels.popover.repositorySecret.headerText,
                bodyText: labels.popover.repositorySecret.bodyText,
              }}
            >
              {({ input, meta }) => (
                <BootstrapForm.Control
                  {...input}
                  type="password"
                  placeholder="Repository secret"
                  isInvalid={meta.touched && meta.error}
                />
              )}
            </FormField>
          </fieldset>

          <fieldset>
            <div className="p-4">
              <legend>Launch session</legend>
              <hr />
            </div>

            <FormField
              name={VAL_TYPE}
              label={labels.form.type}
              popover={{
                headerText: labels.popover.type.headerText,
                bodyText: labels.popover.type.bodyText,
              }}
            >
              {({ input, meta }) => (
                <BootstrapForm.Select
                  {...input}
                  size="sm"
                  isInvalid={meta.touched && meta.error}
                >
                  {availableTypes?.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </BootstrapForm.Select>
              )}
            </FormField>

            <FormField
              name={VAL_INSTANCE_NAME}
              label={labels.form.session_name}
              popover={{
                headerText: labels.popover.session_name.headerText,
                bodyText: labels.popover.session_name.bodyText,
              }}
            >
              {({ input, meta }) => (
                <BootstrapForm.Control
                  {...input}
                  value={createSessionName(values?.[VAL_TYPE])}
                  type="text"
                  placeholder="Instance name"
                  isInvalid={meta.touched && meta.error}
                />
              )}
            </FormField>

            {values?.[VAL_TYPE] !== DESKTOP && (
              <>
                <FormField
                  name={VAL_MEMORY}
                  label={labels.form.memory}
                  popover={{
                    headerText: labels.popover.memory.headerText,
                    bodyText: labels.popover.memory.bodyText,
                  }}
                >
                  {({ input, meta }) => (
                    <BootstrapForm.Select
                      {...input}
                      isInvalid={meta.touched && meta.error}
                    >
                      {state?.[DATA_CONTEXT]?.[PROP_MEMORY]?.[OPTIONS]?.map(
                        (ram) => (
                          <option key={ram} value={ram}>
                            {ram}
                          </option>
                        ),
                      )}
                    </BootstrapForm.Select>
                  )}
                </FormField>

                <FormField
                  name={VAL_CORES}
                  label={labels.form.cores}
                  popover={{
                    headerText: labels.popover.cores.headerText,
                    bodyText: labels.popover.cores.bodyText,
                  }}
                >
                  {({ input, meta }) => (
                    <BootstrapForm.Select
                      {...input}
                      isInvalid={meta.touched && meta.error}
                    >
                      {state?.[DATA_CONTEXT]?.[PROP_CORES]?.[OPTIONS]?.map(
                        (cores) => (
                          <option key={cores} value={cores}>
                            {cores}
                          </option>
                        ),
                      )}
                    </BootstrapForm.Select>
                  )}
                </FormField>
              </>
            )}

            <Row className="mt-3">
              <Col sm={4} />
              <Col sm={7}>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  size="sm"
                  className="m-1"
                >
                  {labels.button.launch}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => form.reset()}
                  disabled={submitting || pristine}
                  size="sm"
                  className="m-1"
                >
                  {labels.button.reset}
                </Button>
              </Col>
            </Row>
          </fieldset>
        </BootstrapForm>
      )}
    />
  );
};

export default NewSessionCustomImageForm;
