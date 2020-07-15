import React, { useContext, useEffect, useState } from 'react';
import socketIoClient from 'socket.io-client';
import { getToken } from 'utils';
import { Maybe } from 'types';

const SocketIoContext = React.createContext<
  SocketIOClient.Socket | null | undefined
>(null);

type SocketIoProviderProps = React.PropsWithChildren<{}>;

export function SocketIoProvider({ children }: SocketIoProviderProps) {
  const [io, setIo] = useState<Maybe<SocketIOClient.Socket>>(null);

  useEffect(() => {
    function prepare() {
      const socket = socketIoClient('/', {
        query: { token: getToken() },
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

export function useSocketListener(event: string, fn: Function) {
  const io = useSocketIo();

  useEffect(() => {
    io?.on(event, fn);
    return () => {
      io?.off(event, fn);
    };
  }, [event, fn, io]);
}

export default useSocketIo;
