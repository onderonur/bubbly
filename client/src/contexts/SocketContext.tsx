import React, { useContext, useEffect } from 'react';
import socketIoClient from 'socket.io-client';
import { getToken } from 'utils';

const io = socketIoClient('/', {
  query: { token: getToken() },
});

const SocketIoContext = React.createContext<
  SocketIOClient.Socket | null | undefined
>(null);

type SocketIoProviderProps = React.PropsWithChildren<{}>;

export function SocketIoProvider({ children }: SocketIoProviderProps) {
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
