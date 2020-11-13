import React, { useCallback } from 'react';
import { ChromePicker, ChromePickerProps } from 'react-color';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlProps,
  Box,
} from '@material-ui/core';
import { useField, FieldHookConfig, useFormikContext } from 'formik';

type BaseColorPickerProps = FieldHookConfig<string> &
  FormControlProps &
  ChromePickerProps & {
    name?: string;
    label?: string;
  };

const BaseColorPicker = React.memo<BaseColorPickerProps>(
  function BaseColorPicker(props) {
    const [field, meta] = useField<string>(props);
    const { setFieldValue } = useFormikContext();

    const { touched, error } = meta;
    const hasError = Boolean(touched && error);

    const handleChange = useCallback<
      NonNullable<ChromePickerProps['onChange']>
    >(
      (colorResult) => {
        setFieldValue(props.name, colorResult.hex);
      },
      [props.name, setFieldValue]
    );

    return (
      <FormControl {...props} error={hasError}>
        <FormLabel>{props.label}</FormLabel>
        <Box marginTop={1}>
          <ChromePicker
            {...props}
            {...field}
            color={field.value}
            onChange={handleChange}
          />
        </Box>
        {hasError && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
);

export default BaseColorPicker;
