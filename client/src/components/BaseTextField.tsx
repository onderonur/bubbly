import React, { useCallback } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { useField, FieldHookConfig } from 'formik';

type BaseTextFieldProps = TextFieldProps &
  FieldHookConfig<string> & {
    hideErrors?: boolean;
  };

const BaseTextField = React.memo<BaseTextFieldProps>(function BaseTextField({
  hideErrors,
  onChange,
  ...rest
}) {
  const [field, meta] = useField(rest);
  const { error, touched } = meta;

  const hasError = Boolean(!hideErrors && error && touched);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e);
      field.onChange(e);
    },
    [field, onChange]
  );

  return (
    <>
      <TextField
        {...rest}
        {...field}
        onChange={handleChange}
        error={hasError}
        helperText={hasError && error}
      />
    </>
  );
});

export default BaseTextField;
