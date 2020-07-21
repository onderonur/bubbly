import { useState, useCallback, useEffect } from 'react';
import { ChatNotification } from '../types';
import { useSocketListener } from 'contexts/SocketIoContext';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { ID } from 'types';

function useChatNotifications(roomId: ID) {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);

  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, [roomId]);

  const handleNotification = useCallback((notification: string) => {
    setNotifications(
      produce((draft: ChatNotification[]) => {
        draft.push({
          id: nanoid(),
          body: notification,
          timestamp: Date.now(),
        });
      })
    );
  }, []);

  useSocketListener('notification', handleNotification);

  return notifications;
}

export default useChatNotifications;
