import React, { useCallback } from 'react';
import {
  DialogTitleProps,
  DialogTitle,
  Typography,
  IconButton,
  IconButtonProps,
  Box,
} from '@material-ui/core';
import { useDialogContext } from './BaseDialog';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import Stack from './Stack';

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseIconButton = styled(IconButton)`
  align-self: center;
`;

type BaseDialogTitleProps = DialogTitleProps & {
  extra?: React.ReactNode;
};

function BaseDialogTitle({ children, extra, ...rest }: BaseDialogTitleProps) {
  const { onClose } = useDialogContext();

  const handleClose = useCallback<NonNullable<IconButtonProps['onClick']>>(
    (e) => {
      onClose?.(e, 'escapeKeyDown');
    },
    [onClose]
  );

  return (
    <StyledDialogTitle disableTypography {...rest}>
      <Typography variant="h6">{children}</Typography>
      <Box display="flex">
        <Stack spacing={1}>
          <div>{extra}</div>
          {onClose && (
            <CloseIconButton
              aria-label="close"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon />
            </CloseIconButton>
          )}
        </Stack>
      </Box>
    </StyledDialogTitle>
  );
}

export default BaseDialogTitle;
