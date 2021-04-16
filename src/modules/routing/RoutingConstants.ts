import { ID } from '@shared/SharedTypes';

export const routes = {
  home: {
    path: () => '/',
  },
  rooms: {
    path: () => '/rooms',
    routes: {
      chatRoom: {
        path: (params: { roomId?: ID } = { roomId: '[roomId]' }) =>
          `/rooms/${params.roomId}`,
      },
    },
  },
};
