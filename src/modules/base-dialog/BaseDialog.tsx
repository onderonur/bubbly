import React from 'react';
import { DialogProps, Dialog } from '@material-ui/core';
import useIsMobile from '@src/modules/is-mobile/useIsMobile';
import BaseDialogProvider from './BaseDialogContext';

export type BaseDialogProps = DialogProps & {
  responsive?: boolean;
};

function BaseDialog({ responsive, children, ...rest }: BaseDialogProps) {
  const { onClose } = rest;
  const isMobile = useIsMobile();

  return (
    <Dialog fullScreen={responsive && isMobile} {...rest}>
      <BaseDialogProvider onClose={onClose}>{children}</BaseDialogProvider>
    </Dialog>
  );
}

export default BaseDialog;
