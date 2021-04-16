import { Socket } from 'socket.io';
import { CustomSocketIoServer } from '../socket/CustomSocketIoServer';
import { ID } from '@shared/SharedTypes';
import { ChatEvent } from '@shared/SocketIoEvents';
import { ChatMessage, ChatMessageInput } from './ChatMessage';

const chatHandler = (io: CustomSocketIoServer, socket: Socket): void => {
  const chatMessage = async (
    roomId: ID,
    { body, file }: ChatMessageInput,
    callback: (message: ChatMessage) => void,
  ) => {
    const newMessage = await ChatMessage.createChatMessage({
      socket,
      body,
      file,
    });
    socket.to(roomId).emit(ChatEvent.CHAT_MESSAGE, newMessage);
    callback(newMessage);
  };

  const startedTyping = (roomId: ID) => {
    socket.to(roomId).emit(ChatEvent.STARTED_TYPING, socket.user);
  };

  const finishedTyping = (roomId: ID) => {
    socket.to(roomId).emit(ChatEvent.FINISHED_TYPING, socket.user);
  };

  // TODO: May add this feature later.
  // socket.on(ChatEvent.MESSAGE_RECEIVED, (roomId, messageId, userId) => {
  //   socket.to(roomId).emit(ChatEvent.MESSAGE_RECEIVED, messageId, userId);
  // });

  socket.on(ChatEvent.CHAT_MESSAGE, chatMessage);
  socket.on(ChatEvent.STARTED_TYPING, startedTyping);
  socket.on(ChatEvent.FINISHED_TYPING, finishedTyping);
};

export default chatHandler;
