import React from 'react';
import { Form } from 'formik';

export type BaseFormProps = React.ComponentProps<typeof Form>;

function BaseForm({ ...rest }: BaseFormProps) {
  return <Form autoComplete="off" noValidate={true} {...rest} />;
}

export default BaseForm;
