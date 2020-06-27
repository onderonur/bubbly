import React, { useMemo, useContext } from 'react';
import { DialogProps, Dialog } from '@material-ui/core';
import useIsMobile from 'hooks/useIsMobile';

export type BaseDialogProps = DialogProps & {
  responsive?: boolean;
};

interface DialogContextValue {
  onClose: BaseDialogProps['onClose'];
}

const DialogContext = React.createContext<DialogContextValue>(
  {} as DialogContextValue
);

export function useDialogContext() {
  const value = useContext(DialogContext);
  return value;
}

function BaseDialog({ responsive, children, ...rest }: BaseDialogProps) {
  const { onClose } = rest;
  const isMobile = useIsMobile();

  const contextValue = useMemo<DialogContextValue>(() => ({ onClose }), [
    onClose,
  ]);

  return (
    <Dialog fullScreen={responsive && isMobile} {...rest}>
      <DialogContext.Provider value={contextValue}>
        {children}
      </DialogContext.Provider>
    </Dialog>
  );
}

export default BaseDialog;
