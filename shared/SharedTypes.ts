declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_BASE_SOCKET_URL: string;
      JWT_TOKEN_SECRET: string;
      NEXT_PUBLIC_APP_TITLE: string;
    }
  }
}

export type ID = string;

export type Maybe<T> = T | null | undefined;

export interface Topic {
  title: string;
  roomId: ID;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
