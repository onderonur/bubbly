export type Maybe<T> = T | null | undefined;

export type ID = string;

export interface SocketUser {
  id: ID;
  username: string;
  socketIds: ID[];
  color: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_TITLE: string;
    }
  }
}
