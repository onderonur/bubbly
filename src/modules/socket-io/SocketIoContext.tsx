import React, { useContext, useEffect } from 'react';
import { io as socketIo, Socket } from 'socket.io-client';
import { getToken, API_URL } from '@src/modules/shared/SharedUtils';
import { ReservedOrUserListener } from 'socket.io-client/build/typed-events';

const SocketIoContext = React.createContext<Socket>({} as Socket);

type SocketIoProviderProps = React.PropsWithChildren<{}>;

const token = getToken();
const initializedSocket = socketIo(API_URL, {
  query: token ? { token } : undefined,
});

export function useSocketIo() {
  return useContext(SocketIoContext);
}

export function useSocketListener(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: ReservedOrUserListener<any, any, any>,
) {
  const socket = useSocketIo();

  useEffect(() => {
    socket.on(event, fn);
    return () => {
      socket.off(event, fn);
    };
  }, [event, fn, socket]);
}

// Please note that since Socket.IO v3, the Socket instance does not emit any event related
// to the reconnection logic anymore. You can listen to the events on the Manager instance directly:
// https://socket.io/docs/v3/client-socket-instance/
export function useSocketManagerListener(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: ReservedOrUserListener<any, any, any>,
) {
  const socket = useSocketIo();

  useEffect(() => {
    socket.io.on(event, fn);
    return () => {
      socket.io.off(event, fn);
    };
  }, [event, fn, socket]);
}

function SocketIoProvider({ children }: SocketIoProviderProps) {
  useEffect(() => {
    return () => {
      initializedSocket.disconnect();
    };
  }, []);

  return (
    <SocketIoContext.Provider value={initializedSocket}>
      {children}
    </SocketIoContext.Provider>
  );
}

export default SocketIoProvider;
