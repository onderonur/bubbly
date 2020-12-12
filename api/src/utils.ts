import { ID, SocketUser, Maybe } from './types';
import FileType from 'file-type';
import { nanoid } from 'nanoid';
import notifications, { notify } from './notifications';
import { Response } from 'express';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const getUserBySocketId = (
  appUsers: Map<string, SocketUser>,
  socketId: ID
): Maybe<SocketUser> => {
  // eslint-disable-next-line no-restricted-syntax
  for (const onlineUser of appUsers.values()) {
    if (onlineUser.socketIds.includes(socketId)) {
      return onlineUser;
    }
  }
  return null;
};

const getRoomSocketIds = (io: SocketIO.Server, roomId: ID): ID[] => {
  const room = io.sockets.adapter.rooms[roomId];
  if (!room) {
    return [];
  }
  const { sockets } = io.sockets.adapter.rooms[roomId];
  const roomSocketIds = Object.keys(sockets);
  return roomSocketIds;
};

export const getRoomUsers = (
  io: SocketIO.Server,
  appUsers: Map<string, SocketUser>,
  roomId: ID,
  socket: SocketIO.Socket
): SocketUser[] => {
  const roomSocketIds = getRoomSocketIds(io, roomId);
  let roomUsers = roomSocketIds
    .map((socketId) => getUserBySocketId(appUsers, socketId))
    // Filtering null values
    .filter((user) => !!user) as SocketUser[];
  // Removing duplicate users
  roomUsers = [...new Set(roomUsers)];
  const socketUser = getUserBySocketId(appUsers, socket.id);
  // Placing socketUser as the first in array
  if (socketUser) {
    roomUsers = [
      socketUser,
      ...roomUsers.filter((user) => user.id !== socketUser.id),
    ];
  }
  return roomUsers;
};

export const isUserAlreadyInRoom = (
  io: SocketIO.Server,
  roomId: ID,
  joiningSocket: SocketIO.Socket
): boolean => {
  // Getting user's socket ids other than
  // the current one joining to the room.
  const otherUserSocketIds = joiningSocket.user.socketIds.filter(
    (socketId) => socketId !== joiningSocket.id
  );
  // If user has no other sockets,
  // it means it's the first time they are joining
  if (!otherUserSocketIds.length) {
    return false;
  }
  const roomSocketIds = getRoomSocketIds(io, roomId);
  // If any of the user's other socket ids is in room
  // it means, they are already in the room.
  return otherUserSocketIds.some((socketId) =>
    roomSocketIds.includes(socketId)
  );
};

export const getSocketRoomIds = (socket: SocketIO.Socket): ID[] => {
  const socketRoomIds = Object.keys(socket.rooms);
  return socketRoomIds;
};

export const getUserRoomIds = (
  io: SocketIO.Server,
  socket: SocketIO.Socket
): ID[] => {
  const { socketIds } = socket.user;
  let roomIds = socketIds.flatMap((socketId) =>
    Object.keys(io.sockets.adapter.sids[socketId])
  );
  // Removing duplicate values
  roomIds = [...new Set(roomIds)];
  return roomIds;
};

const didUserLeaveTheRoomCompletely = (
  io: SocketIO.Server,
  roomId: ID,
  leavingSocket: SocketIO.Socket
): boolean => {
  const leavingUser = leavingSocket.user;
  const leavingSocketId = leavingSocket.id;
  // Getting user's socket ids other than the current one
  // leaving the room.
  const remainingUserSocketIds = leavingUser.socketIds.filter(
    (socketId) => socketId !== leavingSocketId
  );
  // If user has no other socket id, it means they
  // completely disconnecting.
  if (!remainingUserSocketIds.length) {
    return true;
  }
  const roomSocketIds = getRoomSocketIds(io, roomId);
  // If none of the user's remaining socket ids is in the room,
  // it means they left the room completely.
  return remainingUserSocketIds.every(
    (socketId) => !roomSocketIds.includes(socketId)
  );
};

export const handleUserLeavingTheRoom = (
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  roomId: ID
): void => {
  const socketUser = socket.user;
  socket.to(roomId).emit('finished typing', socketUser);
  // One of the sockets of user may leave the room.
  // But user's other socket may still be in the room.
  // So, we check if there are any remaining sockets of user
  // in the room or not.
  if (didUserLeaveTheRoomCompletely(io, roomId, socket)) {
    socket.to(roomId).emit('left the room', socketUser);
    notify({
      socket,
      roomId,
      notification: notifications.leftTheRoom(socketUser),
    });
  }
};

// https://stackoverflow.com/a/14572494/10876256
export const trimSpaces = (str: string): string => {
  return str.replace(/^\s+|\s+$/g, '');
};

export const isImageFile = async (file: Buffer): Promise<boolean> => {
  const fileType = await FileType.fromBuffer(file);
  return !!fileType?.mime.startsWith('image/');
};

// https://stackoverflow.com/a/5092872/10876256
const generateRandomHexColor = (): string => {
  return '#000000'.replace(/0/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
};

export const createNewUser = (socket: SocketIO.Socket): SocketUser => {
  return {
    id: nanoid(),
    username: `User-${nanoid(6)}`,
    socketIds: [socket.id],
    color: generateRandomHexColor(),
  };
};

export const convertMBToByte = (mb: number): number => mb * 1024 * 1024;

export const addCacheControl = (
  res: Response,
  options: { maxAge: number; isPrivate?: boolean }
): void => {
  const { maxAge, isPrivate } = options;
  res.setHeader(
    'Cache-Control',
    `${isPrivate ? 'private' : 'public'}, max-age=${maxAge}`
  );
};

const minutesInHour = 60;
const secondsInMinute = 60;

export const hoursToSeconds = (hours: number): number => {
  return hours * minutesInHour * secondsInMinute;
};
