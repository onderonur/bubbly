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

export type Maybe<T> = T | null | undefined;

export interface JwtTokenPayload {
  id: ID;
}

export interface Topic {
  title: string;
  roomId: ID;
}
