import { ID, Maybe } from '@shared/SharedTypes';
import { SocketUser } from '@src/modules/shared/SharedTypes';

export interface ChatMessage {
  id: ID;
  author: SocketUser;
  body: Maybe<string>;
  timestamp: number;
  file?: Maybe<File | ArrayBuffer>;
  isTemporary?: boolean;
}

export interface ChatNotification {
  id: ID;
  body: string;
  timestamp: number;
}

export type ChatItem = ChatMessage | ChatNotification;
