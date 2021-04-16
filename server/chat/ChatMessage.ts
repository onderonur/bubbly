import { nanoid } from 'nanoid';
import { ID, Maybe } from '@shared/SharedTypes';
import socketIo from 'socket.io';
import { SocketUser } from '../users/SocketUser';
import { isImageFile } from './chat.utils';
import { trimSpaces } from '../shared/shared.utils';

export interface ChatMessageInput {
  body: Maybe<string>;
  file: Maybe<Buffer | string>;
}

export class ChatMessage {
  id: ID;
  author: SocketUser;
  body: Maybe<string>;
  timestamp: number;
  file: Maybe<Buffer>;

  // We made this "private" to prevent this to be called from outside.
  // We shouldn't use this constructor directly.
  // We should use "createChatMessage" static method to create new messages.
  private constructor(args: {
    socket: socketIo.Socket;
    body: Maybe<string>;
    file: Maybe<Buffer>;
  }) {
    const { body, file, socket } = args;
    this.id = nanoid();
    this.author = socket.user;
    this.body = body;
    this.timestamp = Date.now();
    this.file = file;
  }

  // Because that we can't make the constructor async,
  // we create ChatMessage instances with this static method.
  static createChatMessage = async (
    args: ChatMessageInput & { socket: socketIo.Socket },
  ): Promise<ChatMessage> => {
    const { socket, body, file } = args;
    const trimmedBody = trimSpaces(body ?? '');
    if (!trimmedBody && !file) {
      throw new Error('At least a message body or a file is required.');
    }

    // "file" can be a Buffer or base64 string.
    // base64 string is used for react-native app here.
    let inputFile = null;
    if (file instanceof Buffer) {
      inputFile = file;
    } else if (typeof file === 'string') {
      inputFile = Buffer.from(file, 'base64');
    }

    if (inputFile) {
      const isImage = await isImageFile(inputFile);
      if (!isImage) {
        throw new Error('File is not an image.');
      }
    }

    const message = new ChatMessage({
      socket,
      body: trimmedBody,
      file: inputFile,
    });
    return message;
  };
}
