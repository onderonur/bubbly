import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { SocketUser } from '@src/modules/shared/SharedTypes';
import {
  useSocketIo,
  useSocketListener,
  useSocketManagerListener,
} from '../socket-io/SocketIoContext';
import { storeToken } from '@src/modules/shared/SharedUtils';
import ViewerFormModal from './ViewerFormModal';
import { useDialogState } from '@src/modules/base-dialog/BaseDialogHooks';
import { SocketEvent, UsersEvent } from '@shared/SocketIoEvents';
import { Maybe } from '@shared/SharedTypes';

interface ViewerContextValue {
  viewer: Maybe<SocketUser>;
  isEditing: boolean;
  startEditing: VoidFunction;
  finishEditing: VoidFunction;
}

const ViewerContext = React.createContext<ViewerContextValue>(
  {} as ViewerContextValue,
);

export function useViewer() {
  const viewer = useContext(ViewerContext);
  return viewer;
}

type ViewerProviderProps = React.PropsWithChildren<{}>;

function ViewerProvider({ children }: ViewerProviderProps) {
  const [viewer, setViewer] = useState<Maybe<SocketUser>>(null);

  const socket = useSocketIo();

  const getViewerInfo = useCallback(() => {
    socket.emit(
      UsersEvent.WHO_AM_I,
      (socketUser: SocketUser, token: string) => {
        storeToken(token);
        setViewer(socketUser);
      },
    );
  }, [socket]);

  useEffect(() => {
    getViewerInfo();
  }, [getViewerInfo]);

  useSocketManagerListener(SocketEvent.RECONNECT, getViewerInfo);

  const handleViewerChange = useCallback(
    (socketUser: SocketUser) => {
      if (socketUser.id === viewer?.id) {
        setViewer(socketUser);
      }
    },
    [viewer],
  );

  useSocketListener(UsersEvent.EDIT_USER, handleViewerChange);

  const { isOpen, openDialog, closeDialog } = useDialogState();

  const contextValue = useMemo<ViewerContextValue>(
    () => ({
      viewer,
      isEditing: isOpen,
      startEditing: openDialog,
      finishEditing: closeDialog,
    }),
    [closeDialog, isOpen, openDialog, viewer],
  );

  return (
    <>
      <ViewerContext.Provider value={contextValue}>
        {children}
        <ViewerFormModal />
      </ViewerContext.Provider>
    </>
  );
}

export default ViewerProvider;
