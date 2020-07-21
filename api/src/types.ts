declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      JWT_TOKEN_SECRET: string;
      PORT: number;
    }
  }
}

export type ID = string;

export interface SocketUser {
  id: ID;
  username: string;
  socketIds: ID[];
  color: string;
}

export type Maybe<T> = T | null | undefined;

export interface ChatMessage {
  id: ID;
  author: SocketUser;
  body: Maybe<string>;
  timestamp: number;
  file: Maybe<Buffer>;
}

declare global {
  namespace SocketIO {
    export interface Socket {
      user: SocketUser;
    }
  }
}

export interface JwtTokenPayload {
  id: ID;
}

export interface ThemedRoom {
  title: string;
  slug: string;
}
