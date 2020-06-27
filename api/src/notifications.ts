import { SocketUser, ID } from './types';

const NOTIFICATIONS = {
  joinedToRoom: (user: SocketUser): string =>
    `${user.username} has joined to the conversation.`,
  leftTheRoom: (user: SocketUser): string =>
    `${user.username} has left the conversation.`,
  editedUsername: (oldUsername: string, newUsername: string): string =>
    `"${oldUsername}" has changed their name as "${newUsername}".`,
  editedColor: (username: string, newColor: string): string =>
    `${username} has edited their color as ${newColor}.`,
};

interface NotifyArgs {
  socket: SocketIO.Socket;
  roomId: ID;
  notification: string;
}

export const notify = ({ socket, roomId, notification }: NotifyArgs): void => {
  socket.to(roomId).emit('notification', notification);
};

export default NOTIFICATIONS;
