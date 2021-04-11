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
  const io = useContext(SocketIoContext);
  return io;
}

export function useSocketListener(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: ReservedOrUserListener<any, any, any>,
) {
  const io = useSocketIo();

  useEffect(() => {
    io?.on(event, fn);
    return () => {
      io?.off(event, fn);
    };
  }, [event, fn, io]);
}

export default useSocketIo;
