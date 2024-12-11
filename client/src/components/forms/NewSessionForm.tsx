// Libs
import React from 'react';

// Components
import { Form, Field } from 'react-final-form';
import {
  Form as BootstrapForm,
  Button,
  Row,
  Col,
  Placeholder,
} from 'react-bootstrap';
import FormPopover from '../common/Popover';
import FieldPlaceholder from '../common/FieldPlaceholder';

// Constants
import {
  DATA_CONTEXT,
  DATA_IMAGES,
  DATA_SESSIONS,
  DESKTOP,
  NEW_SESSION_INITIAL_VALUES,
  NOTEBOOK,
  OPTIONS,
  PROP_CORES,
  PROP_DEFAULT_CORES,
  PROP_DEFAULT_RAM,
  PROP_MEMORY,
  PROP_SESSION_CORES,
  PROP_SESSION_IMAGE,
  PROP_SESSION_NAME,
  PROP_SESSION_PROJECT,
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
  DEFAULT_CORES_NUMBER,
  DEFAULT_IMAGE_NAMES,
  DEFAULT_RAM_NUMBER,
  SKAHA_PROJECT,
} from '../utilities/constants';

// Hooks
import { useData } from '../../context/data/useData';

// Messages & labels
import labels from './labels.json';

// Types
import {
  FormKeys,
  FormValues,
  NewSession,
  SortedImage,
} from '../../context/data/types';

// Utils
import { getImagesNamesSorted, getProjectNames } from '../utilities/utils';
import {
  getDefaultSessionName,
  getMissedFieldError,
  validateAlphanumericHyphen,
} from '../../utilities/form';
import FormField from './FromField';

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

  const [initialFormValues, setInitialFormValues] = React.useState(
    NEW_SESSION_INITIAL_VALUES,
  );

  React.useEffect(() => {
    if (state?.[DATA_CONTEXT]) {
      const images = state[DATA_IMAGES];
      const projectsOfType = images?.[NOTEBOOK];
      const defaultImageName = DEFAULT_IMAGE_NAMES[NOTEBOOK];
      const defaultImages = projectsOfType?.[SKAHA_PROJECT] || [];
      const imagesOfProject = getImagesNamesSorted(defaultImages);
      const defaultImageId = defaultImageName
        ? imagesOfProject.find((mObj) => mObj.name === defaultImageName)?.id
        : imagesOfProject[0]?.id;

      const newFormValues = {
        ...initialFormValues,
        [VAL_TYPE]: NOTEBOOK,
        [VAL_IMAGE]: defaultImageId,
        [VAL_PROJECT]: SKAHA_PROJECT,
        [VAL_INSTANCE_NAME]: createSessionName(NOTEBOOK),
        [VAL_CORES]: Math.max(
          state?.[DATA_CONTEXT]?.[PROP_CORES]?.[PROP_DEFAULT_CORES] ?? 0,
          DEFAULT_CORES_NUMBER,
        ),
        [VAL_MEMORY]: Math.max(
          state?.[DATA_CONTEXT]?.[PROP_MEMORY]?.[PROP_DEFAULT_RAM] ?? 0,
          DEFAULT_RAM_NUMBER,
        ),
      };

      setInitialFormValues(newFormValues);
    }
  }, [state]);

  const onSubmit = async (values: FormValues) => {
    const sessionPayload: NewSession = {
      [PROP_SESSION_PROJECT]: values[VAL_PROJECT],
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
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialFormValues}
      render={({ handleSubmit, form, submitting, pristine, values }) => {
        const images = state[DATA_IMAGES];
        const projectsOfType = images?.[values[VAL_TYPE]];
        const availableProjects = getProjectNames(projectsOfType) || [];
        const defaultImages = projectsOfType?.[values[VAL_PROJECT]] || [];
        const imagesOfProject = getImagesNamesSorted(defaultImages);

        return (
          <BootstrapForm onSubmit={handleSubmit}>
            <FormField
              name={VAL_TYPE}
              label={labels.form.type}
              popover={{
                headerText: labels.popover.type.headerText,
                bodyText: labels.popover.type.bodyText,
              }}
            >
              {({ input, meta }) =>
                hasImages ? (
                  <BootstrapForm.Select
                    {...input}
                    onChange={(v) => {
                      input.onChange(v);
                      const imgType = v.target.value;

                      const projectsOfType = images?.[imgType];
                      const defaultImages =
                        projectsOfType?.[SKAHA_PROJECT] || [];
                      const imagesOfProject =
                        getImagesNamesSorted(defaultImages);
                      const defaultImageName = DEFAULT_IMAGE_NAMES[imgType];

                      const defaultImageId = defaultImageName
                        ? imagesOfProject.find(
                            (mObj) => mObj.name === defaultImageName,
                          )?.id
                        : imagesOfProject[0]?.id;

                      form.batch(() => {
                        form.change(
                          VAL_INSTANCE_NAME,
                          createSessionName(imgType),
                        );
                        form.change(VAL_PROJECT, SKAHA_PROJECT);
                        form.change(VAL_IMAGE, defaultImageId);
                      });
                    }}
                    isInvalid={meta.touched && meta.error}
                  >
                    <option value="">Select a type</option>
                    {availableTypes?.map((pType) => (
                      <option key={pType} value={pType}>
                        {pType}
                      </option>
                    ))}
                  </BootstrapForm.Select>
                ) : (
                  <FieldPlaceholder />
                )
              }
            </FormField>

            <FormField
              name={VAL_PROJECT}
              label={labels.form.project}
              popover={{
                headerText: labels.popover.project.headerText,
                bodyText: labels.popover.project.bodyText,
              }}
            >
              {({ input, meta }) =>
                hasImages ? (
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
                )
              }
            </FormField>

            <FormField
              name={VAL_IMAGE}
              label={labels.form.container_image}
              popover={{
                headerText: labels.popover.container_image.headerText,
                bodyText: labels.popover.container_image.bodyText,
              }}
            >
              {({ input, meta }) =>
                hasImages ? (
                  <BootstrapForm.Select
                    {...input}
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
                )
              }
            </FormField>

            <FormField
              name={VAL_INSTANCE_NAME}
              label={labels.form.session_name}
              popover={{
                headerText: labels.popover.session_name.headerText,
                bodyText: labels.popover.session_name.bodyText,
              }}
            >
              {({ input, meta }) =>
                hasImages ? (
                  <BootstrapForm.Control
                    {...input}
                    type="text"
                    placeholder="Instance name"
                    isInvalid={meta.touched && meta.error}
                  />
                ) : (
                  <FieldPlaceholder />
                )
              }
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
                  {({ input, meta }) =>
                    hasImages ? (
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
                    )
                  }
                </FormField>

                <FormField
                  name={VAL_CORES}
                  label={labels.form.cores}
                  popover={{
                    headerText: labels.popover.cores.headerText,
                    bodyText: labels.popover.cores.bodyText,
                  }}
                >
                  {({ input, meta }) =>
                    hasImages ? (
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
                    )
                  }
                </FormField>
              </>
            )}

            <Row className="mt-3">
              <Col sm={4} />
              <Col sm={7}>
                {hasImages ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting || !hasImages}
                    size="sm"
                    className="m-1"
                  >
                    {labels.button.launch}
                  </Button>
                ) : (
                  <Placeholder.Button
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
                    {labels.button.reset}
                  </Button>
                ) : (
                  <Placeholder.Button
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
