import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  PropsWithChildren,
} from 'react';
import { SocketUser, Maybe } from 'types';
import useSocketIo, { useSocketListener } from './SocketContext';
import { storeToken } from 'utils';

const ViewerContext = React.createContext<Maybe<SocketUser>>(null);

export function useViewer() {
  const viewer = useContext(ViewerContext);
  return viewer;
}

type ViewerProviderProps = React.PropsWithChildren<{}>;

function ViewerProvider({ children }: ViewerProviderProps) {
  const [viewer, setViewer] = useState<Maybe<SocketUser>>(null);

  const io = useSocketIo();

  const getViewerInfo = useCallback(() => {
    io?.emit('who am i', (socketUser: SocketUser, token: string) => {
      storeToken(token);
      setViewer(socketUser);
    });
  }, [io]);

  useEffect(() => {
    getViewerInfo();
  }, [getViewerInfo]);

  useSocketListener('reconnect', getViewerInfo);

  const handleViewerChange = useCallback(
    (socketUser: SocketUser) => {
      if (socketUser.id === viewer?.id) {
        setViewer(socketUser);
      }
    },
    [viewer]
  );

  useSocketListener('edit user', handleViewerChange);

  return (
    <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
  );
}

export default ViewerProvider;
