import React, { useRef, useCallback } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export function useSnack() {
  const { enqueueSnackbar } = useSnackbar();

  const success = useCallback(
    (message: React.ReactNode) => {
      enqueueSnackbar(message, { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  const error = useCallback(
    (message: React.ReactNode) => {
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  return { success, error };
}

type BaseSnackbarContext = React.PropsWithChildren<{}>;

function BaseSnackbarProvider({ children }: BaseSnackbarContext) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notistackRef = useRef<any>();

  // Adding action to all snackbars
  const renderSnackAction = useCallback((key: React.ReactText) => {
    const onClickDismiss = (key: React.ReactText) => () => {
      return notistackRef.current?.closeSnackbar(key);
    };

    return (
      <IconButton color="inherit" size="small" onClick={onClickDismiss(key)}>
        <CloseIcon />
      </IconButton>
    );
  }, []);

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      action={renderSnackAction}
    >
      {children}
    </SnackbarProvider>
  );
}

export default BaseSnackbarProvider;
