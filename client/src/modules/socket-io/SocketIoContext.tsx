import React, { useContext, useEffect, useState } from 'react';
import { io as socketIo, Socket } from 'socket.io-client';
import { getToken, API_URL } from 'modules/shared/SharedUtils';
import { Maybe } from 'modules/shared/SharedTypes';
import { ReservedOrUserListener } from 'socket.io-client/build/typed-events';

const SocketIoContext = React.createContext<Maybe<Socket>>(null);

type SocketIoProviderProps = React.PropsWithChildren<{}>;

export function SocketIoProvider({ children }: SocketIoProviderProps) {
  const [io, setIo] = useState<Maybe<Socket>>(null);

  useEffect(() => {
    function prepare() {
      const token = getToken();
      const socket = socketIo(API_URL, {
        path: '/socket-io',
        query: token ? { token } : undefined,
      });
      setIo(socket);
      return () => {
        socket.disconnect();
      };
    }

    prepare();
  }, []);

  return (
    <SocketIoContext.Provider value={io}>{children}</SocketIoContext.Provider>
  );
}

function useSocketIo() {
  const socket = useContext(SocketIoContext);
  return socket;
}

export function useSocketListener(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: ReservedOrUserListener<any, any, any>,
) {
  const socket = useSocketIo();

  useEffect(() => {
    socket?.on(event, fn);
    return () => {
      socket?.off(event, fn);
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
    socket?.io.on(event, fn);
    return () => {
      socket?.io.off(event, fn);
    };
  }, [event, fn, socket]);
}

export default useSocketIo;
