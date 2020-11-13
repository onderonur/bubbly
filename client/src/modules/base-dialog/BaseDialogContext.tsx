import React, { useMemo, useContext } from 'react';
import { DialogProps } from '@material-ui/core';

interface DialogContextValue {
  onClose: DialogProps['onClose'];
}

const DialogContext = React.createContext<DialogContextValue>(
  {} as DialogContextValue
);

export function useDialogContext() {
  const value = useContext(DialogContext);
  return value;
}

type BaseDialogContextProps = React.PropsWithChildren<{}> & DialogContextValue;

function BaseDialogProvider({ onClose, children }: BaseDialogContextProps) {
  const contextValue = useMemo<DialogContextValue>(() => ({ onClose }), [
    onClose,
  ]);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}

export default BaseDialogProvider;
