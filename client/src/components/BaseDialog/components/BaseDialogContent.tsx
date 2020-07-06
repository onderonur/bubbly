import React from 'react';
import { DialogContentProps, DialogContent } from '@material-ui/core';

type BaseDialogContentProps = DialogContentProps;

function BaseDialogContent({
  dividers = true,
  children,
  ...rest
}: BaseDialogContentProps) {
  return (
    <DialogContent dividers={dividers} {...rest}>
      {children}
    </DialogContent>
  );
}

export default BaseDialogContent;
