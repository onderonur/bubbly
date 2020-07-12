import React from 'react';
import { ButtonProps, Button, Box, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const ButtonProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

export type BaseButtonProps = ButtonProps & {
  loading?: boolean;
};

function BaseButton({ loading, disabled, ...rest }: BaseButtonProps) {
  return (
    <Box position="relative">
      <Button {...rest} disabled={disabled || loading} />
      {loading && <ButtonProgress size={24} />}
    </Box>
  );
}

export default BaseButton;
