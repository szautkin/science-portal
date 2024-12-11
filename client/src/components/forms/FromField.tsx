import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import FormPopover from '../common/Popover';

interface PopoverContent {
  headerText: string;
  bodyText: string;
}

interface FormFieldProps<FieldValue = any> {
  name: string;
  label: string;
  children: (
    props: FieldRenderProps<FieldValue, HTMLElement>,
  ) => React.ReactNode;
  popover: PopoverContent;
}

const FormField = <FieldValue,>({
  name,
  label,
  popover,
  children,
}: FormFieldProps<FieldValue>) => (
  <Field name={name}>
    {(fieldProps) => {
      console.log('fieldProps.meta.error', fieldProps.meta.error);
      return (
        <BootstrapForm.Group as={Row} className="mb-3">
          <BootstrapForm.Label column="sm" sm="4" className="text-end fw-bold">
            <FormPopover
              anchor={label}
              headerText={popover.headerText}
              bodyText={popover.bodyText}
            />
          </BootstrapForm.Label>
          <Col sm={7}>
            {children(fieldProps)}
            <BootstrapForm.Control.Feedback type="invalid">
              {fieldProps.meta.error}
            </BootstrapForm.Control.Feedback>
          </Col>
        </BootstrapForm.Group>
      );
    }}
  </Field>
);

export default FormField;
