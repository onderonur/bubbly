import { Socket } from 'socket.io';
import { CustomSocketIoServer } from '../socket/CustomSocketIoServer';
import jwt from 'jsonwebtoken';
import { SocketUser } from './SocketUser';
import notifications, { notify } from '../notifications/notifications.utils';
import { UsersEvent } from '@shared/SocketIoEvents';
import { trimSpaces } from '../shared/shared.utils';

const { JWT_TOKEN_SECRET } = process.env;

const usersHandler = (io: CustomSocketIoServer, socket: Socket): void => {
  const whoAmI = (callback: (user: SocketUser, token: string) => void) => {
    const socketUser = socket.user;
    const token = jwt.sign({ id: socketUser.id }, JWT_TOKEN_SECRET, {
      expiresIn: '1 week',
    });
    callback(socketUser, token);
  };

  const editUser = (
    input: Pick<SocketUser, 'username' | 'color'>,
    callback: (user: SocketUser) => void,
  ) => {
    const socketUser = socket.user;
    const userRoomIds = io.getUserRoomIds(socket);
    const newUsername = trimSpaces(input.username);
    if (newUsername) {
      const oldUsername = socketUser.username;
      if (newUsername && oldUsername !== newUsername) {
        socketUser.username = newUsername;
        userRoomIds.forEach((roomId) => {
          notify({
            socket,
            roomId,
            notification: notifications.editedUsername(
              oldUsername,
              newUsername,
            ),
          });
        });
      }
    }

    const newColor = input.color;
    if (newColor) {
      const oldColor = socketUser.color;
      if (oldColor !== newColor) {
        socketUser.color = newColor;
        userRoomIds.forEach((roomId) => {
          notify({
            socket,
            roomId,
            notification: notifications.editedColor(
              socketUser.username,
              newColor,
            ),
          });
        });
      }
    }

    callback(socketUser);
    io.to(userRoomIds).emit(UsersEvent.EDIT_USER, socketUser);
  };

  socket.on(UsersEvent.WHO_AM_I, whoAmI);
  socket.on(UsersEvent.EDIT_USER, editUser);
};

export default usersHandler;
