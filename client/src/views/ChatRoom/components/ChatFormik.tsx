import React, { useCallback } from 'react';
import { Formik, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { trimString } from 'utils';
import { ChatFormValues } from '../types';

const initialValues: ChatFormValues = { body: '', file: null };

const validationSchema = Yup.object().shape<ChatFormValues>({
  body: Yup.string()
    .label('Message')
    // A message body is required, when there is no file selected.
    .when('file', {
      is: (file) => !file,
      then: Yup.string().required(),
    })
    .transform(trimString),
  // TODO: Will fix this and add some validations for files
  file: Yup.mixed(),
});

type OnSubmit = FormikConfig<ChatFormValues>['onSubmit'];

export type ChatFormikProps = React.PropsWithChildren<{
  onSubmit: (values: ChatFormValues) => void;
}>;

function ChatFormik({ children, onSubmit }: ChatFormikProps) {
  const handleSubmit = useCallback<OnSubmit>(
    (values, formikHelpers) => {
      onSubmit(values);
      formikHelpers.setSubmitting(false);
      formikHelpers.resetForm();
      formikHelpers.validateForm();
    },
    [onSubmit]
  );

  return (
    <Formik<ChatFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {children}
    </Formik>
  );
}

export default ChatFormik;
