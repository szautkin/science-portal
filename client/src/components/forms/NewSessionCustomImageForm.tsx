import React from 'react';
import { Form, Field } from 'react-final-form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import BootstrapForm from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FormPopover from '../common/Popover';
import {
  DEFAULT_CORES_NUMBER,
  DEFAULT_RAM_NUMBER,
} from '../utilities/constants';
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
} from '../../context/data/constants';
import {
  IS_AUTHENTICATED,
  USER,
  USER_NAME,
} from '../../context/auth/constants';
import { useData } from '../../context/data/useData';
import { useAuth } from '../../context/auth/useAuth';
import labels from './labels.json';
import { CustomFormValues } from '../../context/data/types';
import { getDefaultSessionName } from '../../utilities/form';
import FieldPlaceholder from '../common/FieldPlaceholder';

interface FormValues {
  sessionName: string;
  selectedType: string;
  image: string;
  repositoryUsername: string;
  repositorySecret: string;
  selectedRAM: number;
  selectedCores: number;
  repositoryHost: string;
}

const NewSessionCustomImageForm = () => {
  const { state } = useData();
  const { state: authState } = useAuth();

  const repositoryHosts = state?.[DATA_PRIVATE_INFO]?.[PROP_REPOSITORIES];
  const availableTypes =
    state?.[DATA_IMAGES] && Object.keys(state[DATA_IMAGES]);

  const initialUsername = authState?.[IS_AUTHENTICATED]
    ? authState?.[USER]?.[USER_NAME]
    : '';

  const initialValues: CustomFormValues = {
    ...NEW_CUSTOM_SESSION_INITIAL_VALUES,
    [VAL_REPO_USER_NAME]: initialUsername,
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

  const onSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
  };

  const createSessionName =
    state?.[DATA_SESSIONS] &&
    getDefaultSessionName(Object.keys(state[DATA_SESSIONS]).length + 1);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, values }) => (
        <BootstrapForm onSubmit={handleSubmit}>
          <fieldset className="mt-3">
            <div className="p-4">
              <legend>Image access</legend>
              <hr />
            </div>

            {/* Repository Host and Image */}
            <BootstrapForm.Group as={Row} className="mb-3">
              <Field name={VAL_REPO_HOST}>
                {({ input, meta }) => (
                  <>
                    <Col sm={4}>
                      <BootstrapForm.Label column="sm">
                        <FormPopover
                          anchor={labels.form.container_image}
                          headerText={labels.popover.container_image.headerText}
                          bodyText={labels.popover.container_image.bodyText}
                        />
                      </BootstrapForm.Label>
                    </Col>
                    <Col sm={3}>
                      {repositoryHosts?.length > 1 ? (
                        <BootstrapForm.Select {...input} size="sm">
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
                        />
                      )}
                      <BootstrapForm.Control.Feedback type="invalid">
                        {meta.error}
                      </BootstrapForm.Control.Feedback>
                    </Col>
                  </>
                )}
              </Field>
              <Field name={VAL_IMAGE}>
                {({ input, meta }) => (
                  <Col sm={4}>
                    <BootstrapForm.Control
                      {...input}
                      type="text"
                      placeholder="project/example-image:1.0.0"
                    />
                    <BootstrapForm.Control.Feedback type="invalid">
                      {meta.error}
                    </BootstrapForm.Control.Feedback>
                  </Col>
                )}
              </Field>
            </BootstrapForm.Group>

            {/* Repository Username */}
            <BootstrapForm.Group as={Row} className="mb-3">
              <Field name={VAL_REPO_USER_NAME}>
                {({ input, meta }) => (
                  <>
                    <Col sm={4}>
                      <BootstrapForm.Label column="sm">
                        <FormPopover
                          anchor={labels.form.repositoryUsername}
                          headerText={
                            labels.popover.repositoryUsername.headerText
                          }
                          bodyText={labels.popover.repositoryUsername.bodyText}
                        />
                      </BootstrapForm.Label>
                    </Col>
                    <Col sm={7}>
                      <BootstrapForm.Control
                        {...input}
                        type="text"
                        placeholder="Repository username"
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {meta.error}
                      </BootstrapForm.Control.Feedback>
                    </Col>
                  </>
                )}
              </Field>
            </BootstrapForm.Group>

            {/* Repository Secret */}
            <BootstrapForm.Group as={Row} className="mb-3">
              <Field name={VAL_REPO_SECRET}>
                {({ input, meta }) => (
                  <>
                    <Col sm={4}>
                      <BootstrapForm.Label column="sm">
                        <FormPopover
                          anchor={labels.form.repositorySecret}
                          headerText={
                            labels.popover.repositorySecret.headerText
                          }
                          bodyText={labels.popover.repositorySecret.bodyText}
                        />
                      </BootstrapForm.Label>
                    </Col>
                    <Col sm={7}>
                      <BootstrapForm.Control
                        {...input}
                        type="password"
                        placeholder="Repository secret"
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {meta.error}
                      </BootstrapForm.Control.Feedback>
                    </Col>
                  </>
                )}
              </Field>
            </BootstrapForm.Group>
          </fieldset>

          <fieldset>
            <div className="p-4">
              <legend>Launch session</legend>
              <hr />
            </div>

            {/* Session Type */}
            <BootstrapForm.Group as={Row} className="mb-3">
              <Field name={VAL_TYPE}>
                {({ input, meta }) => (
                  <>
                    <Col sm={4}>
                      <BootstrapForm.Label column="sm">
                        <FormPopover
                          anchor={labels.form.type}
                          headerText={labels.popover.type.headerText}
                          bodyText={labels.popover.type.bodyText}
                        />
                      </BootstrapForm.Label>
                    </Col>
                    <Col sm={7}>
                      <BootstrapForm.Select {...input} size="sm">
                        {availableTypes?.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </BootstrapForm.Select>
                      <BootstrapForm.Control.Feedback type="invalid">
                        {meta.error}
                      </BootstrapForm.Control.Feedback>
                    </Col>
                  </>
                )}
              </Field>
            </BootstrapForm.Group>

            {/* Instance Name */}
            <BootstrapForm.Group as={Row} className="mb-3">
              <Field name={VAL_INSTANCE_NAME}>
                {({ input, meta }) => (
                  <>
                    <Col sm={4}>
                      <BootstrapForm.Label column="sm">
                        <FormPopover
                          anchor={labels.form.session_name}
                          headerText={labels.popover.session_name.headerText}
                          bodyText={labels.popover.session_name.bodyText}
                        />
                      </BootstrapForm.Label>
                    </Col>
                    <Col sm={7}>
                      {authState?.[IS_AUTHENTICATED] ? (
                        <BootstrapForm.Control
                          {...input}
                          value={
                            input.value || createSessionName(values?.[VAL_TYPE])
                          }
                          type="text"
                          placeholder="Instance name"
                          isInvalid={meta.touched && meta.error}
                        />
                      ) : (
                        <FieldPlaceholder />
                      )}
                      <BootstrapForm.Control.Feedback type="invalid">
                        {meta.error}
                      </BootstrapForm.Control.Feedback>
                    </Col>
                  </>
                )}
              </Field>
            </BootstrapForm.Group>

            {/* Memory Selection - Conditional */}
            {values?.[VAL_TYPE] !== DESKTOP && (
              <BootstrapForm.Group as={Row} className="mb-3">
                <Field name={VAL_MEMORY}>
                  {({ input, meta }) => (
                    <>
                      <Col sm={4}>
                        <BootstrapForm.Label column="sm">
                          <FormPopover
                            anchor={labels.form.memory}
                            headerText={labels.popover.memory.headerText}
                            bodyText={labels.popover.memory.bodyText}
                          />
                        </BootstrapForm.Label>
                      </Col>
                      <Col sm={7}>
                        <BootstrapForm.Select {...input}>
                          {state?.[DATA_CONTEXT]?.[PROP_MEMORY]?.[OPTIONS]?.map(
                            (ram) => (
                              <option key={ram} value={ram}>
                                {ram}
                              </option>
                            ),
                          )}
                        </BootstrapForm.Select>
                        <BootstrapForm.Control.Feedback type="invalid">
                          {meta.error}
                        </BootstrapForm.Control.Feedback>
                      </Col>
                    </>
                  )}
                </Field>
              </BootstrapForm.Group>
            )}

            {/* Cores Selection - Conditional */}
            {values?.[VAL_TYPE] !== DESKTOP && (
              <BootstrapForm.Group as={Row} className="mb-3">
                <Field name={VAL_CORES}>
                  {({ input, meta }) => (
                    <>
                      <Col sm={4}>
                        <BootstrapForm.Label column="sm">
                          <FormPopover
                            anchor={labels.form.cores}
                            headerText={labels.popover.cores.headerText}
                            bodyText={labels.popover.cores.bodyText}
                          />
                        </BootstrapForm.Label>
                      </Col>
                      <Col sm={7}>
                        <BootstrapForm.Select {...input}>
                          {state?.[DATA_CONTEXT]?.[PROP_CORES]?.[OPTIONS]?.map(
                            (cores) => (
                              <option key={cores} value={cores}>
                                {cores}
                              </option>
                            ),
                          )}
                        </BootstrapForm.Select>
                        <BootstrapForm.Control.Feedback type="invalid">
                          {meta.error}
                        </BootstrapForm.Control.Feedback>
                      </Col>
                    </>
                  )}
                </Field>
              </BootstrapForm.Group>
            )}

            {/* Form Buttons */}
            <Row className="mb-3">
              <Col sm={4} />
              <Col sm={7}>
                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  className="me-2"
                >
                  {labels.button.launch}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => form.reset()}
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
