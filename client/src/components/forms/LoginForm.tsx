// Libs
import React from 'react';
import { Form, Field } from 'react-final-form';

// Components
import { Form as BootstrapForm, Button, Alert } from 'react-bootstrap';
import { ModalFooter, ModalBody } from 'react-bootstrap';

// Hooks
import { useAuth } from '../../context/auth/useAuth';
import { useApp } from '../../context/app/useApp';

// Constants
import {
  APP_LOADING,
  AUTHENTICATING,
  ACCOUNT_REQUEST_URL,
  PASSWORD_RESET_URL,
} from '../../context/app/constants';
import { FORM_ERROR } from 'final-form';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { state: appState } = useApp();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.error(error);
      return { [FORM_ERROR]: 'Login failed. Please try again.' };
    }
  };

  const validate = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {};
    if (!values.username) {
      errors.username = 'Username is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, submitError }) => {
        return (
          <BootstrapForm onSubmit={handleSubmit}>
            <ModalBody className="sp-auth-form-body">
              <Field name="username">
                {({ input, meta }) => (
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Username</BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="text"
                      placeholder="Enter username"
                      isInvalid={meta.touched && meta.error}
                    />
                    <BootstrapForm.Control.Feedback type="invalid">
                      {meta.error}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Password</BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="password"
                      placeholder="Password"
                      isInvalid={meta.touched && meta.error}
                    />
                    <BootstrapForm.Control.Feedback type="invalid">
                      {meta.error}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>
                )}
              </Field>
              <a
                href={PASSWORD_RESET_URL}
                className="account_access_info"
                tabIndex={5}
                title="Forgot Password"
              >
                Forgot your Account information?
              </a>
              <br />
              <a
                href={ACCOUNT_REQUEST_URL}
                className="account_access_info"
                tabIndex={6}
                title="Register"
              >
                Request a CADC Account
              </a>
            </ModalBody>
            <ModalFooter>
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <Button variant="primary" type="submit" disabled={submitting}>
                {appState?.[APP_LOADING]?.[AUTHENTICATING]
                  ? 'Logging in...'
                  : 'Login'}
              </Button>
            </ModalFooter>
          </BootstrapForm>
        );
      }}
    />
  );
};

export default LoginForm;
