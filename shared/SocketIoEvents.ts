/* eslint-disable no-shadow */
export enum ChatEvent {
  CHAT_MESSAGE = 'chat:chat-message',
  STARTED_TYPING = 'chat:started-typing',
  FINISHED_TYPING = 'chat:finished-typing',
}

export enum RoomsEvent {
  CREATE_ROOM = 'rooms:create-room',
  JOIN_ROOM = 'rooms:join-room',
  LEAVE_ROOM = 'rooms:leave-room',
  JOINED_TO_ROOM = 'rooms:joined-to-room',
  LEFT_THE_ROOM = 'rooms:left-the-room',
}

export enum SocketEvent {
  // These are reserved events of socket.io.
  // So, we can not add some prefix etc.
  DISCONNECTING = 'disconnecting',
  RECONNECT = 'reconnect',
}

export enum UsersEvent {
  WHO_AM_I = 'users:who-am-i',
  EDIT_USER = 'users:edit-user',
}

export enum NotificationsEvent {
  NOTIFICATION = 'notifications:notification',
}
