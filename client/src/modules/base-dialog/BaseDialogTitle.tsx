import React, { useCallback } from 'react';
import {
  DialogTitleProps,
  DialogTitle,
  Typography,
  IconButton,
  IconButtonProps,
  Box,
} from '@material-ui/core';
import { useDialogContext } from './BaseDialogContext';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import Stack from 'modules/shared/Stack';

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1, 2)};
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
    [onClose],
  );

  return (
    <StyledDialogTitle disableTypography {...rest}>
      <Typography variant="h6">{children}</Typography>
      <Box display="flex">
        <Stack spacing={1}>
          <div>{extra}</div>
          {onClose && (
            <CloseIconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </CloseIconButton>
          )}
        </Stack>
      </Box>
    </StyledDialogTitle>
  );
}

export default BaseDialogTitle;
