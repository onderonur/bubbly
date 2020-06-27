import { ID, SocketUser, Maybe } from 'types';

export interface ChatMessage {
  id: ID;
  author: SocketUser;
  body: Maybe<string>;
  timestamp: number;
  file?: Maybe<File | ArrayBuffer>;
  isTemporary?: boolean;
}

export interface ChatFormValues {
  body: Maybe<string>;
  file: Maybe<File>;
}

export interface ChatNotification {
  id: ID;
  body: string;
  timestamp: number;
}
