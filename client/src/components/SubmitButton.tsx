import React, { useMemo } from 'react';
import { IconButtonProps, IconButton } from '@material-ui/core';
import { useFormikContext } from 'formik';
import BaseButton, { BaseButtonProps } from 'components/BaseButton';

function useSubmitButton() {
  const { isValid, isSubmitting } = useFormikContext();
  const submitButtonProps = useMemo<
    Pick<BaseButtonProps, 'type' | 'disabled' | 'color'>
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

type SubmitButtonProps = Omit<BaseButtonProps, 'type'>;

function SubmitButton(props: SubmitButtonProps) {
  const submitButtonProps = useSubmitButton();
  return <BaseButton {...props} {...submitButtonProps} />;
}

export default SubmitButton;
