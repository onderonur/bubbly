import React from 'react';
import {
  Button,
  CircularProgress,
  ButtonProps,
  ButtonTypeMap,
} from '@material-ui/core';
import styled from 'styled-components';

export type BaseButtonProps<
  T extends React.ElementType = ButtonTypeMap['defaultComponent']
> = ButtonProps<T, { component?: T }> & {
  loading?: boolean;
};

const loadingSize = 24;

const ButtonLoading = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -${loadingSize / 2}px;
  margin-left: -${loadingSize / 2}px;
`;

// https://material-ui.com/guides/typescript/#usage-of-component-prop
function BaseButton<T extends React.ElementType>({
  loading,
  disabled,
  variant = 'contained',
  disableElevation = true,
  children,
  ...rest
}: BaseButtonProps<T>) {
  return (
    <Button
      {...rest}
      variant={variant}
      disabled={loading || disabled}
      disableElevation={disableElevation}
    >
      {children}
      {loading && <ButtonLoading size={loadingSize} />}
    </Button>
  );
}

export default BaseButton;
