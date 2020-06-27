import React, { useMemo } from 'react';
import {
  ButtonProps,
  Button,
  IconButtonProps,
  IconButton,
} from '@material-ui/core';
import { useFormikContext } from 'formik';

function useSubmitButton() {
  const { isValid, isSubmitting } = useFormikContext();
  const submitButtonProps = useMemo<
    Pick<ButtonProps, 'type' | 'disabled' | 'color'>
  >(() => {
    return {
      type: 'submit',
      disabled: !isValid || isSubmitting,
      color: 'primary',
    };
  }, [isSubmitting, isValid]);
  return submitButtonProps;
}

type SubmitIconButtonProps = Omit<IconButtonProps, 'type'>;

export function SubmitIconButton(props: SubmitIconButtonProps) {
  const submitButtonProps = useSubmitButton();
  return <IconButton {...props} {...submitButtonProps} />;
}

type SubmitButtonProps = Omit<ButtonProps, 'type'>;

function SubmitButton(props: SubmitButtonProps) {
  const submitButtonProps = useSubmitButton();
  return <Button {...props} {...submitButtonProps} />;
}

export default SubmitButton;
